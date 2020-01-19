const Pool = require('pg').Pool
const dotenv = require('dotenv');

dotenv.config();

const pool_master = new Pool({
  user: process.env.DB_MASTER_USER,
  host: process.env.DB_MASTER_HOST,
  database: process.env.DB_MASTER_DATABASE,
  password: process.env.DB_MASTER_PASSWORD,
  port: process.env.DB_MASTER_PORT,
  connectionTimeoutMillis: 2000
})

const pool_slave = new Pool({
  user: process.env.DB_SLAVE_USER,
  host: process.env.DB_SLAVE_HOST,
  database: process.env.DB_SLAVE_DATABASE,
  password: process.env.DB_SLAVE_PASSWORD,
  port: process.env.DB_SLAVE_PORT,
  connectionTimeoutMillis: 2000
})

const query = (queryText, values,callback) => {
  pool_master.query(queryText, values, (error_master, results_master) => {
    if (error_master) {
      pool_slave.query(queryText, values, (error_slave, results_slave) => {
        if (error_slave) {
          callback(error_slave, null)
          return
        }
        callback(null, results_slave)
      })
      return
    }
    callback(null, results_master)
  })
}

const queryNoValues = (queryText, callback) => {
  pool_master.query(queryText, (error_master, results_master) => {
    if (error_master) {
      pool_slave.query(queryText, (error_slave, results_slave) => {
        if (error_slave) {
          callback(error_slave, null)
          return
        }
        callback(null, results_slave)
      })
      return
    }
    callback(null, results_master)
  })
}

module.exports = {
  query,
  queryNoValues
 } ;
