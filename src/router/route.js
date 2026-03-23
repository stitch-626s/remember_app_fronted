import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/dashboard/store'},
        { path: '/login', component: () => import('../views/PageLogin.vue') },
        { path: '/register', component: () => import('../views/PageRegister.vue')},
        { path: '/dashboard', component: () => import('../views/PageHome.vue'), children: [
            {
                path: 'store', component: () => import('../views/PageQuestionBankStore.vue'),

            }
        ]}
    ]
})

export default router