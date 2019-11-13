const { Pool } = require('pg')

const config = {
  pg: {
    connection: process.env.POSTGRES_URL,
    pool: new Pool({ connectionString: process.env.POSTGRES_URL })
  }
}

module.exports = config