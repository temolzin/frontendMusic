import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";

export default route(function ({ store, ssrContext }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({
      left: 0,
      top: 0,
    }),
    routes,

    history: createHistory(
      process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });

  function nextCheck(context, middleware, index){

    const nextMiddleware = middleware[index];

    if(!nextMiddleware) return context.next;

    return(...parameters)=>{
      context.next(...parameters);
      const nextMidd = nextCheck(context, middleware, index + 1);

      nextMiddleware({...context, next: nextMidd});
    }

  }

  Router.beforeEach((to, from, next) => {
    if(to.meta.middleware){
      const middleware = Array.isArray(to.meta.middleware)  ? to.meta.middleware : [to.meta.middleware];
        const context = {
          from,
          next,
          Router,
          to,
        };
        const nextMiddleware = nextCheck(context, middleware, 1);
        return middleware[0]({ ...context, next: nextMiddleware });
    }else{
      return next();
    }

  

  });

  return Router;
});
