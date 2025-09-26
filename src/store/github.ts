import { GitHubItem } from '@/pages/home/composables/use-github';
import { defineStore } from 'pinia';

export const useGithubStore = defineStore('github', {
	state: () => ({
		// 类型约束:list数组中的每个元素都是GitHubItem类型
		list: [] as GitHubItem[]
	})
});
