---
title: 重点记录一些 antd 组件库使用时遇到的问题以及解决方法
author: EricYangXD
date: "2021-12-29"
---

## Form 组件

### 使用

-   antd 禁止在 Form.Item 下的组件使用默认属性，解决：统一在 form 组件的 initialValues 属性里设置。
-   如果 Form.Item 中包裹了两个组件，那么建议用 div 或别的把这俩组件包起来，否则会 warning：Item 的 children 是 array 时不能设置 name。

#### Form

```js
  autocomplete: "off", 可以禁止掉所有input的默认提示行为;
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

```js
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

```js
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

```js
  getContainer={Boolean | HTMLElement}：默认挂载到 document.body；
  forceRender：强制刷新；
  destroyOnClose：关闭的时候销毁组件；
  maskClosable={false}：点击蒙层是否关闭；
  afterClose={() => form.resetFields()：配合<Form 在一定程度上解决 Modal 关闭后清空 Form 内容。
  Antd 4.x <Modal /> 和 Form 一起配合使用时，设置 destroyOnClose 为 true，并且还需要设置 <Form preserve={false} />，还需要手动设置 form.resetFields() 来重置 Form 表单的值。
  Antd 3.x 函数组件需要配合 forwardRef。
  使用 Modal.warn()等方法直接弹窗提示时，可以通过 className 属性添加自定义 css 样式，配合 styled-components 的 createGlobalStyle 创建全局样式文件，可以覆盖 html 的全局样式，然后在 index.tsx 中引入，作为 component 使用即可，和 AppRouter 放在一层。
```

## AutoComplete、Select 组件

### 使用

```js
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

```js
  scroll={{x: 1200,y: 500, scrollToFirstRowOnChange: true}}：设置表格滚动；
  pagination：分页：
  expandable={{ defaultExpandedRowKeys: ['row1', 'row3'] }}：某行是否默认展开；
  dataSource：数据；
  columns：列头；
```

```js
// pagination
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

```js
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

-   表头过滤

```js
// 自定义筛选组件 columns 设置
filterDropdown: () => <SearchInput setParams={setParams} />,
// 本地筛选，默认组件
onFilter:()=>{},
filters:[{text:'',value:''}],
```

-   服务端排序

1. columns 里设置 sorter:true;
2. Table 里通过 onChange(pagination, filters, sorter, extra)监听筛选变化;

-   排序 icon 恢复

1. sortOrder: 排序的受控属性，外界可用此控制列的排序，可设置为 ascend | descend | false;

-   支持的排序方式

1. sortDirections: 覆盖 Table 中 sortDirections， 取值为 ascend | descend，通过设置为[ascend, descend, ascend]，实现只有升降而没有 undefined/default。

### 踩坑注意

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

-   如果使用了`<Sider>`组件包裹了`<Menu>`（使用某些布局的时候可能会用到），那么要在`<Sider>`中设置`collapsed={false}`才能使菜单默认展开。在`<Menu>`中设置`inlineCollapsed={false}`无效！
-   使用`selectedKeys={[path]} onClick={onMenuClick}`结合`history.push(path)`，可以实现菜单的选中与路由的变化相匹配。

## Input 组件

### 使用

-   autocomplete="off"，这是 H5 原生 input 的一个属性。注意全部小写。
-   autoComplete: "off", 可以禁止掉原生 input 的默认提示行为;
-   `<Input.Search value={val} onPressEnter={onPressEnter} onSearch={onSearch} allowClear />`: 在使用 Input 的 Search 功能时，如果组件是受控组件，那么执行 onPressEnter 之后，输入框里的内容时无法通过 backspace 删除的，只能通过 allowClear 功能清除，此时需要注意：onSearch 函数，他是点击搜索图标、清除图标或按下回车键时的回调！如果在 onSearch 中做了诸如`if(!value.trim()) return;`此类的判断，那么 allowClear 将会失效！

## Select 组件

### 常规用法

-   自定义 option
-   支持本地过滤、排序
-   可以做模糊查询，搜索输入的内容

```tsx
<Select
	getPopupContainer={() => document.getElementById("root") as HTMLElement}
	getPopupContainer={(el) => el.parentElement as HTMLElement}
	defaultValue={xxx}
	style={xxx}
	onChange={handleChange}
	value={selectedVal}
	defaultActiveFirstOption
	getPopupContainer={(e) => e.parentElement}
	showSearch
	className="xxx"
	allowClear
	labelInValue // TODO 每个option里key和value为何总是一样的？？？不建议使用
	notFoundContent={notFoundContent}
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

-   多级选择菜单

```tsx
const renderOption = (item: IndustryOption) => (
	<Option
		id={item.index}
		name={item.label}
		level={item.level}
		key={item.index}
		value={item.value}
	>
		{item.label}
	</Option>
);

const renderGroupTitle = (level: number | string) => {
	const industryTitles = ["一级", "二级", "三级"];
	const title = industryTitles[Number(level) - 1];
	return <strong>{title}</strong>;
};

const renderOptions = (dataSource: IndustryOption[]) => {
	const groups = _.groupBy(dataSource, (v) => v.level);
	return _.map(groups, (group, level) => (
		<OptGroup key={level} label={renderGroupTitle(level)}>
			{group.map(renderOption)}
		</OptGroup>
	));
};

<Select
	labelInValue
	getPopupContainer={() => document.getElementById("root") as HTMLElement}
	showSearch
	className="select"
	placeholder={placeholder}
	onSearch={debounceFetcher}
	notFoundContent={notFoundContent}
	onSelect={onSelect}
	value={[]}
	filterOption={false}
>
	{renderOptions(options)}
</Select>;
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
