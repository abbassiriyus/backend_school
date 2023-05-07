const { Pool } = require("pg")

//  const pool = new Pool({
//     user: 'postgres',
//     password: "abbas123",
//     host: "localhost",
//     port: 5432,
//      database: "school"
// }) 

const pool = new Pool({
    user: 'postgres',
    password: "PWi6OPoEo6wBbCMMegDC",
    host: "containers-us-west-77.railway.app",
    port: 5532,
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