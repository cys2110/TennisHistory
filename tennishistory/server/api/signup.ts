export default defineEventHandler(async event => {
  const body = await readBody(event)
  const { email, password, name, username } = body

  // Check if username or email already exists
  const { records: existingUsers } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (u:User {username: $username})
      OPTIONAL MATCH (x:User {email: $email})
      RETURN
        COUNT(u) > 0 AS usernameTaken,
        COUNT(x) > 0 AS emailTaken
    `,
    { email, username }
  )

  if (existingUsers.length > 0) {
    const { usernameTaken, emailTaken } = existingUsers[0].toObject()

    if (usernameTaken) return { status: 409, body: { message: "Username already taken" } }
    if (emailTaken) return { status: 409, body: { message: "Email already registered" } }
  }

  const hashedPassword = await hashPassword(password)

  // Create the user
  const { records } = await useDriver().executeQuery(
    `/* cypher */
      CREATE (u:User {id: apoc.create.uuid(), email: $email, password: $hashedPassword, name: $name, username: $username, created_at: datetime()})
      RETURN u.id AS userId, u.name AS name, u.email AS email, u.username AS username
    `,
    { email, hashedPassword, name, username }
  )

  if (!records.length) {
    return { status: 500, body: { message: "User creation failed" } }
  }

  const user = records[0].toObject()

  // Create a session for the new user
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
      message: "User created successfully",
      userId: user.userId,
      token: sessionToken
    }
  }
})
