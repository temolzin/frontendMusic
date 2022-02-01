import Index from "pages/Index.vue";
import About from "pages/About.vue";
import Product from "pages/Product.vue";
import Register from "pages/Auth/Register.vue";
import Login from "pages/Auth/Login.vue";
import Dashboard from "pages/dashboard/Dashboard.vue";

import Middlewares from "../middlewares/";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        component: Index,
      },
      { path: "/about", component: About },
      {
        name: "product",
        path: "/product",
        component: Product,
      },
    ],
  },

  {
    name: "LoginIn",
    path: "/login",
    component: () => Login,
    meta: {
      middleware: [Middlewares.guest],
      requireLogin: false,
    },
  },
  {
    name: "register",
    path: "/register",
    component: () => Register,
    meta: {
      middleware: [Middlewares.guest],
      requireLogin: false,
    },
  },

  {
    name: "dashboard",
    path: "/dashboard",
    component: () => import("layouts/Dashboard.vue"),
    meta: {
      middleware: [Middlewares.auth],
      requireLogin: true,
    },
    children: [
      {
        name: "dashboardH",
        path: "home",
        component: Dashboard,
        meta: {
          middleware: [Middlewares.auth],
          requireLogin: true,
        },
      },
    ],
  },

  {
    path: "/authorize/google/callback",
    component: () => import("pages/Auth/LoginGoogle.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
