import Index from "pages/Index.vue";
import About from "pages/About.vue";
import Product from "pages/Product.vue";
import ArtistList from "pages/ArtistList.vue";
import Quotations from "pages/Quotations";
import Register from "pages/Auth/Register.vue";
import Login from "pages/Auth/Login.vue";
import Dashboard from "pages/dashboard/Dashboard.vue";

import Middlewares from "../middlewares/";

const routes = [
  {
    component: () => import("layouts/MainLayout.vue"),
    path: "/other",
    children: [
      {
        name: "Home",
        path: "/",
        component: Index,
      },
      {
        name: "About",
        path: "/about",
        component: About,
      },
      {
        name: "ArtistList",
        path: "/artist-list",
        component: ArtistList,
      },
      {
        name: "Quotations",
        path: "/quotations",
        component: Quotations,
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
    ],
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
        name: "edit-profile",
        path: "/dashboard/user/profile",
        component: import("pages/dashboard/User/userProfile.vue"),
        meta: {
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ["edit-profile"],
        },
      },
      // Rutas del admin
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
        name: "admin.view-musicals-genders",
        path: "/admin/musical-genders/index",
        component: import("pages/Admin/MusicalGenders/index.vue"),
        meta: {
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ["view-musicals-genders"],
        },
      },

      {
        name: "admin.create-newsletters",
        path: "/admin/newsletter/index",
        component: import("pages/Admin/EmailSubscribedUsers/index.vue"),
        meta: {
          requireLogin: true,
        },
      },
      // Fin de rutas del admin

      // Rutas del artista
      {
        name: "artist.view-profile-artist",
        path: "/artist/index",
        component: import("pages/Artist/NewArtist/index.vue"),
        meta: {
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ["view-profile-artist"],
        },
      },
      // Fin de rutas del artista

      // Rutas del cliente
      {
        name: "client.view-card",
        path: "/client/card",
        component: import("pages/Client/Card/index.vue"),
        meta: {
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ["view-card"],
        },
      },
      {
        name: "client.view-all-musicals-genders",
        path: "/client/musical-genders",
        component: import("src/pages/Client/MusicalGenders/index.vue"),
        meta: {
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ["view-all-musicals-genders"],
        },
      },
      {
        name: "client.view-groups-by-genders-search",
        path: "/client/musical-genders/:slug",
        component: import("src/pages/Client/MusicalGenders/search.vue"),
        meta: {
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ["view-groups-by-genders"],
        },
      },
      {
        name: "client.view-group-by-gender-slug",
        path: "/client/musical-genders/:slugMG/:slugA",
        component: import("src/pages/Client/MusicalGenders/show.vue"),
        meta: {
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ["view-groups-by-genders"],
        },
      },

      {
        name: "client.view-shopping-cart",
        path: "/client/shopping-cart",
        component: import("src/pages/Client/ShoppingCart/index.vue"),
        meta: {
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ["view-shopping-cart"],
        },
      },

      {
        name: "client.dataClient",
        path: "/client/shopping-cart/dataClient",
        component: import("src/pages/Client/ShoppingCart/dataClient.vue"),
        meta: {
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ["view-shopping-cart"],
        },
      },

      {
        name: "client.view-favourite-artist",
        path: "/client/favourite-artist",
        component: import("src/pages/Client/FavouriteArtists/index.vue"),
        meta: {
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ["view-favourite-artist"],
        },
      },
      // Fin de rutas del cliente
    ],
  },

  {
    path: "/authorize/google/callback",
    component: () => import("pages/Auth/LoginGoogle.vue"),
  },

  {
    path: "/authorize/facebook/callback",
    component: () => import("pages/Auth/LoginFacebook.vue"),
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
