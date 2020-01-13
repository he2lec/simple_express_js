const Pool = require('pg').Pool
const dotenv = require('dotenv');

dotenv.config();

const pool_master = new Pool({
  user: process.env.DB__MASTER_USER,
  host: process.env.DB__MASTER_HOST,
  database: process.env.DB_MASTER_DATABASE,
  password: process.env.DB_MASTER_PASSWORD,
  port: process.env.DB_MASTER_PORT,
})

const pool_slave = new Pool({
  user: process.env.DB_SLAVE_USER,
  host: process.env.DB_SLAVE_HOST,
  database: process.env.DB_SLAVE_DATABASE,
  password: process.env.DB_SLAVE_PASSWORD,
  port: process.env.DB_SLAVE_PORT,
})

const query = (queryText, values,callback) => {
  pool_master.connect().catch((err) => console.log("Failed to connect to master db : " + err.message));
  pool_slave.connect().catch((err) => console.log("Failed to connect to slave db : " + err.message));

  pool_master.query(queryText, values, (error_master, results_master) => {
    if (error_master) {
      pool_slave.query(queryText, values, (error_slave, results_slave) => {
        if (error_slave) {
          callback(true, null)
          return
        }
        callback(false, results_slave)
      })
      return
    }
    callback(false, results_master)
  })
}

const queryNoValues = (queryText, callback) => {
  pool_master.connect().catch((err) => console.log("Failed to connect to master db : " + err.message));
  pool_slave.connect().catch((err) => console.log("Failed to connect to slave db : " + err.message));

  pool_master.query(queryText, (error_master, results_master) => {
    if (error_master) {
      pool_slave.query(queryText, (error_slave, results_slave) => {
        if (error_slave) {
          callback(true, null)
          return
        }
        callback(false, results_slave)
      })
      return
    }
    callback(false, results_master)
  })
}

module.exports = {
  query,
  queryNoValues
 } ;
