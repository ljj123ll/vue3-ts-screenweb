<template>
	<!-- configprovider antD vue提供的全局配置组件,配置全局语言为中文 -->
	<ConfigProvider :locale="zhCN">
		<!-- 页面组件渲染的地方 -->
		<router-view />
	</ConfigProvider>
</template>

<script setup lang="ts">
// 导入antd中文语言包,导入轻量级日期处理库,引入dayjs中文语言包
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
// 全局设置dayjs语言为中文
dayjs.locale('zh-cn');
</script>

<style scoped lang="scss"></style>
