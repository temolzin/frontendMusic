import Index from "pages/Index.vue";
import About from "pages/About.vue";
import Product from "pages/Product.vue";
import Register from "pages/Register.vue";
import Login from "pages/Login.vue";
//import Login from "pages/Auth/Login.vue";
import Dashboard from "pages/dashboard/Dashboard.vue";

const routes = [

  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/", component: Index },
      { path: "/register", component: Register },
      { path: "/about", component: About },
      { path: "/product", component: Product },
    ],
  },

  {
    name: "LoginIn",
    path: "/login",
    component: () => Login,
  },

  {
    path: "/dashboard",
    component: () => import("layouts/Dashboard.vue"),
    meta: { requireLogin: true },
    children: [{ path: "home", component: Dashboard }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
