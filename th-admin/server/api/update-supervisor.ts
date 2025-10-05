export default defineEventHandler(async event => {
  const { id, first_name, last_name } = getQuery(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (s:Supervisor {id: $id})
      SET s.first_name = $first_name, s.last_name = $last_name
    `,
    {
      id,
      first_name,
      last_name
    }
  )

  return summary
})
