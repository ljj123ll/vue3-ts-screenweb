/// <reference types="vite/client" />

// Vue 3 组件类型声明
declare module '*.vue' {
	import { defineComponent } from 'vue';
	const Component: ReturnType<typeof defineComponent>;
	export default Component;
}

// Vue 3 JSX 类型声明
declare global {
	namespace JSX {
		type Element = VNode;
		// 移除空接口，使用泛型约束代替
		interface ElementAttributesProperty {
			$props: any;
		}
		interface IntrinsicElements {
			[key: string]: any;
		}
	}
}
