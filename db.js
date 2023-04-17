const { Pool } = require("pg")

/* const pool = new Pool({
    user: 'postgres',
    password: "U_A1118Tiny",
    host: "localhost",
    port: 5432,
    database: "Test"
}) */

const pool = new Pool({
    user: 'postgres',
    password: "lZzucb90bhHJmPWh3o8d",
    host: "containers-us-west-177.railway.app",
    port: 6696,
    database: "railway"
})

pool.connect((err) => {
    if (!err) {
        console.log("Connect To SQL");
    } else {
        console.log(err);
    }
})





module.exports = pool