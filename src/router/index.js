import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: '/',
        component: () => import('../views/Index.vue'),
        meta: {
            title: '首页'
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