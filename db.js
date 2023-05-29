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
    password: "ZYYVd0QPEpGqk5ohYC1u",
    host: "containers-us-west-34.railway.app",
    port: 7368,
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