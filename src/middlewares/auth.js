export default function auth({ next, Router }) {
  if (!localStorage.getItem("token")) {
    return Router.push({ name: "LoginIn" });
  } else{ 
    next();
  }
}
