export default defineNuxtRouteMiddleware(async (to, from) => {
  Object.keys(from.params).forEach(key => {
    // If the key does not exist in `to.params`, set it to '-'
    if (to.params[key] === undefined) {
      to.params[key] = " "
    }
  })

  const userSession = useUserSession()

  const excluded = ["/", "/login", "/signup", "/about"]

  if (!excluded.includes(to.path) && !userSession.loggedIn.value) return navigateTo("/login")
})
