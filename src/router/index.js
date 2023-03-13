/**
 * @description 路由配置
 */
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: '/',
    component: () => import('../pages/user/Index.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/admin',
    component: () => import('../pages/admin/Index.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/admin/manage-container',
    component: () => import('../pages/admin/ManageContainer.vue'),
    meta: {
      title: '容器管理'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  // 路由发送变化时，更改页面 title
  if (to.meta.title) {
    document.title = '生物样本库 | ' + to.meta.title
  }
  next()
});

export { router };