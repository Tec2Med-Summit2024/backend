import neo4j from 'neo4j-driver'
(async () => {
  // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
  const URI = process.env.DB_URI || 'neo4j://localhost'
  const USER = process.env.DB_USER || 'neo4j'
  const PASSWORD = process.env.DB_PWD || 'secret'
  let driver

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
    const serverInfo = await driver.getServerInfo()
    console.log('Connection established')
    console.log(serverInfo)
    await driver.close()
  } catch(err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`)
  }
})();