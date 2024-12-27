export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === "/h2h") {
    return navigateTo("/h2h/jannik_sinner-v-alexander_zverev/s0ag-z355");
  }
});
