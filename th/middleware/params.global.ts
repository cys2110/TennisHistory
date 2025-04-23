export default defineNuxtRouteMiddleware((to, from) => {
  Object.keys(from.params).forEach(key => {
    if (to.params[key] === undefined) to.params[key] = " "
  })
})
