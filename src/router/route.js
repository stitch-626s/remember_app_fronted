import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/dashboard/store'},
        { path: '/login', component: () => import('../views/PageLogin.vue') },
        { path: '/register', component: () => import('../views/PageRegister.vue')},

        {
            path: '/', component: () => import('../views/PagePublicLayout.vue'),
            children: [
                {path: 'store', component: () => import('../views/PageQuestionBankStore.vue')},
                {path: 'memorize', component: () => import('../views/PageMemorize.vue')},
                {path: 'myQuestionBank', component: () => import('../views/PageMyQuestionBank.vue')},
                {path: 'profile', component: () => import('../views/PagePersonal.vue')},
            ]
        }
    ]
})

router.beforeEach((to, from) => {
    const user = localStorage.getItem("user_info");
    const protectedRoutes = ['/store', '/memorize', '/myQuestionBank', '/profile'];

    if (protectedRoutes.includes(to.path) && !user) {
        return '/login';
    }

    return true;
});

export default router;