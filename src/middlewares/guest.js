export default function guest({ to, next, Router }) {
  if (localStorage.getItem("token")) {
    return Router.push({ name: "dashboardH" });
  } else{ 
    next();
  }
}