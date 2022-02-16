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
        name: "Home",
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
      middleware: [Middlewares.checkPermissions],
      requireLogin: true,
      permissions: ["view-dashboard"],
    },
    children: [
      {
        name: "dashboardH",
        path: "home",
        component: Dashboard,
        meta: {
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ["view-dashboard"],
        },
        
      },
      {
        name: "admin.view-users",
        path: "/admin/users",
        component: import("pages/Admin/Users/index.vue"),
        meta: {
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
        },
        
      },
      {
        name: "admin.view-roles",
        path: "/admin/roles",
        component: import("pages/Admin/Roles/index.vue"),
        meta: {
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ["view-roles"],
        },
      },

      {
        name: "admin.created-roles",
        path: "/admin/roles/create",
        component: import("pages/Admin/Roles/create.vue"),
        meta: {
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
         permissions: ["create-roles"],
        },
      },

      {
        name: "edit-profile",
        path: "/dashboard/user/profile",
        component: import("pages/dashboard/User/userProfile.vue"),
        meta: {
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ["edit-profile"],
        },
      },

    ],
  },

  {
    path: "/authorize/google/callback",
    component: () => import("pages/Auth/LoginGoogle.vue"),
  },

  {
    path: "/authorize/login",
    component: () => import("pages/Auth/LoginForm.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
