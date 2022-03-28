import store from "./store";

export default (to, from, next) => {
  // Verifica si hay un usuario activo, con sesión
  console.log("este es el store", store)
  if (!store.getters.user) {
    next({ path: "/signin" });
  } else {
    next();
  }
};
