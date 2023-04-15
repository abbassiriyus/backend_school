const { Pool } = require("pg")

const pool = new Pool({
    user: 'postgres',
    password: "8HyfM0hU13oLnRTXUVeR",
    host: "containers-us-west-53.railway.app",
    port: 7205,
    database: "railway"
})

// const pool = new Pool({
//     user: 'postgres',
//     password: "abbas123",
//     host: "localhost",
//     port: 5432,
//     database: "Kindergarten_DB"
// })

pool.connect((err) => {
    if (!err) {
        console.log("Connect To SQL");
    } else {
        console.log(err);
    }
})





module.exports = pool