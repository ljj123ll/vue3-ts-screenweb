// 路由实例创建与配置
// 路由的入口,负责创建路由实例,配置路由模式,并且设置路由拦截器
// 使用哈希模式,URL里面包含#号,不美观,但是兼容性好

import { createRouter, createWebHashHistory, RouteLocationNormalized } from 'vue-router';
import routes from './routes';
// 创建一个路由实例
const router = createRouter({
	history: createWebHashHistory(),
	routes
});

// 路由拦截器:跳转前设置页面标题
const setTitle = (to: RouteLocationNormalized) => {
	// 设置页面标题
	// document.title浏览器原生的api用于设置当前页面的标题
	document.title = (to.meta && (to.meta.title as string)) || 'Github开源数据可视化';
};

// 路由拦截
router.beforeEach(to => {
	// 每次路由跳转之前执行
	setTitle(to);
});

export default router;
