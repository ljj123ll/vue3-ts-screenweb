// 动态导入登录组件(懒加载,减少初始加载体积)
// 只有访问/login的时候才会加载该组件,优化首屏加载速度
const Login = () => import('@/pages/login/index.vue');

// 路由路径,路由名称,路由对应的组件,页面标题(供路由拦截器使用)
const routes = [
	{
		path: '/login',
		name: 'Login',
		component: Login,
		meta: {
			title: '开源数据发展趋势-登录页'
		}
	}
];

export default routes;
