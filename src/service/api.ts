// 导入提示组件,导入axios类型,导入配置好的axios实例
import { message } from 'ant-design-vue';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import http from './service';

// 拓展axios响应类型(适配项目后端返回格式)
export interface AxiosRequest<T> extends AxiosResponse {
	// http状态码,业务数据,错误信息,允许其他自定义字段
	status: number;
	data: T;
	message?: string;
	error?: string;
	[key: string]: any;
}

const env = import.meta.env.DEV;

// 拓展请求配置类型
// 是否关闭错误提示,自定义成功状态码,自定义请求头
export interface RequestConfig extends AxiosRequestConfig {
	closeErrorMessage?: boolean;
	successStatusCheckValue?: number | 'none';
	header?: Record<string, any>;
}

// GET请求封装
export function GET<T, K = any>(url: string, params?: T, config?: AxiosRequestConfig): Promise<IAxiosResponse<K>> {
	// 调用http.get，合并参数与配置
	return http.get<K>(url, { ...config, params }).catch(error => {
		// 开发环境：打印错误详情（方便调试）
		if (env) {
			console.error('GET接口请求异常。下面是请求参数和异常信息：');
			console.error(url); // 打印请求URL
			console.error(error); // 打印错误对象
		}

		// 400状态（如请求频率过高）：显示后端返回的错误信息
		if (error.response?.status === 400) {
			message.error(`${error.response?.data?.message || '请求失败，请重试'}`);
		} else {
			// 其他错误：显示错误信息（兼容不同错误格式）
			message.error(`${(error && (error.error || error.message || error.msg)) || '请求失败，请重试'}`);
		}
		return Promise.reject(error); // 继续抛出错误（供上层处理）
	});
}

// POST请求封装
export function POST<T, K = any>(url: string, data?: T, config?: AxiosRequestConfig): Promise<IAxiosResponse<K>> {
	// 调用http.post，传入数据与配置
	return http.post<K>(url, data, config).catch(error => {
		// 开发环境：打印错误详情
		if (env) {
			console.error('POST接口请求异常。下面是请求参数和异常信息：');
			console.error(url); // 打印请求URL
			console.error(error); // 打印错误对象
		}

		// 400状态：显示后端错误信息
		if (error.response?.status === 400) {
			message.error(`${error.response?.data?.message || '请求失败，请重试'}`);
		} else {
			// 其他错误：显示兼容格式的错误信息
			message.error(`${(error && (error.error || error.message || error.msg)) || '请求失败，请重试'}`);
		}
		return Promise.reject(error); // 继续抛出错误
	});
}
