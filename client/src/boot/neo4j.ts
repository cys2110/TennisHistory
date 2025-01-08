import { defineBoot } from '#q-app/wrappers'
import neo4j from 'neo4j-driver'
const URI = process.env.NEO4J_URI
const USER = process.env.NEO4J_USERNAME
const PASSWORD = process.env.NEO4J_PASSWORD

const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))

driver
  .getServerInfo()
  .then((info) => console.log(info))
  .catch((error) => console.error('Connection error:', error))

const executeQuery = async (query: string, params = {}) => {
  const { records } = await driver.executeQuery(query, params, { database: 'neo4j' })
  return records.map((record) => record.toObject())
}

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot(async ({ app }) => {
  app.config.globalProperties.$neo4j = driver
  app.config.globalProperties.$executeQuery = executeQuery
  app.onUnmount(() => {
    driver.close()
    console.log('Neo4j driver closed')
  })
})

export { executeQuery }
