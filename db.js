const { Pool } = require("pg")

//  const pool = new Pool({
//     user: 'postgres',
//     password: "abbas123",
//     host: "localhost",
//     port: 5432,
//      database: "Kindergarten_DB"
// }) 

const pool = new Pool({
    user: 'postgres',
    password: "OmEKxMvLtd4glG3nCb9x",
    host: "containers-us-west-155.railway.app",
    port: 7026,
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