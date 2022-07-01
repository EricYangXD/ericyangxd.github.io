---
title: ElementUI 踩坑笔记
author: EricYangXD
date: "2021-12-28"
---

- 记录 ElementUI 使用时遇到的问题

* Vue2.6 要用 TypeScript 需要使用 `vue-class-component`/`vue-property-decorator`，使用 Vuex 的话要用 `vuex-module-decorators`

## 使用

- 参考[官网](https://element.eleme.cn/#/zh-CN)

## 问题

- 基本是对组件的使用中遇到的坑

### Form 表单

- `:label-position="labelPosition"` label 标签对齐方式
- `:model="formLabelProps"` form 全部 form-item 的数据可以通过一个 data 绑定到 form 上，form-item 绑定对应的 prop，其中的输入框上绑定对应的 `v-model='formLabelProps.xx'`即可
- `:rules` 校验规则：同 antd，都用了[这个](https://github.com/yiminghe/async-validator)，区别在于 antd 中的 callback 要求返回一个 Promise，重点在于检验后对于不符合规则的条目进行自定义提示，例：复制自官网：

```html
<el-form
	:model="ruleForm"
	status-icon
	:rules="rules"
	ref="ruleForm"
	label-width="100px"
	class="demo-ruleForm"
>
	<el-form-item label="密码" prop="pass">
		<el-input
			type="password"
			v-model="ruleForm.pass"
			autocomplete="off"
		></el-input>
	</el-form-item>
	<el-form-item label="确认密码" prop="checkPass">
		<el-input
			type="password"
			v-model="ruleForm.checkPass"
			autocomplete="off"
		></el-input>
	</el-form-item>
	<el-form-item label="年龄" prop="age">
		<el-input v-model.number="ruleForm.age"></el-input>
	</el-form-item>
	<el-form-item>
		<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
		<el-button @click="resetForm('ruleForm')">重置</el-button>
	</el-form-item>
</el-form>
<script>
	export default {
		data() {
			var checkAge = (rule, value, callback) => {
				if (!value) {
					return callback(new Error("年龄不能为空"));
				}
				setTimeout(() => {
					if (!Number.isInteger(value)) {
						callback(new Error("请输入数字值"));
					} else {
						if (value < 18) {
							callback(new Error("必须年满18岁"));
						} else {
							callback();
						}
					}
				}, 1000);
			};
			var validatePass = (rule, value, callback) => {
				if (value === "") {
					callback(new Error("请输入密码"));
				} else {
					if (this.ruleForm.checkPass !== "") {
						this.$refs.ruleForm.validateField("checkPass");
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if (value === "") {
					callback(new Error("请再次输入密码"));
				} else if (value !== this.ruleForm.pass) {
					callback(new Error("两次输入密码不一致!"));
				} else {
					callback();
				}
			};
			return {
				ruleForm: {
					pass: "",
					checkPass: "",
					age: "",
				},
				rules: {
					pass: [{ validator: validatePass, trigger: "blur" }],
					checkPass: [{ validator: validatePass2, trigger: "blur" }],
					age: [{ validator: checkAge, trigger: "blur" }],
				},
			};
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						alert("submit!");
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
		},
	};
</script>
```

- `:label-suffix` 表单域标签的后缀
- `:hide-required-asterisk` 是否显示必填字段的标签旁边的红色星号
- `:show-message` 是否显示校验错误信息
- `resetFields` 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果

- 校验失败，自动滚动到失败的那一项：

```js
  // submit表单时，进行校验
  submitForm() {
    // 通过ref拿到el-form的DOM
    this.formRef.validate(async (valid: boolean, object: ValidObject) => {
      if (valid) {// do sth ...}
      else { scrollView(object); }
    }
  }
  // 滚动方法
  scrollView(object: ValidObject) {
    for (let i = 0; i < Object.keys(object).length; i++) {
      const key = Object.keys(object)[i];
      const dom: App = this.$refs[key] as App; // Vue+TS 用法很怪...有些地方感觉用decorator并不方便
      // 滚动到指定节点
      dom.$el.scrollIntoView({
        // 值有start,center,end,nearest,当前显示在视图区域中间
        block: 'start',
        // 值有auto,instant,smooth,缓动动画（当前是慢速的）
        behavior: 'smooth',
      });
      // 只需要检测一项跳出循环
      break;
    }
  }
```

### Upload

```html
<el-upload
	ref="upload"
	:file-list="fileList"
	:on-success="uploadFileSuccess"
	:before-upload="beforeUploadFile"
	:on-remove="handleRemove"
	:auto-upload="true"
	:on-exceed="handleExceed"
	:on-preview="handlePreview"
	:limit="10"
	multiple
	action
	:http-request="handleUploadFile"
>
	<el-button
		size="small"
		slot="trigger"
		:disabled="uploadable"
		v-if="!uploadable"
		type="primary"
		icon="el-icon-upload"
		>上传附件</el-button
	>
	<el-button
		size="small"
		slot="tip"
		disabled
		v-if="uploadable"
		type="primary"
		icon="el-icon-upload"
		>上传附件</el-button
	>
	<div slot="tip" class="el-upload__tip">附件单个大小不可超过20MB</div>
</el-upload>
```

- action 必选参数，上传的地址
- multiple 是否支持多选文件
- drag 是否启用拖拽上传
- show-file-list 是否显示已上传文件列表
- on-preview 点击文件列表中已上传的文件时的钩子，可以在此处进行文件上传后的预览或下载等动作
- on-remove 文件列表移除文件时的钩子
- on-success 文件上传成功时的钩子
- before-upload 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
- before-remove 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。
- file-list 上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
- auto-upload 是否在选取文件后立即进行上传
- list-type 文件列表的类型 text/picture/picture-card
- http-request 覆盖默认的上传行为，可以自定义上传的实现
- on-exceed 文件超出个数限制时的钩子
- limit 最大允许上传个数

- tips: 上传按钮只能用 disable 修改样式，但是依然可以点击，所以设置两个按钮，配合 slot="tip"实现禁用上传功能
- 在 before-upload 中校验文件格式、大小等，on-success 之中可以得到上传后的所有文件列表，on-remove 之中得到移除某个文件之后的剩下的全部文件

## Dialog 对话框

- 坑：`destroy-on-close` 关闭时销毁 Dialog 中的元素，不可用！！！也就是说 dialog 关闭之后不会销毁，而会保留上一次的内容。
- `modal-append-to-body` 遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Dialog 的父元素上
- modal 是否需要遮罩层
- width Dialog 的宽度，默认 50%，`width="800px"`，注意要加上单位！！！
- `visible` 是否显示 Dialog，支持 `.sync` 修饰符
- `lock-scroll` 是否在 Dialog 出现时将 body 滚动锁定
- `before-close` 关闭前的回调，会暂停 Dialog 的关闭 function(done)，done 用于关闭 Dialog 可能可以用于解决上面的不销毁组件的坑……

## Pagination 分页

- 自定义分页样式

```html
<template>
	<div class="my-pagination">
		<el-pagination
			:current-page.sync="currentPageSync"
			:layout="layout"
			:total="total"
			:page-size="pageSize"
			@current-change="handleCurrentChange"
		>
			<el-dropdown placement="bottom" @command="handleSizeChange">
				<div>
					<span class="pagination-text left">每页</span>
					<el-button class="dropdowm-page__button">
						<span
							>{{ pageSize }}<i class="el-icon-arrow-down el-icon--right"></i
						></span>
					</el-button>
					<span class="pagination-text right">条</span>
				</div>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item v-for="p in pageSizes" :key="p" :command="p"
						>{{ p }}</el-dropdown-item
					>
				</el-dropdown-menu>
			</el-dropdown>
		</el-pagination>
	</div>
</template>

<script lang="ts">
	/**
	 * 自定义分页组件
	 * 默认参数
	 * layout: slot, prev, pager, next
	 * total:  0
	 * pageSize: 10
	 * currentPage: 1
	 * */

	import { Component, Prop, PropSync, Emit, Vue } from "vue-property-decorator";

	@Component
	export default class App extends Vue {
		@Prop({ default: 0 }) total!: number;

		@Prop({ default: 10 }) pageSize!: number;

		@Prop({
			default: (layout: string) => `slot, ${layout || "prev, pager, next"}`,
		})
		layout!: string;

		@Prop({ default: () => [10, 20, 50, 100, 200] }) pageSizes!: Array<number>;
		// PropSync，接收prop：currentPage，生成一个新的计算属性：currentPageSync，之后再同步给自身
		@PropSync("currentPage", { default: 1, type: Number })
		currentPageSync!: number;

		// 下面两个空函数只是用于emit到父组件，触发对应的事件，不需要传递值
		@Emit("size-change")
		handleSizeChange(pageSize: number) {}

		@Emit("current-change")
		handleCurrentChange(currentPage: number) {}
	}
</script>
<style lang="less" scoped>
	.my-pagination ::v-deep .el-pagination {
		.pagination-text {
			width: 30px;
			height: 30px;
			font-size: 14px;
			color: #00ee14;
			letter-spacing: 0;
			line-height: 30px;
			font-weight: 400;
			&.right {
				text-align: left;
				padding-left: 8px;
			}
			&.left {
				text-align: right;
				padding-right: 8px;
			}
		}

		.dropdowm-page__button {
			width: 60px;
			height: 28px;
			position: relative;
			text-align: left;
			line-height: 24px;
			padding: 0 10px 0 12px;
			background: #fff;
			border: 1px solid grey;
			color: balck;
		}

		.el-icon-arrow-down.el-icon--right {
			position: absolute;
			right: 6px;
			top: 6px;
		}
	}
</style>
// 使用
<am-pagination
	@size-change="handleSizeChange"
	@current-change="handleCurrentChange"
	:current-page="current"
	:page-sizes="[10, 20, 50]"
	:page-size="pageSize"
	layout="slot, prev, pager, next"
	:total="total"
></am-pagination>
```

- @PropSync 装饰器与@prop 用法类似，二者的区别在于：
- @PropSync  装饰器接收两个参数：
- propName: string  表示父组件传递过来的属性名;
- options: Constructor | Constructor[] | PropOptions  与@Prop 的第一个参数一致;
- @PropSync 会生成一个新的计算属性
