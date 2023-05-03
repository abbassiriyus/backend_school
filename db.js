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
    password: "sg68CdZdMIRdY997F9uO",
    host: "containers-us-west-38.railway.app",
    port: 7140,
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