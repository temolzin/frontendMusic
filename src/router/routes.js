import Index from "pages/Index.vue";
import About from "pages/About.vue";
import Product from "pages/Product.vue";
import ArtistList from "pages/ArtistList.vue";
import Quotations from "pages/Quotations";
import Register from "pages/Auth/Register.vue";
import Login from "pages/Auth/Login.vue";
import Recover from "pages/Auth/Recover.vue";
import ResetPassword from "pages/Auth/ResetPassword.vue";
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
        meta: { title: "Inicio" }
      },
      {
        name: "About",
        path: "/about",
        component: About,
        meta: { title: "Acerca de" }
      },
      {
        name: "ArtistList",
        path: "/artist-list",
        component: ArtistList,
        meta: { title: "Lista de Artistas" }
      },
      {
        name: "Quotations",
        path: "/quotations",
        component: Quotations,
        meta: { title: "Cotizaciones" }
      },
      {
        name: "LoginIn",
        path: "/login",
        component: Login,
        meta: {
          title: "Iniciar Sesión",
          middleware: [Middlewares.guest],
          requireLogin: false,
        },
      },
      {
        name: "recover",
        path: "/recover",
        component: Recover,
        meta: {
          title: "Recuperar Contraseña",
          middleware: [Middlewares.guest],
          requireLogin: false,
        },
      },
      {
        name: "reset-password",
        path: "/reset-password",
        component: ResetPassword,
        meta: {
          title: "Nueva Contraseña",
          middleware: [Middlewares.guest],
          requireLogin: false,
        },
      },
      {
        name: "register",
        path: "/register",
        component: Register,
        meta: {
          title: "Registro",
          middleware: [Middlewares.guest],
          requireLogin: false,
        },
      },
      {
        name: "legal.terms",
        path: "/terms-conditions",
        component: () => import("src/pages/TermsPage.vue"),
        meta: {
          title: "Términos y Condiciones de Uso",
          requireLogin: false,
        },
      },
      {
        name: "legal.privacy",
        path: "/policy-privacity",
        component: () => import("src/pages/PrivacyPage.vue"),
        meta: {
          title: "Política de Privacidad",
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
      title: "Panel Principal",
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
          title: "Inicio Panel",
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
          title: "Mi Perfil",
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
          title: "Gestión de Usuarios",
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ["view-users"]
        },
      },
      {
        name: "admin.view-roles",
        path: "/admin/roles",
        component: import("pages/Admin/Roles/index.vue"),
        meta: {
          title: "Gestión de Roles",
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
          title: "Crear Rol",
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
          title: "Géneros Musicales",
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
          title: "Envío de Correos",
          requireLogin: true,
          permissions: ["view-users"],
        },
      },

      {
        name: 'admin.support-tickets',
        path: '/admin/support-tickets',
        component: import('src/pages/Admin/SupportTickets/index.vue'),
        meta: {
          title: 'Tickets de Soporte',
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ['view-users'],
        },
      },
      {
        name: 'admin.support-tickets-show',
        path: '/admin/support-tickets/:id',
        component: import('src/pages/Admin/SupportTickets/show.vue'),
        meta: {
          title: 'Detalle Ticket',
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ['view-users'],
        },
      },
      {
        name: 'admin.payouts-management',
        path: '/admin/payouts',
        component: import('pages/Admin/Payouts/index.vue'),
        meta: {
          title: 'Liquidaciones por Pagar',
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ['view-users'], 
        },
      },
      {
        name: 'admin.client-refunds',
        path: '/admin/client-refunds',
        component: () => import('pages/Admin/Refunds/index.vue'),
        meta: {
          title: 'Reembolsos a Clientes',
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ['view-users'],
        },
      },
      {
        name: 'admin.user-sanctions',
        path: '/admin/user-sanctions',
        component: () => import('src/pages/Admin/UserSanctions/Index.vue'),
        meta: {
          title: 'Sanciones de Usuarios',
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ['view-users'],
        },
      },
      {
        name: 'admin.artist-approvals',
        path: '/admin/artist-approvals',
        component: import('pages/Admin/ArtistApprovals/index.vue'),
        meta: {
          title: 'Solicitudes de Artistas',
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ['view-users'],
        },
      },
      {
        name: 'admin.webhook-verification',
        path: '/admin/webhook-verification',
        component: import('pages/Admin/WebhookVerification/index.vue'),
        meta: {
          title: 'Verificación Webhook',
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ['view-users'],
        },
      },
      // Fin de rutas del admin

      // Rutas del artista
      {
        name: "artist.view-profile-artist",
        path: "/artist/index",
        component: import("pages/Artist/NewArtist/index.vue"),
        meta: {
          title: "Perfil Artista",
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ["view-profile-artist"],
        },
      },
      {
        name: "artist.view-sales",
        path: "/artist/artistSales",
        component: () => import("pages/Artist/Sales.vue"),
        meta: {
          title: "Ventas",
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ["view-profile-artist"],
        },
      },
      {
        name: 'artist.pending-approvals',
        path: '/artist/pending-approvals',
        component: import('src/pages/Artist/PendingApprovals.vue'),
        meta: {
          title: 'Solicitudes Pendientes',
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ['view-profile-artist'],
        },
      },
      {
        name: "artist.my-calendar",
        path: "/artist/my-calendar",
        component: () => import("pages/Artist/MyCalendar/index.vue"),
        meta: {
          title: "Mi Calendario",
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ["view-profile-artist"],
        },
      },
      {
        name: "artist.offers",
        path: "/artist/offers",
        component: () => import("pages/Artist/Offers/index.vue"),
        meta: {
          title: "Mis Ofertas",
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ["view-profile-artist"],
        },
      },
      {
        name: "artist.payout-info",
        path: "/artist/payout-info",
        component: () => import("pages/Artist/PayoutInfo/index.vue"),
        meta: {
          title: "Datos de Cobro",
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
          title: "Mis Tarjetas",
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
          title: "Todos los Géneros",
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
          title: "Búsqueda de Grupos",
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
          title: "Detalle del Grupo",
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
          title: "Carrito",
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ["view-shopping-cart"],
        },
      },

      {
        name: "client.view-my-order-details",
        path: "/client/shopping-cart/view-my-order-details",
        component: import("src/pages/Client/ShoppingCart/My_Order_Details.vue"),
        meta: {
          title: "Mis compras",
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ["view-my-order-details"],
        },
      },

      {
        name: "client.dataClient",
        path: "/client/shopping-cart/dataClient",
        component: import("src/pages/Client/ShoppingCart/dataClient.vue"),
        meta: {
          title: "Datos del Cliente",
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
          title: "Artistas Favoritos",
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ["view-favourite-artist"],
        },
      },

      {
        name: "client.view-store",
        path: "/client/store",
        component: import("src/pages/Client/Store/index.vue"),
        meta: {
          title: "Tienda",
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ["view-store"],
        },
      },

      {
        name: 'client.report-incident',
        path: '/client/report-incident/:saleId',
        component: import('src/pages/Client/ShoppingCart/ReportIncident.vue'),
        meta: {
          title: 'Reportar Incidente',
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ['view-my-order-details'],
        },
      },
      {
        name: 'client.report-incident',
        path: '/client/report-incident/:saleId',
        component: import('src/pages/Client/ShoppingCart/ReportIncident.vue'),
        meta: {
          title: 'Reportar Incidente',
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ['view-my-order-details', 'view-profile-artist'],
        },
      },
      {
        name: 'client.my-tickets',
        path: '/client/my-tickets',
        component: import('src/pages/Client/ShoppingCart/MyTickets.vue'),
        meta: {
          title: 'Mis Reportes',
          middleware: [Middlewares.checkPermissions],
          requireLogin: true,
          permissions: ['view-my-order-details', 'view-profile-artist'],
        },
      },
      // Fin de rutas del cliente
    ],
  },

  {
    path: "/authorize/google/callback",
    component: () => import("pages/Auth/LoginGoogle.vue"),
    meta: { title: "Autenticando..." }
  },

  {
    path: "/authorize/facebook/callback",
    component: () => import("pages/Auth/LoginFacebook.vue"),
    meta: { title: "Autenticando..." }
  },

  {
    path: "/authorize/login",
    component: () => import("pages/Auth/LoginForm.vue"),
    meta: { title: "Iniciar Sesión" }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
    meta: { title: "No encontrado" }
  },

  {
    path: "/session-expired",
    component: () => import("pages/SessionExpired.vue"),
    meta: { title: "Sesión Expirada" }
  },

  {
    path: "/forbidden",
    component: () => import("pages/Forbidden.vue"),
    meta: { title: "Acceso Denegado" }
  },
];

export default routes;
