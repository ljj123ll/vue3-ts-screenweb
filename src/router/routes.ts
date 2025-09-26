import loginRouter from './login';
import HomeRouter from './home';

const routes = [
	// 路径默认重定向到登录页面
	{
		path: '/',
		redirect: '/login'
	},
	// 合并登录页路由和首页路由(使用...拓展运算符整合登录和首页路由,便于后续拓展更多页面路由)
	...loginRouter,
	...HomeRouter
];

export default routes;
