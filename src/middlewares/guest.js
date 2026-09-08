export default function guest({ to, next }) {
  if (localStorage.getItem("token")) {
    return next({ name: "dashboardH" });
  }
  return next();
}
