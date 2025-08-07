## Serverless

### AWS SST


#### util function

1. 查询分为query精确匹配和scan全表扫描，不同的是query可以通过batchGet进行批量查询，然后分别返回对应的结果，而scan每次只能根据一组查询条件去扫描得到0条或多条结果，会消耗较多的RCU，注意控制成本。
2. query的本质也是拼接查询表达式，



```ts
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

0. 搜索AWS相关插件并安装

1. 同步代码安装依赖，新建项目：`npx create-sst@two my-sst-app`，启动：`npx sst dev`

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
