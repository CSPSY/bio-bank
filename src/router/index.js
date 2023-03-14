/**
 * @description 路由配置
 */
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  // 用户
  {
    path: '/',
    component: () => import('../pages/user/Index.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/login-user',
    component: () => import('../pages/user/Login.vue'),
    meta: {
      title: '用户登录'
    }
  },
  {
    path: '/my-storage',
    component: () => import('../pages/user/MyStorage.vue'),
    meta: {
      title: '我的存储'
    }
  },
  // 管理员
  {
    path: '/admin',
    component: () => import('../pages/admin/Index.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/login-admin',
    component: () => import('../pages/admin/Login.vue'),
    meta: {
      title: '管理员登录'
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