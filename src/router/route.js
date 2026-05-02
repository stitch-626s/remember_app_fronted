import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/PageLogin.vue"),
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("../views/PageRegister.vue"),
    },
    {
      path: "/",
      component: () => import("../views/PagePublicLayout.vue"),
      children: [
        {
          path: "store",
          name: "Store",
          component: () => import("../views/PageQuestionBankStore.vue"),
        },
        {
          path: "memorize",
          name: "Memorize",
          component: () => import("../views/PageMemorize.vue"),
        },
        {
          path: "myquestionbank",
          name: "MyQuestionBank",
          component: () => import("../views/PageMyQuestionBank.vue"),
        },
        {
          path: "profile",
          name: "Profile",
          component: () => import("../views/PagePersonal.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to, from) => {
  const user = localStorage.getItem("user_info");
  const protectedRoutes = [
    "/store",
    "/memorize",
    "/myquestionbank",
    "/profile",
  ];

  if (protectedRoutes.includes(to.path) && !user) {
    return "/login";
  }
  return true;
});

export default router;
