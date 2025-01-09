import neo4j from 'neo4j-driver'

const URI = import.meta.env.VITE_NEO4J_URI
const USER = import.meta.env.VITE_NEO4J_USERNAME
const PASSWORD = import.meta.env.VITE_NEO4J_PASSWORD

const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))

driver
  .getServerInfo()
  .then((info) => console.log(info))
  .catch((e) => console.error('Connection error:', e))

window.addEventListener('beforeunload', async () => {
  await driver.close()
  console.log('Driver closed.')
})

export default driver
