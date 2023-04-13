/**
 * @description 路由配置
 */
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: '/',
    redirect: '/user',
  },
  // 用户
  {
    path: '/user',
    component: () => import('../pages/user/Index.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/user/login',
    component: () => import('../pages/user/Login.vue'),
    meta: {
      title: '用户登录'
    }
  },
  {
    path: '/user/register',
    component: () => import('../pages/user/Register.vue'),
    meta: {
      title: '用户注册'
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
    path: '/admin/login',
    component: () => import('../pages/admin/Login.vue'),
    meta: {
      title: '管理员登录'
    }
  },
  {
    path: '/admin/register',
    component: () => import('../pages/admin/Register.vue'),
    meta: {
      title: '管理员注册'
    }
  },
  {
    path: '/admin/manage-container',
    component: () => import('../pages/admin/ManageContainer.vue'),
    meta: {
      title: '容器管理'
    }
  },
  {
    path: '/admin/manage-system',
    component: () => import('../pages/admin/ManageSystem.vue'),
    meta: {
      title: '系统管理'
    }
  },
  {
    path: '/admin/manage-sample',
    component: () => import('../pages/admin/ManageSample.vue'),
    meta: {
      title: '样本管理'
    }
  },
  {
    path: '/admin/manage-auth',
    component: () => import('../pages/admin/ManageAuth.vue'),
    meta: {
      title: '权限管理'
    }
  },
  {
    path: '/admin/manage-backup',
    component: () => import('../pages/admin/ManageBackup.vue'),
    meta: {
      title: '备份管理'
    }
  },
  {
    path: '/admin/monitor-system',
    component: () => import('../pages/admin/MonitorSystem.vue'),
    meta: {
      title: '系统监控'
    }
  },
  // 找回密码
  {
    path: '/forget-password',
    component: () => import('../pages/PasswordForget.vue'),
    meta: {
      title: '找回密码'
    }
  },
  {
    path: '/bio_bank/reset-password',
    component: () => import('../pages/PasswordReset.vue'),
    meta: {
      title: '重置密码'
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