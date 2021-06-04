import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
const VueRouterPush = Router.prototype.push;
Router.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err);
};

let router = new Router({
  // mode: 'history',
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("pages/login_remo")
    },

    {
      path: "/index",
      name: "index",
      component: () => import("pages/index_remo"),
      redirect: { name: "indexRemo" },
      children: [
        {
          path: "indexRemo",
          name: "indexRemo",
          component: () => import("pages/index_remo")
        },
      ]
    },
    {
      path: "/*",
      redirect: "/login"
    }
  ]
});
// 刷新跳转到空白页
router.beforeEach((to, from, next) => {
  //刷新页面的时候跳到空白页
  if (from.name === null && to.name !== "login" && to.name !== "indexRemo") {
    next({ name: "indexRemo" });
    //(token失效)
  }
  else if (from.name === "login" && sessionStorage.getItem("token") === null) {
    next({ name: "login" });
  }
  else if (to.name === "login" && to.query.token != undefined) {
    let params = to.query;
    let user = {
      user_trees: null,
      password: null,
      name: null,
      id: null,
      menu: null,
      type: 2,
      status: null,
      username: null
    };
    sessionStorage.setItem("token", params.token);
    sessionStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("tree", JSON.stringify([Number(params.t_ids)]));
    next({ name: "index" });
  } else {
    next();
  }
});

export default router;
