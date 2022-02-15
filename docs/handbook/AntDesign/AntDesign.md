---
title: 重点记录一些 antd 组件库使用时遇到的问题以及解决方法
author: EricYangXD
date: "2021-12-29"
---

## Form 组件

### 使用

#### Form

```
  labelCol: { span: 6, offset: 2 }, 大小;
  wrapperCol: { span: 16 };
  preserve: boolean 当字段被删除时保留字段值;
  initialValues: 设置表单域的值，优先级高于 Item，不能被 setState 动态更新，需要用 setFieldsValue 来更新;
  validateTrigger: 统一设置字段触发验证的时机-['onChange','onFocus','onBlur'];
  onFieldsChange: 字段更新时触发回调事件 function(changedFields, allFields);
  onFinish: 提交表单且数据验证成功后回调事件;
  onValuesChange: 字段值更新时触发回调事件;
  form.validateFields(func):手动校验表单内容;
  Form.create()(MyFormModal):通过 create 方法传入 form 参数，之后在 MyFormModal 组件里就可以接收 form，并使用;
  import { WrappedFormUtils } from 'antd/lib/form/Form.d';// interface Props {form: WrappedFormUtils;}
```

#### Form.Item

-   一种用法：3.x 版本

```js
  const { getFieldDecorator } = form;

  <Form.Item label="我的理由" className="reason" colon={false}>
    {getFieldDecorator('**reason**', {
      rules: [
        { required: true, message: '理由不能为空' }
        { max: 500, message: '不超过500个字' },
      ],
      initialValue: '',
    })(
      <TextAreaWithNum
        placeholder="不超过500个字"
        style={{ height: 200, width: 500 }}
        max={500}
      />
    )}
  </Form.Item>
```

```
  initialValue: 设置子元素默认值，如果与 Form 的 initialValues 冲突则以 Form 为准;
  normalize: 组件获取值后进行转换，再放入 Form 中。不支持异步,(value, prevValue, prevValues) => any;
  tooltip: 配置提示信息;
  colon: 配合 label 属性使用，表示是否显示 label 后面的冒号;
  rules: 校验规则;
```

```js
  {
    required: true,
    message: 'Please input your password!',
    max:20,
    validator: customFunc(rule: Rule, value: string, cb: Promise),
  }
```

#### Form.List

-   为字段提供数组化管理;

```js
<Form.List>
	{(fields) =>
		fields.map((field) => (
			<Form.Item {...field}>
				<Input />
			</Form.Item>
		))
	}
</Form.List>
```

### 校验

```
  const [form] = Form.useForm();此时会报错：Warning: Instance created by `useForm` is not connected to any Form element. Forget to pass `form` prop?官方没给出合理的处理方式；
  <Form> 有 form 属性，设为上面的{form}， 可以通过 form.validateFields().then()去校验整个 Form 表单的字段；
  scrollToFirstError：长表单校验自动滚动；
  form.getFieldsValue();获取表单各项的值；
  form.setFieldsValue();设置表单区域的值；
  form.resetFields();重置表单的值；// tips:在 onOK 方法中使用 resetFields 不当会导致视觉交互问题。
  onValuesChange：表单数据变化监听事件；
  <Form.Item> 设置 rule 进行单项校验：required、max、validateTrigger:['onChange', 'onBlur','onFocus']、validator:customFunc 自定义校验方法；
  对于 customFunc 自定义校验方法：能接收到 rule、value、callback，通过判断 value，然后返回 Promise.resolve()/Promise.reject('提示内容')；
  修改 Form.Item 中的 Input 的 hover 样式，重点在 validate 失败时 border 的颜色要变红
```

```css
// 全局 important
.ant-form-item-has-error .ant-input,
.ant-form-item-has-error .ant-input-affix-wrapper {
	&:hover {
		border-color: red !important;
	}
}
// 在 Input
.ant-input-affix-wrapper {
	&:hover,
	&:focus {
		border-color: purple;
	}
}
```

## Modal 组件

### 使用

```

  getContainer={Boolean | HTMLElement}：默认挂载到 document.body；
  forceRender：强制刷新；
  destroyOnClose：关闭的时候销毁组件；
  maskClosable={false}：点击蒙层是否关闭；
  afterClose={() => form.resetFields()：配合<Form 在一定程度上解决 Modal 关闭后清空 Form 内容
  Antd 4.x <Modal /> 和 Form 一起配合使用时，设置 destroyOnClose 为 true，并且还需要设置 <Form preserve={false} />,还需要手动设置 form.resetFields() 来重置 Form 表单的值。
  Antd 3.x 函数组件需要配合 forwardRef
  使用 Modal.warn()等方法直接弹窗提示时，可以通过 className 属性添加自定义 css 样式，配合 styled-components 的 createGlobalStyle 创建全局样式文件，可以覆盖 html 的全局样式，然后在 index.tsx 中引入，作为 component 使用即可，和 AppRouter 放在一层。
```

## AutoComplete、Select 组件

### 使用

```
  getPopupContainer={(triggerNode) => triggerNode.parentNode}：挂载到 DOM，防止 options 列表滑动；
  dropdownRender：渲染自定义 ReactNode；
  onSelect={this.onSelect}
  onSearch={this.onSearch}
  dataSource：数据；
  阻止冒泡：Option 的点击事件 e 中会抛出，e.stopPropagation();e.preventDefault();return false;三连看情况；
```

## Upload

### 使用方式

-   API 有点怪异，使用 action 的话需要把 URL 直接写在代码里，而实际应用场景中 service 都会统一封装，所以不建议使用官方的示例那种用法

-   自定义用法：使用参考[这里](https://github.com/EricYangXD/LearnReact/tree/master/public/wiki/demos/uploadFile);

```js
  showUploadList={{
    showPreviewIcon: true,
    showDownloadIcon: true,
    downloadIcon: 'download',
    showRemoveIcon: true,
    removeIcon: 'delete',
  }}
```

-   customRequest={this.upload}：自定义上传方法；upload(option):option 包含文件信息：option.file.type、option.file.name...可以进行文件校验；
-   如何显示下载链接？请使用 fileList 属性设置数组项的 url 属性进行展示控制。如果不给 fileList 传入 url 属性，则上传后的 fileList 列表点击时不会下载文件。

## Table

### 使用

```
  scroll={{x: 1200,y: 500, scrollToFirstRowOnChange: true}}：设置表格滚动；
  pagination：分页：
  expandable={{ defaultExpandedRowKeys: ['row1', 'row3'] }}：某行是否默认展开；
  dataSource：数据；
  columns：列头；
```

```js
{
  size: 'small',
  total: data.total,
  showQuickJumper: true,
  defaultCurrent: 1,
  current: state.pageNow,
  pageSize: 50,
  showTotal: total => '每页50条 共${total}条',
  onChange: page => onPageSizeChange(page),
}
```

-   自定义空表格、自定义加载动画

```tsx
  locale：{{emptyText: <Empty />}}：自定义空内容；
  loading={{spinning: loading, tip: "加载中...",}}：加载 loading；
  columns：表格列配置：
```

```js
{
  title: 'columnName',
  dataIndex: 'columnData',
  key: 'column',
  align: 'right',
  width: 120,
  render: text => handleVal(text),// 处理文本
  sorter: (a, b) => a.columnData - b.columnData,// 排序
}
```

### 采坑注意

-   在 90.x 版本 Chrome 上，固定列滚动时会有 bug，导致某列显示不完全。原因是固定列下方的那几个对应的列（占位列）宽度没有设置成功。
-   解决方法：根据固定列的实现原理，给占位列设置最小宽度可以解决。

```css
.ant-table-thead > tr > th {
	white-space: nowrap; // 防止IE等浏览器不支持'max-content'属性 导致内容换行
	border-right: 1px solid #e1e9fe !important;
}
.ant-table-thead > tr > th:not:first-child {
	min-width: 100px;
}
```

## Menu 组件

### 使用

```js
<Menu
  onSelect={handleMenuClick} // 选中事件
  onClick={..} // 点击事件
  onOpenChange={onOpenChange} // submenu展开事件
  style={{ width: 255 }} // 宽
  // defaultOpenKeys={['sub1']} // 默认展开的submenu
  openKeys={selectedSubMenu} // 当前选中的submenu
  // defaultSelectedKeys={['key1']} // 默认选中的menuItem
  mode="inline" // 展示形态
  >
    {renderSubMenu(menuList)} // 自定义方法去渲染
</Menu>
```

## Input 组件

### 使用

-   autoComplete: "off", 可以禁止掉原生 input 的默认提示行为;

## Select 组件

### 常规用法

-   自定义 option
-   支持本地过滤、排序

```js
<Select
	defaultValue={xxx}
	style={xxx}
	onChange={handleChange}
	value={xxx}
	getPopupContainer={(e) => e.parentElement}
	showSearch
	optionFilterProp="children"
	filterOption={(input, option) =>
		option?.props?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
	}
	filterSort={(optionA, optionB) =>
		optionA?.props?.children
			?.toLowerCase()
			.localeCompare(optionB?.props?.children?.toLowerCase())
	}
>
	<Option key="all" value={xxx}>
		全部
	</Option>
	{xxxx &&
		_.map(xxxx, (department) => (
			<Option key={xx.id} value={xx.val}>
				{xx.name}
			</Option>
		))}
	<Option key="unset" value={xxx}>
		啦啦啦
	</Option>
</Select>
```

### 自定义下拉菜单

-   通过 dropdownRender 实现

-   [示例](https://codesandbox.io/s/kuo-zhan-cai-dan-antd-4-18-2-forked-gnnfb?file=/index.js)

## Pagination 组件

### 用法

-   一般会配合 table 来用，也不排除跟在 list 后面的情况
-   样式修改比较费劲，如下实现完全的样式自定义配置：

```css
  .ant-pagination {
    font-size: 14px;
    text-align: center;
    position: relative;
    color: ${theme.font333};
    .ant-pagination-total-text {
      position: absolute;
      left: 0;
    }
    .ant-pagination-prev .ant-pagination-item-link, .ant-pagination-next .ant-pagination-item-link {
      border-radius: 6px;
    }
    .ant-pagination-prev, .ant-pagination-next, .ant-pagination-jump-prev, .ant-pagination-jump-next {
      display: inline-block;
      color: #666;
      text-align: center;
      vertical-align: middle;
      list-style: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s;
    }
    .ant-pagination-item {
      border-radius: 6px;
      display: inline-block;
      margin-right: 8px;
      text-align: center;
      vertical-align: middle;
      list-style: none;
      background-color: ${theme.colorWhite};
      border: 1px solid ${theme.colorD9};
      border-radius: 6px;
      outline: 0;
      cursor: pointer;
      user-select: none;
      &.ant-pagination-item-active {
        a {
          color: ${theme.colorWhite};
        }
        background-color: ${theme.color406};
      }
      &:hover:not(.ant-pagination-item-active) {
        border-color: ${theme.color406};
        a {
          color: ${theme.color406};
        }
      }
    }
    .ant-pagination-options-size-changer {
      .ant-select-selector {
        height: 32px;
        line-height: 32px;
        .ant-select-selection-item {
          line-height: 30px;
        }
      }
    }
    .ant-pagination-options-quick-jumper {
      input {
        &:hover,
        &:focus {
          border-color: ${theme.color406};
        }
      }
    }
    .ant-pagination-prev:not(.ant-pagination-disabled) .ant-pagination-item-link,
    .ant-pagination-next:not(.ant-pagination-disabled) .ant-pagination-item-link {
      &:hover {
        border-color: ${theme.color406};
        color: ${theme.color406};
      }
    }
    .ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-link-icon,
    .ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-link-icon {
      color: ${theme.color406};
    }
  }
```

## Cascader 级联选择

### Usage

-   changeOnSelect:true; // 点击任一级菜单选项值都会发生变化
-   options={options}; // {value,label,children}
-   onChange={handleCascaderChange}; // 可以拿到 当前点击的 完整层级的 value, selectedOptions
-   defaultValue={['all']}; // 默认值，设置对应的 value 即可
-   expandTrigger="hover"; // 菜单展开方式 hover/click

## 国际化 tips

-   修改 antd 国际化配置，自定义某些字段：

```js
import zh_CN from "antd/lib/locale-provider/zh_CN";
console.log("zh_CN", zh_CN);
const myZHCN = {
	...zh_CN,
	Modal: {
		cancelText: "取消555",
		justOkText: "知道了555",
		okText: "确定555",
	},
};
console.log("myZHCN", myZHCN);

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<ConfigProvider locale={myZHCN}>
				<App />
			</ConfigProvider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);
```
