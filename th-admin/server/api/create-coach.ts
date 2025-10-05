export default defineEventHandler(async event => {
  const { first_name, last_name } = getQuery(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      MERGE (s:Coach {first_name: $first_name, last_name: $last_name})
      ON CREATE SET s.id = s.first_name || ' ' || s.last_name
      RETURN s
    `,
    {
      first_name,
      last_name
    }
  )

  return summary
})
