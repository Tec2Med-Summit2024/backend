import neo4j from 'neo4j-driver';

async function getDriver() {
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
    return driver
  } catch(err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`)
  }
};

async function createNode(driver, label, properties) {
  const session = driver.session({database: 'neo4j'})
  const query = `CREATE (n:${label} $properties) RETURN n`
  const result = await session.run(query, {properties})
  session.close()
  return result.records[0].get(0)
}

const driver = await getDriver();



driver.close()