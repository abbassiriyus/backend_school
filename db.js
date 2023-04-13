const Pool=require("pg").Pool

const pool= new Pool(
    {
user:'',
password:"abbas123",
host:"localhost",
port:5432
}
)




module.exports=pool