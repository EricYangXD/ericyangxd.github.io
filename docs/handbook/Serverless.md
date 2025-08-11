## Serverless

### AWS SST


#### util function

1. 查询分为query精确匹配和scan全表扫描，不同的是query可以通过batchGet进行批量查询，然后分别返回对应的结果，而scan每次只能根据一组查询条件去扫描得到0条或多条结果，会消耗较多的RCU，注意控制成本。
2. query的本质也是拼接查询表达式，



```ts
// logger.ts
import {Logger} from '@aws-lambda-powertools/logger';

export const logger = new Logger({
  serviceName: process.env.SST_APP,
  logLevel: process.env.SST_STAGE === `prod` ? `INFO` : `DEBUG`,
});

// DbHelper.ts
import {DocumentClient} from 'aws-sdk/lib/dynamodb/document_client';
import {AppRequest} from '../appApi/model/AppRequest';
import {
  ERROR_CODES,
  MESSAGE_ERROR_PREFIX,
  MESSAGE_PARTITION_KEY_PREFIX,
  MESSAGE_SORT_KEY_DESCRIPTION_CODE_PREFIX,
  MESSAGE_SORT_KEY_TITLE_CODE_PREFIX,
} from '../common/Constants';
import {Message} from '../messages/models';

export class DbHelper {
  private readonly putItems: DocumentClient.PutItemInputAttributeMap[];
  private readonly deleteKeys: DocumentClient.Key[];

  constructor() {
    this.putItems = [];
    this.deleteKeys = [];
  }

  addPutItems(appRequest: AppRequest) {
    // Add User Item
    this.putItems.push({
      PartitionKey: `USER#${appRequest.userId}`,
      SortKey: `FID#${appRequest.fid}`,
      FcmToken: appRequest.fcmToken,
      Language: appRequest.language,
      Fid: appRequest.fid,
      UserId: appRequest.userId,
      CreatedAt: appRequest.createdAt,
    });
    // Add Vehicle Items
    for (let vehicleRole of appRequest.vehicleRoles) {
      // if there is a start and expiry date, add 24 hours (86400 seconds) as buffer to the expiry
      const endDate =
        vehicleRole.startDate && vehicleRole.expiry
          ? vehicleRole.expiry + 86400
          : undefined;
      this.putItems.push({
        PartitionKey: `VIN#${vehicleRole.vin}`,
        SortKey: `ROLE#${vehicleRole.role}#FID#${appRequest.fid}`,
        Vin: vehicleRole.vin,
        Role: vehicleRole.role,
        Fid: appRequest.fid,
        StartDate: vehicleRole.startDate,
        Expiry: endDate,
        UserId: appRequest.userId,
        CreatedAt: appRequest.createdAt,
      });
    }
  }

  addMessagePutItems(message: Message) {
    let partitionKey = `${MESSAGE_PARTITION_KEY_PREFIX}${message.code}`;
    let sortKey = `${MESSAGE_SORT_KEY_TITLE_CODE_PREFIX}${message.titleCode}${MESSAGE_SORT_KEY_DESCRIPTION_CODE_PREFIX}${message.descriptionCode}`;
    if (ERROR_CODES.includes(message.descriptionCode)) {
      partitionKey = `${MESSAGE_ERROR_PREFIX}${message.descriptionCode}`;
      sortKey = `${MESSAGE_ERROR_PREFIX}${message.descriptionCode}`;
    }
    this.putItems.push({
      PartitionKey: partitionKey,
      SortKey: sortKey,
      code: message.code,
      descriptionCode: message.descriptionCode,
      titleCode: message.titleCode,
      ignored: message.ignored,
      silent: message.silent,
      localizedNotifications: message.localizedNotifications,
    });
  }

  addDeleteKey(partitionKey: string, sortKey: string) {
    this.deleteKeys.push({
      PartitionKey: partitionKey,
      SortKey: sortKey,
    });
  }

  getPutItems(): DocumentClient.PutItemInputAttributeMap[] {
    return this.putItems;
  }

  getDeleteKeys(): DocumentClient.Key[] {
    return this.deleteKeys;
  }
}


// DynamoDbService.ts
import * as AWS from 'aws-sdk';
import {DocumentClient} from 'aws-sdk/clients/dynamodb';
import {InternalResponse} from './InternalResponse';
import {DbHelper} from './DbHelper';
import {AppRequest} from '../appApi/model/AppRequest';
import {logger} from '../common';
import {Message} from '../messages/models';

const USER_PARTITION_KEY_INDEX = 'UserPartitionKeyIndex';

export default class DynamoDbService {
  deviceTableName: string;
  messageTableName: string;
  dynamoDb: DocumentClient;

  constructor(deviceTableName: string, messageTableName: string) {
    this.deviceTableName = deviceTableName;
    this.messageTableName = messageTableName;
    this.dynamoDb = new AWS.DynamoDB.DocumentClient({
      region: process.env.AWS_DEFAULT_REGION,
      apiVersion: '2025-08-10',
      maxRetries: 3,
    });
  }

  async batchGetByKeys(messageTableQueryKeys: DocumentClient.Key[]): Promise<DocumentClient.BatchGetResponseMap> {
    if (!this.messageTableName) {
      throw new Error('Message table name is not defined');
    }
    const messageTableQuery: DocumentClient.BatchGetItemInput = {
      RequestItems: {
        [`${this.messageTableName}`]: {
          Keys: messageTableQueryKeys,
        },
      },
    };
    return await this.batchGet(messageTableQuery);
  }

  async queryByUserIdAndVin(userId: string, vin: string): Promise<DocumentClient.ItemList> {
    const filterExpression = 'attribute_not_exists(Vin) OR Vin = :vin';
    const keyConditionExpression = 'UserId = :userId';
    const expressionAttributeValues = {
      ':userId': `${userId}`,
      ':vin': `${vin}`,
    };
    return await this.query(
      this.assembleDeviceQueryInput(
        USER_PARTITION_KEY_INDEX,
        keyConditionExpression,
        expressionAttributeValues,
        filterExpression,
      ),
    );
  }

  async queryByUserId(userId: string): Promise<DocumentClient.ItemList> {
    const keyConditionExpression = 'UserId = :userId';
    const expressionAttributeValues = {':userId': `${userId}`};
    return await this.query(
      this.assembleDeviceQueryInput(
        USER_PARTITION_KEY_INDEX,
        keyConditionExpression,
        expressionAttributeValues,
      ),
    );
  }

  async queryVinsByUserIdFilterByFid(userId: string, fid: string): Promise<DocumentClient.ItemList> {
    const filterExpression = 'Fid = :fid';
    const keyConditionExpression =
      'UserId = :userId AND begins_with(PartitionKey, :vin)';
    const expressionAttributeValues = {
      ':userId': `${userId}`,
      ':fid': `${fid}`,
      ':vin': 'VIN#',
    };
    return await this.query(
      this.assembleDeviceQueryInput(
        USER_PARTITION_KEY_INDEX,
        keyConditionExpression,
        expressionAttributeValues,
        filterExpression,
      ),
    );
  }

  assembleDeviceQueryInput(
    indexName: string,
    keyConditionExpression: string,
    expressionAttributeValues: DocumentClient.ExpressionAttributeValueMap,
    filterExpression?: string,
    expressionAttributeNames?: DocumentClient.ExpressionAttributeNameMap,
    projectionExpression?: string,
  ): DocumentClient.QueryInput {
    const queryInput: DocumentClient.QueryInput = {
      TableName: this.deviceTableName,
      IndexName: indexName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    };
    if (filterExpression) {
      queryInput.FilterExpression = filterExpression;
    }
    if (expressionAttributeNames) {
      queryInput.ExpressionAttributeNames = expressionAttributeNames;
    }
    if (projectionExpression) {
      queryInput.ProjectionExpression = projectionExpression;
    }
    return queryInput;
  }

  private async query(queryInput: DocumentClient.QueryInput): Promise<DocumentClient.ItemList> {
    const output = await this.dynamoDb.query(queryInput).promise();
    if (output.Count && output.Count > 0 && output.Items) {
      return output.Items;
    }
    logger.debug('Items Empty', {queryInput: queryInput});
    return [];
  }

  private async batchGet(batchGetQueryInput: DocumentClient.BatchGetItemInput): Promise<DocumentClient.BatchGetResponseMap> {
    const output = await this.dynamoDb.batchGet(batchGetQueryInput).promise();
    if (output.Responses) {
      return output.Responses;
    }
    return {};
  }

  async deleteEntries(userId: string, fid: string) {
    const dbHelper = new DbHelper();
    const vinQueryOutput = await this.queryVinsByUserIdFilterByFid(userId, fid);

    // Add user and device to the list of items to delete
    dbHelper.addDeleteKey(`USER#${userId}`, `FID#${fid}`);

    // Add all Vin entries for that particular user to the list of items to delete
    vinQueryOutput.forEach(function (item) {
      dbHelper.addDeleteKey(item.PartitionKey, item.SortKey);
    });
    return this.batchDeleteByKeys(
      dbHelper.getDeleteKeys(),
      this.deviceTableName,
    );
  }

  async batchDeleteByKeys(deleteQueryKeys: DocumentClient.Key[], tableName: string) {
    const deleteItems: DocumentClient.WriteRequest[] = [];
    deleteQueryKeys.forEach((key) => {
      deleteItems.push({
        DeleteRequest: {
          Key: key,
        },
      });
    });
    return this.batchWriteTableParams(deleteItems, 'Delete', tableName);
  }

  async saveEntities(appRequest: AppRequest) {
    const dbHelper = new DbHelper();
    dbHelper.addPutItems(appRequest);
    return await this.batchWriteItems(
      dbHelper.getPutItems(),
      this.deviceTableName,
    );
  }

  async saveMessage(message: Message) {
    const dbHelper = new DbHelper();
    dbHelper.addMessagePutItems(message);
    return await this.batchWriteItems(
      dbHelper.getPutItems(),
      this.messageTableName,
    );
  }

  async batchWriteItems(writeItemList: DocumentClient.PutItemInputAttributeMap[], tableName: string) {
    const writeRequests: DocumentClient.WriteRequest[] = [];
    writeItemList.forEach((item) => {
      writeRequests.push({
        PutRequest: {
          Item: item,
        },
      });
    });
    return this.batchWriteTableParams(writeRequests, 'Put', tableName);
  }

  async batchWriteTableParams(writeRequests: DocumentClient.WriteRequest[], action: string, tableName: string) {
    const bulkPutParams = {
      RequestItems: {
        [`${tableName}`]: writeRequests,
      },
    };
    const response: InternalResponse = {
      success: true,
      statusCode: 200,
      body: '',
      headers: {'Content-Type': 'application/json'},
      action: action,
    };

    await this.dynamoDb.batchWrite(bulkPutParams, function (err, data) {
        if (err) {
          logger.error('Error while writing to DynamoDB', {
            error: err,
            data: data,
          });
          response.success = false;
          response.statusCode =
            err.statusCode === undefined ? 500 : err.statusCode;
          response.body = err.message === undefined ? '' : err.message;
        }
      })
      .promise();
    return response;
  }

  async scanByMultiConditions(searchConditions: Record<string, string | string[]>, tableName = this.messageTableName): Promise<[string, DocumentClient.ItemList]> {
    const filterExpressions = [];
    const expressionAttributeValues: DocumentClient.ExpressionAttributeValueMap =
      {};

    let index = 0;
    for (let [attributeName, searchValue] of Object.entries(searchConditions)) {
      if (Array.isArray(searchValue)) {
        const arrayConditions = [];
        for (let value of searchValue) {
          const valueKey = `:searchValue${index++}`;
          arrayConditions.push(`contains(${attributeName}, ${valueKey})`);
          expressionAttributeValues[valueKey] = value;
        }
        if (arrayConditions.length > 0) {
          filterExpressions.push(`(${arrayConditions.join(' AND ')})`);
        }
      } else {
        const valueKey = `:searchValue${index++}`;
        filterExpressions.push(`contains(${attributeName}, ${valueKey})`);
        expressionAttributeValues[valueKey] = searchValue;
      }
    }

    const params: DocumentClient.ScanInput = {
      TableName: tableName,
      FilterExpression: filterExpressions.join(' AND '),
      ExpressionAttributeValues: expressionAttributeValues,
    };

    const sortKey = searchConditions.SortKey as string;
    try {
      const result = await this.dynamoDb.scan(params).promise();
      return [sortKey, result.Items] || [];
    } catch (err) {
      logger.error('Error retrieving messages from DynamoDB', err);
    }
  }
}

```


#### 如何创建一个AWS SST项目

0. 搜索AWS相关插件并安装，aws-cli，等

1. 同步代码安装依赖，新建项目：`npx create-sst@two my-sst-app`，启动：`npx sst dev`， `npm start`，可以在`.sst/stage`下自定义stage名称。

2. 配置本地开发调试环境，通过调试启动项目之后可以在编辑器中打断点
   
   ```json
   {
   "version": "0.2.0",
   "configurations": [
    {
      "name": "Debug SST",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/sst",
      "args": ["dev"],
      "runtimeArgs": ["start", "--increase-timeout"],
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"],
      "env": {
        "AWS_PROFILE": "xinde-yang-dev",
        "NODE_ENV": "development"
      }
    }
   ]
   }
   ```

3. 对于npm私服需要登录`npm login --registry=https://ecoplatform.jfrog.io/artifactory/api/npm/npm-eco-platform/ --auth-type=web --scope="@<SCOPE>"`，登录之后配置`${HOME}/.npmrc`或者添加到项目中也行

4. 根据配置创建DB，可以配置数据库详细信息

```ts
// DbStack.ts
import {StackContext, Table} from 'sst/constructs';

export function DbStack({stack}: StackContext) {
  const deviceTable = new Table(stack, 'DeviceTable', {
    fields: {
      PartitionKey: 'string',
      SortKey: 'string',
      FcmToken: 'string',
      Language: 'string',
      StartDate: 'number',
      Expiry: 'number',
      FID: 'string',
      UserId: 'string',
      Vin: 'string',
      createdAt: 'string',
    },
    primaryIndex: {
      partitionKey: 'PartitionKey',
      sortKey: 'SortKey',
    },
    globalIndexes: {
      UserPartitionKeyIndex: {
        partitionKey: 'UserId',
        sortKey: 'PartitionKey',
      },
      VinPartitionKeyIndex: {
        partitionKey: 'Vin',
        sortKey: 'PartitionKey',
      },
      UserFIDIndex: {
        partitionKey: 'UserId',
        sortKey: 'FID',
      },
    },
    timeToLiveAttribute: 'Expiry',
  });

  const messageTable = new Table(stack, 'MessageTable', {
    fields: {
      PartitionKey: 'string',
      SortKey: 'string',
      code: 'string',
      descriptionCode: 'string',
      titleCode: 'string',
      ignored: 'string',
      silent: 'string',
      timeToLive: 'number',
    },
    primaryIndex: {
      partitionKey: 'PartitionKey',
      sortKey: 'SortKey',
    },
    globalIndexes: {
      MessageQueryIndex: {
        partitionKey: 'descriptionCode',
        sortKey: 'PartitionKey',
      },
    },
  });

  return {deviceTable, messageTable};
}
```

5. `aws sts get-caller-identity --profile xinde-yang-dev` 查看某个环境的凭证配置

6. `aws sso login` 登录之后从AWS access portal=>应用=>获取 `[PowerUser]` 的凭证=>AWS IAM Identity Center 凭证（推荐），获取需要配置的SSO URL和region

7. 跑测试的时候需要更新本地配置的.env文件，访问秘钥从AWS access portal处获取

8. `npx sst secrets list --stage xinde-yang-dev` 查询某个环境下的secrets等配置
9. SST部署之前需要配置AWS证书，Access Key & Secret，`aws configure --profile env-name`
  
10. 本地测试：`AWS_PROFILE=smartDev npx sst dev --stage dev --region eu-central-1`
  
11. 单元测试：`AWS_PROFILE=smartDev npx sst bind "vitest run"`
  
12. 部署：`AWS_PROFILE=smartDev npx sst deploy --stage dev --region eu-central-1`

13. 配置环境参数
   
   ```ts
   // 配置secrets
   // 增、改
   AWS_PROFILE=smartDev npx sst secrets set <TOKEN_NAME> <TOKEN_VALUE> --stage dev --region eu-central-1
   // 查
   AWS_PROFILE=smartDev npx sst secrets get <TOKEN_NAME> --stage dev --region eu-central-1
   // 删
   AWS_PROFILE=smartDev npx sst secrets remove <TOKEN_NAME> --stage dev --region eu-central-1

   npx sst secrets set STRIPE_KEY_XINDE sk_test_abc123
   npx sst configs  --stage prod set STRIPE_KEY_XINDE sk_test_abc123 指定stage
   // 直接在aws cloudshell中配置
   aws ssm put-parameter --name "/sst/my-app/xinde-yang-dev/Secret/MESSAGE_API_KEY/value" --type SecureString --value "xxx" --region eu-central-1
   
   如果你已经安装并配置好 AWS CLI，就可以通过下面的命令来创建参数：
   
   ① 创建普通字符串类型的参数：
     aws ssm put-parameter --name "/my/parameter" --type String --value "这是参数值"
   
   ② 创建 SecureString（加密型）参数：
     aws ssm put-parameter --name "/my/secure/parameter" --type SecureString --value "密文参数值"
   
   ③ 如果需要更新已经存在的参数，则需要加上 --overwrite 参数：
     aws ssm put-parameter --name "/my/parameter" --type String --value "新值" --overwrite
   
   命令执行后，就会在 Parameter Store 中创建或更新相应的参数。
   
   // 设置正确的token和secret key之后，通过aws插件连接对应的环境，之后就可以通过这个命令来设置SSM的secret和parameter。
   // 获取使用config
   import { Config } from "sst/node/config";
   export async function getServerSideProps() { 
     console.log(Config.VERSION, Config.STRIPE_KEY);
   
     return { props: { loaded: true } };
   }
   
   // 为某个应用绑定
   const site = new NextjsSite(stack, "site", {
   + bind: [VERSION, STRIPE_KEY],
     path: "packages/web",
   });
   
   // 在代码中定义
   const VERSION = new Config.Parameter/Secret(stack, "VERSION", { value: "1.2.0",});
   ```

14. 本地项目配置:

```textile
.aws 文件夹下主要有两个文件，分别为 credentials 和 config，它们的主要作用如下：
credentials 文件：
  • 用于存储 AWS 访问凭证，包括 Access Key ID、Secret Access Key，有时还会包含 Session Token。这些凭证用于身份验证，确保你在使用 AWS CLI、SDK 或其他工具时拥有合法的权限访问 AWS 资源。格式通常采用 ini 格式，支持配置多个 profile，每个 profile 都对应一组凭证。

config 文件：
  • 用于存储 AWS 客户端的配置信息，比如默认的区域（region）、输出格式等。 文件中也支持配置多个 profile，每个 profile 可以有不同的区域设置等。

总的来说，credentials 文件主要管理访问权限信息，而 config 文件则配置一些环境和客户端设置。两者配合使用，使得 AWS CLI 和 SDK 能够方便地进行身份认证和环境配置。
```

15. `ssm  system manager - prameter store -config.secret search  key`
16. `npx eslint --ext .ts,.vue src/utils/http/index.ts --fix`
      `"lint:fix": "vue-tsc --noEmit --noEmitOnError --pretty && eslint --ext .ts,.vue src --fix"`
17. 一个stack就是一个最小的资源，可以用来部署，可能包含多个不同的资源
18. datadog管理日志的工具，快速查看某些服务下的日志
19. 在cloudformation的resource tab下，会列出所有创建的资源
20. 多次请求的日志可能会根据vin或者其他条件聚合到一条记录里


1. **必须重新部署应用**才能让更新的 SSM 参数生效， `{{resolve:ssm:...}}` 会在 **部署阶段** 将 SSM 参数值硬编码到 Lambda 环境变量中，运行时不会动态更新。`npx sst deploy`，如果使用 `sst dev` 开发模式，也需要重启本地开发环境。

2. **动态获取方式**：
   
   * 无需重新部署，参数修改后下一次 Lambda 执行立即生效。
   
   * **代价**：增加约 100ms 的 SSM API 调用延迟。
   
   ```
   // 1. 移除环境变量中的 `{{resolve:ssm:...}}` 定义
   // 2. 在代码中动态获取（示例）
   import { SSM } from "aws-sdk";
   const ssm = new SSM();
   
   export async function handler() { 
       const paramName = `/sst/push-platform/${process.env.currentStage}/Parameter/MPM_DESCCODE_LIST/value`; 
       const { Parameter } = await ssm.getParameter({ Name: paramName, WithDecryption: true }).promise(); 
       const MPM_DESCCODE_LIST = Parameter?.Value; 
       console.log(MPM_DESCCODE_LIST); // 每次执行获取最新值
   }
   ```

3. | `Config.Parameter + fetch()` | 仅注入参数名 | 每次执行动态获取最新值 |
   | ---------------------------- | ------ | ----------- |

4. **静态注入（部署时注入）**  
   在 `sst.config.ts` 中使用 `Config` 模块直接注入值（如 `MY_PARAM: new Config.Parameter(...)`），则需重新部署。

5. ```
   XXX:{{resolve:ssm:/sst/${app.name}/${currentStage}/Parameter/MPM_DESCCODE_LIST/value:2}}
   // 不加上:2版本号则默认使用最新版本，但是仍需要重新部署
   ```
   
 


#### Pipeline Buildkite

```yaml
definitions:
  plugins:
    - &docker-node-plugin
      'https://bitbucket.org/xxx/docker-buildkite-plugin#v1.0.10':
        image: 'node:22-alpine'
    - &cache-plugin
      cache#v1.3.0:
        manifest: package-lock.json
        path: node_modules
        restore: pipeline
        save: file
    - &common-plugins [*docker-node-plugin, *cache-plugin]

steps:
  - label: ':npm: Dependencies'
    key: dependencies
    plugins: *common-plugins
    command: npm ci

  - label: ':vitest: Tests & coverage'
    key: test
    depends_on: [dependencies]
    plugins: *common-plugins
    command: npm run coverage -- --require-approval never --stage $${TARGET}
    env:
      TARGET: 'dev'

  - group: ':npm: Quality'
    steps:
      - label: ':prettier: Code style'
        key: style
        depends_on: [dependencies]
        plugins: *common-plugins
        command: npm run format:check

  - group: ':aws: Deploy'
    steps:
      - block: ':shipit: Deploy PlatformDev'
        key: block_dev

      - label: ':cloudformation: Deploy PlatformDev'
        key: deploy_dev
        depends_on: block_dev
        plugins: [*cache-plugin, *docker-node-plugin]
        command: npm run deploy -- --require-approval never --stage $${TARGET}
        env:
          TARGET: 'dev'

      - block: ':shipit: Deploy PlatformProd'
        key: block_prod
        branches: 'main'

      - label: ':cloudformation: Deploy PlatformProd'
        depends_on: block_prod
        branches: 'main'
        plugins:
          - *cache-plugin
          - *docker-node-plugin
        command: npm run deploy -- --require-approval never --stage $${TARGET}
        env:
          TARGET: 'prod'


```
