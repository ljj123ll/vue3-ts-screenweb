import { defineStore } from 'pinia';

export const useInitData = defineStore('initData', {
	state: () => ({
		// 类型约束:list对象中的每个属性都是any类型
		list: {} as any
	})
});
