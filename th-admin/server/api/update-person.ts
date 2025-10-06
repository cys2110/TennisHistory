export default defineEventHandler(async event => {
  const { id, first_name, last_name, type } = getQuery(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (s:$($type) {id: $id})
      SET s.first_name = $first_name, s.last_name = $last_name
    `,
    {
      id,
      first_name,
      last_name,
      type
    }
  )

  return summary
})
