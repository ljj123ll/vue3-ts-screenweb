import { message } from 'ant-design-vue'; // 导入提示组件
import { AxiosRequestConfig, AxiosResponse } from 'axios'; // 导入axios类型
import http from './service'; // 导入上面配置好的axios实例

// 扩展Axios响应类型（适配项目后端返回格式）
export interface IAxiosResponse<T> extends AxiosResponse {
	status: number; // HTTP状态码
	data: T; // 业务数据
	message?: string; // 业务消息
	error?: string; // 错误信息
	[key: string]: any; // 允许其他自定义字段
}

const env = import.meta.env.DEV; // 判断是否为开发环境

export interface RequestConfig extends AxiosRequestConfig {
	closeErrorMessage?: boolean; // 是否关闭错误提示（默认开启）
	successStatusCheckValue?: number | 'none'; // 自定义成功状态码（默认200）
	header?: Record<string, any>; // 自定义请求头
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
