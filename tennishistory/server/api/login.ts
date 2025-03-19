export default defineEventHandler(async event => {
  const body = await readBody(event)
  const { password, username } = body

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (u:User {username: $username})
      RETURN u.id AS userId, u.name AS name, u.email AS email, u.password AS password
    `,
    { username }
  )

  if (!records.length) return { status: 401, body: { message: "Invalid credentials" } }

  const user = records[0]

  if (await verifyPassword(user.get("password"), password)) {
    // Create a session for the user
    const sessionToken = await setUserSession(event, {
      user: {
        userId: user.get("userId"),
        name: user.get("name"),
        email: user.get("email"),
        username: username
      },
      loggedInAt: new Date()
    })

    return {
      status: 201,
      body: {
        message: "Successfully logged in",
        userId: user.get("userId"),
        token: sessionToken
      }
    }
  } else {
    return { status: 401, body: { message: "Invalid credentials" } }
  }
})
