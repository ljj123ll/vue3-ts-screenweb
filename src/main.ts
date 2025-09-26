import { createApp } from 'vue';
import './style.css';
// 单独导入antdmessage组件的css样式
import 'ant-design-vue/es/message/style/css';
import App from './App.vue';
import router from './router/index';
import pinia from './store/index';

const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount('#app');
