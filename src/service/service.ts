// 导入axios和类型定义,qs库(序列化表单数据),导入路由实例(用于路由跳转),导入message组件提示信息
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import qs from 'qs';
import router from '@/router/index';
import { message } from 'ant-design-vue';

// 环境与常量定义,判断是否是开发环境 , 默认表单提交的Content-Type
const env = import.meta.env.DEV;
const defaultContentType = 'application/x-www-form-urlencoded; charset=UTF-8';

// 创建axios实例,配置基础URL,超时时间,跨域请求是否携带cookie,响应状态码校验函数
// 基础URL: 所有请求的URL都将以'/'开头,需要根据实际情况修改
// 超时时间: 50秒,超过时间会报错
// 跨域请求是否携带cookie: 开启,允许在跨域请求中携带cookie
// 响应状态码校验函数: 只校验200-500范围内的状态码,其他状态码都报错
const service = axios.create({
	baseURL: '/',
	timeout: 50000,
	withCredentials: true,
	validateStatus: status => status >= 200 && status <= 500
});

// 获取token函数,从localStorage获取token,如果不存在则返回空字符串
const getToken = () => {
	return window.localStorage.getItem('token') || '';
};

// url格式化函数,根据环境判断是否添加/api前缀
const formatUrl = (config: InternalAxiosRequestConfig<any>): string | undefined => {
	// 如果url不存在直接返回
	if (!config.url) return;
	// 开发环境：给URL添加`/api`前缀（配合vite代理解决跨域）
	if (env) {
		const envPath = '/api';
		return `${envPath}${config.url}`;
	} else {
		return `${config.url}`;
	}
};

// 请求拦截器
service.interceptors.request.use(
	// 请求成功拦截
	config => {
		// 应用URL格式化,开发环境加前缀
		config.url = formatUrl(config);

		// 若请求类型为默认表单类型,用qs序列化数据(适配后端表单接收格式)
		if (config.headers['content-type'] === defaultContentType) {
			config.data = qs.stringify(config.data);
		}

		// 若存在token,则添加到请求头(Bearer认证格式)
		if (getToken()) {
			config.headers.Authorization = 'Bearer ' + getToken();
		}
		// 返回处理后的配置
		return config;
	},
	// 请求拦截失败
	(error: AxiosError) => Promise.reject(error)
);

// 响应拦截器
service.interceptors.response.use(
	response => {
		const { data } = response;
		// 提取错误信息（兼容不同后端格式）
		const dataMessage = data.msg || data.error_description || '未知错误';
		// 获取响应头的Content-Type
		const headersType = response.headers['Content-Type'];
		// 文件流类型
		const contentType: unknown[] = ['application/vnd.ms-excel;charset=utf-8', 'application/octet-stream'];

		// 若为文件流(Excel下载),直接返回原始响应(不处理业务逻辑)
		if (headersType && contentType.includes(headersType)) {
			return response;
		}

		// 401状态(未授权/登录失效):跳转到登录页并拒绝Promise
		if (data.code === 401) {
			router.replace({ path: '/login' });
			return Promise.reject(data);
		}

		// 存在error_code（后端自定义错误标识）：提示错误并拒绝
		if (data.hasOwnProperty('error_code')) {
			message.error(dataMessage);
			return Promise.reject(data);
		}

		// 业务状态码非200:直接拒绝
		if (data.code !== 200) {
			return Promise.reject(data);
		}
		// 成功,返回业务数据
		return data;
	},
	// 响应失败拦截:直接抛出错误,不处理业务逻辑
	(error: AxiosError) => {
		return Promise.reject(error);
	}
);

// 导出配置好的axios实例
export default service;
