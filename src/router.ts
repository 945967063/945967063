import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/HomeView.vue"),
      meta: { title: "𝓣𝓸𝔀𝓮𝓻𝓢𝓲𝓹" },
    },
    {
      path: "/love",
      name: "love",
      component: () => import("./views/LoveView.vue"),
      meta: { title: "致我最亲爱的老婆 ❤️" },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

router.afterEach((to) => {
  document.title = (to.meta.title as string | undefined) ?? "𝓣𝓸𝔀𝓮𝓻𝓢𝓲𝓹";
});

export default router;
