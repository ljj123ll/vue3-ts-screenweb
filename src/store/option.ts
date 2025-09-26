import { defineStore } from 'pinia';

export const useOptionStore = defineStore('option', {
	state: () => ({
		// 类型约束:option数组中的每个元素都是string类型
		option: [] as string[]
	})
});
