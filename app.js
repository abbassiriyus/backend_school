require("dotenv").config()
var express = require('express');
var app = express();

var fs =require('fs')
var cors = require('cors')
const upload = require("express-fileupload")
const pool = require("./db")
const PORT = process.env.PORT || 5000
app.use(cors())
app.use(upload())
app.use(express.static('./public'))
const jwt = require('jsonwebtoken');


const TOKEN = '69c65fbc9aeea59efdd9d8e04133485a09ffd78a70aff5700ed1a4b3db52d33392d67f12c1'

function autificationToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, TOKEN, (err, user) => {
        if (err) res.sendStatus(403)
    })
    next()
}





// address
app.get('/address', (req, res) => {
    pool.query("SELECT * FROM address", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/address/:id', (req, res) => {
    pool.query("SELECT * FROM address where addressid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/address', (req, res) => {
    const body = req.body
    pool.query("insert into address (region, city, street, house, building, flat) values ($1, $2, $3, $4, $5, $6)",
        [body.region, body.city, body.street, body.house, body.building, body.flat], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
    // insert into address(region, city, street, house, building, flat) values('Ñàðàòîâñêàÿ îáëàñòü', 'Ñàðàòîâ', 'Ïðîñïåêò èì.Ñòîëûïèíà', 5, null, 1)
})
app.delete('/address/:id', (req, res) => {
    pool.query("DELETE FROM address WHERE addressid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/address/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE address SET region=$1, city=$2, street=$3, house=$4, building=$5, flat=$6, syschangedatutc=$8 WHERE addressid=$7`,
        [body.region, body.city, body.street, body.house, body.building, body.flat, req.params.id, datenew], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})
app.post("/login",(req,res)=>{
    var data
    pool.query("SELECT * FROM person", (err, result) => {
        if (!err) {
            data = result.rows
            var kluch=true
        if (req.body.passportnumber && req.body.email){
           for (let i = 0; i < data.length; i++) {
             if(data[i].email === req.body.email && data[i].passportnumber === req.body.passportnumber){
                res.status(200).send('2')
              kluch=false
             }
        }
        if ("superAdmin"=== req.body.email && "123456789a" === req.body.passportnumber) {
                res.status(200).send('4')
                kluch = false
            }
    }else if(req.body.phone){
            for (let i = 0; i < data.length; i++) {
                if (data[i].phone === req.body.phone){
                    res.status(200).send('3')
                    kluch = false
                }
            }
        }else{
res.status(500).send("kerakli malumot yoq")
            }
if(kluch){
    res.status(501).send("tizimni buzib kirishga urunish")
}
        
} else {res.status(400).send(err)}
    })  
})
// Person
app.get('/person', (req, res) => {
    pool.query("SELECT * FROM person", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/person/:id', (req, res) => {
    pool.query("SELECT * FROM person where personid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/person', (req, res) => {
    const body = req.body
    pool.query("insert into person (personlastname, personfirstname, personmiddlename, dateofbirth, gender, passportseries,passportnumber, passportdate, phone, email, addressid) values ($1, $2, $3, $4, $5, $6,$7, $8, $9, $10, $11) RETURNING *",
        [body.personlastname, body.personfirstname, body.personmiddlename, body.dateofbirth, body.gender, body.passportseries, body.passportnumber, body.passportdate, body.phone, body.email, body.addressid], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/person/:id', (req, res) => {
    pool.query("DELETE FROM person WHERE personid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/person/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    /* pool.query(`UPDATE person SET personlastname = $1, personfirstname = $2, personmiddlename = $3,  dateofbirth = $4, gender=$5, passportseries=%6,
    passportnumber=$7, passportdate=$8, phone=$9, email=$10, addressid=$11
    WHERE personid = $12 `,
        [body.personlastname, body.personfirstname, body.personmiddlename, body.dateofbirth, body.gender, body.passportseries, body.passportnumber,
        body.passportdate, body.phone, body.email, body.addressid, req.params.id],
        (err, result) => {
             if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        }) */
    pool.query("UPDATE person SET personlastname = $1, personfirstname = $2, personmiddlename=$4, dateofbirth=$5, gender=$6, passportseries=$7, passportnumber=$8, passportdate=$9, phone=$10, email=$11, addressid=$12, syschangedatutc=$13 WHERE personid = $3",
        [body.personlastname, body.personfirstname, req.params.id, body.personmiddlename, body.dateofbirth, body.gender, body.passportseries, body.passportnumber, body.passportdate, body.phone, body.email, body.addressid, datenew],
        (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})

// legal_rep
app.get('/legal_rep', (req, res) => {
    pool.query("SELECT * FROM legal_rep", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/legal_rep/:id', (req, res) => {
    pool.query("SELECT * FROM legal_rep where legalrepid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/legal_rep', (req, res) => {
    const body = req.body
    pool.query("insert into legal_rep (personid, company) values ($1, $2)",
        [body.personid, body.company], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/legal_rep/:id', (req, res) => {
    pool.query("DELETE FROM legal_rep WHERE legalrepid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/legal_rep/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE legal_rep SET personid=$1, company=$2, syschangedatutc=$4 WHERE legalrepid=$3`,
        [body.personid, body.company, req.params.id, datenew], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(404).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})

// position
app.get('/position', (req, res) => {
    pool.query("SELECT * FROM position", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/position/:id', (req, res) => {
    pool.query("SELECT * FROM position where positionid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/position', (req, res) => {
    const body = req.body
    pool.query("insert into position ( positiontitle) values ($1)",
        [body.positiontitle], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/position/:id', (req, res) => {
    pool.query("DELETE FROM position WHERE positionid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/position/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE position SET positiontitle=$1, syschangedatutc=$3 WHERE positionid=$2`,
        [body.positiontitle, req.params.id, datenew], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})

// labor
app.get('/labor', (req, res) => {
    pool.query("SELECT * FROM labor", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/labor/:id', (req, res) => {
    pool.query("SELECT * FROM labor where laborid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/labor/title/:id', (req, res) => {
    pool.query("SELECT * FROM labor where laborname=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/labor', (req, res) => {
    const body = req.body
    pool.query("insert into labor ( laborname ) values ($1)",
        [body.laborname], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/labor/:id', (req, res) => {
    pool.query("DELETE FROM labor WHERE laborid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/labor/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE labor SET laborname=$1, syschangedatutc=$3 WHERE laborid=$2`,
        [body.laborname, req.params.id, datenew], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})

// employee
app.get('/employee', (req, res) => {
    pool.query("SELECT * FROM employee", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })})
app.get('/employee/:id', (req, res) => {
    pool.query("SELECT * FROM employee where employeeid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })})
app.post('/employee', (req, res) => {
    const body = req.body
    pool.query(`insert into employee ( personid, positionid, laborid, hiredate, dismissaldate, medical_cert, education) values ($1, $2, $3,$4,$5,$6, $7)`,
        [body.personid, body.positionid, body.laborid, body.hiredate, body.dismissaldate, body.medical_cert, body.education], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/employee/:id', (req, res) => {
    pool.query("DELETE FROM employee WHERE employeeid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/employee/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE employee SET personid=$1, positionid=$2, laborid=$3, hiredate=$4, dismissaldate=$5, medical_nert=$6, education=$7, syschangedatutc=$9 WHERE employeeid=$8`,
        [body.personid, body.positionid, body.laborid, body.hiredate, body.dismissaldate, body.medical_nert, body.education, req.params.id, datenew], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})

//room
app.get('/room', (req, res) => {
    pool.query("SELECT * FROM room", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/room/:id', (req, res) => {
    pool.query("SELECT * FROM room where roomid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/room', (req, res) => {
    const body = req.body
    pool.query("insert into room ( roomnumber, floor, square ) values ($1, $2, $3)",
        [body.roomnumber, body.floor, body.square], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/room/:id', (req, res) => {
    pool.query("DELETE FROM room WHERE roomid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/room/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE room SET roomnumber=$1, floor=$2, square=$3, syschangedatutc=$5 WHERE roomid=$4`,
        [body.roomnumber, body.floor, body.square, req.params.id, datenew], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})

//group
app.get('/group', (req, res) => {
    pool.query(`SELECT * FROM "group"`, (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/group/:id', (req, res) => {
    pool.query(`SELECT * FROM "group"  where groupid=$1`, [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/group', (req, res) => {
    const body = req.body
    pool.query(`insert into "group" ( groupname, ageid) values ($1, $2)`,
        [body.groupname, body.ageid], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/group/:id', (req, res) => {
    pool.query(`DELETE FROM "group" WHERE groupid=$1`, [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/group/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE "group" SET groupname=$1, ageid=$2, syschangedatutc=$3 WHERE groupid=$4`,
        [body.groupname, body.ageid, datenew, req.params.id], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})

//group_emp
app.get('/group_emp', (req, res) => {
    pool.query("SELECT * FROM group_emp", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/group_emp/:id', (req, res) => {
    pool.query("SELECT * FROM group_emp where employeeid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/group_emp', (req, res) => {
    const body = req.body
    pool.query("insert into group_emp ( employeeid, groupid ) values ($1, $2)",
        [body.employeeid, body.groupid], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})

//child
app.get('/child', (req, res) => {
    pool.query("SELECT * FROM child", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/child/:id', (req, res) => {
    pool.query("SELECT * FROM child where childid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/child', (req, res) => {
    const body = req.body
    pool.query("insert into child ( childlastname, childfirstname, childmiddlename, dateofbirth, addressid, gender, certificateofbirth, groupid, health, isregisteredwith, allergy, deviations, medicines, healthrestrictions, diet, comment ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)",
        [body.childlastname, body.childfirstname, body.childmiddlename, body.dateofbirth, body.addressid, body.gender, body.certificateofbirth, body.groupid, body.health, body.isregisteredwith, body.allergy, body.deviations, body.medicines, body.healthrestrictions, body.diet, body.comment], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/child/:id', (req, res) => {
    pool.query(`DELETE FROM child  WHERE childid=$1`, [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/child/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE child SET childlastname=$1, childfirstname=$2, childmiddlename=$3, dateofbirth=$4, addressid=$5, gender=$6, certificateofbirth=$7, groupid=$8,
    health=$9, isregisteredwith=$10, allergy=$11, deviations=$12, medicines=$13, healthrestrictions=$14, diet=$15, comment=$16, syschangedatutc=$17
    WHERE childid=$18`,
        [body.childlastname, body.childfirstname, body.childmiddlename, body.dateofbirth, body.addressid, body.gender, body.certificateofbirth, body.groupid, body.health, body.isregisteredwith, body.allergy, body.deviations, body.medicines, body.healthrestrictions, body.diet, body.comment, datenew, req.params.id], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})

// vaccination
app.get('/vaccination', (req, res) => {
    pool.query("SELECT * FROM vaccination", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/vaccination/:id', (req, res) => {
    pool.query("SELECT * FROM vaccination where vaccinationid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/vaccination', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query("insert into vaccination ( namevac, syscreatedatutc, syschangedatutc ) values ($1, $2, $3)",
        [body.namevac, datenew, datenew], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/vaccination/:id', (req, res) => {
    pool.query("DELETE FROM vaccination WHERE vaccinationid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/vaccination/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE vaccination SET namevac=$1, syschangedatutc=$2 WHERE vaccinationid=$3`,
        [body.namevac, datenew, req.params.id], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})


//child_vac
app.get('/child_vac', (req, res) => {
    pool.query("SELECT * FROM child_vac", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/child_vac/:id', (req, res) => {
    pool.query("SELECT * FROM child_vac where child_vacid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/child_vac', (req, res) => {
    const body = req.body
    pool.query("insert into child_vac ( childid, vaccinationid, date) values ($1, $2, $3)",
        [body.childid, body.vaccinationid, body.date], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/child_vac/:id', (req, res) => {
    pool.query("DELETE FROM child_vac WHERE child_vacid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/child_vac/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE child_vac SET childid=$1,vaccinationid=$2, date=$3, syschangedatutc=$5 WHERE child_vacid=$4`,
        [body.childid, body.vaccinationid, body.date, req.params.id, datenew], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})


//relation
app.get('/relation', (req, res) => {
    pool.query("SELECT * FROM relation", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/relation/:id', (req, res) => {
    pool.query("SELECT * FROM relation where relationid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/relation', (req, res) => {
    const body = req.body
    pool.query("insert into relation ( legalrepid, childid, status ) values ($1, $2, $3)",
        [body.legalrepid, body.childid, body.status], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/relation/:id', (req, res) => {
    pool.query("DELETE FROM relation WHERE relationid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/relation/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE relation SET legalrepid=$1,childid=$2,status=$3, syschangedatutc=$5 WHERE relationid=$4 RETURNING *`,
        [body.legalrepid, body.childid, body.status, req.params.id, datenew], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})


//contract
app.get('/contract', (req, res) => {
    pool.query("SELECT * FROM contract", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/contract/:id', (req, res) => {
    pool.query("SELECT * FROM contract where contractid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/contract', (req, res) => {
    const body = req.body
    pool.query("insert into contract ( number, date, legalrepid, childid) values ($1, $2, $3,$4)",
        [body.number, body.date, body.legalrepid, body.childid], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/contract/:id', (req, res) => {
    pool.query("DELETE FROM contract WHERE contractid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/contract/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE contract SET number=$1, date=$2, legalrepid=$3, childid=$4, syschangedatutc=$6 WHERE contractid=$5`,
        [body.number, body.date, body.legalrepid, body.childid, req.params.id, datenew], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})



//subject_group
app.get('/subject_group', (req, res) => {
    pool.query("SELECT * FROM subject_group", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/subject_group/:id', (req, res) => {
    pool.query("SELECT * FROM subject_group where subject_groupid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/subject_group', (req, res) => {
    const body = req.body
    pool.query("insert into subject_group ( subjectgroupname, description ) values ($1, $2)",
        [body.subjectgroupname, body.description], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/subject_group/:id', (req, res) => {
    pool.query("DELETE FROM subject_group WHERE subject_groupid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/subject_group/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE subject_group SET subjectgroupname=$1,description=$2, syschangedatutc=$4 WHERE subject_groupid=$3`,
        [body.subjectgroupname, body.description, req.params.id, datenew], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})

//subject
app.get('/subject', (req, res) => {
    pool.query("SELECT * FROM subject", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/subject/:id', (req, res) => {
    pool.query("SELECT * FROM subject where subjectid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/subject', (req, res) => {
    var newdate = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    const body = req.body
    pool.query("insert into subject ( subjectname, subjectgroupid, duration ) values ($1,$2,$3)",
        [body.subjectname, body.subjectgroupid, newdate], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/subject/:id', (req, res) => {
    pool.query("DELETE FROM subject WHERE subjectid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/subject/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE subject SET subjectname=$1, subjectgroupid=$2, duration=$3, syschangedatutc=$5 WHERE subjectid=$4`,
        [body.subjectname, body.subjectgroupid, body.duration, req.params.id, datenew], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})


//excuse
app.get('/excuse', (req, res) => {
    pool.query("SELECT * FROM excuse", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/excuse/:id', (req, res) => {
    pool.query("SELECT * FROM excuse where excuseid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/excuse', (req, res) => {
    const body = req.body
    pool.query("insert into excuse ( datestart, dateend, childid, daypart, reason, employeeid) values ($1,$2,$3,$4,$5,$6) RETURNING *",
        [body.datestart, body.dateend, body.childid, body.daypart, body.reason, body.employeeid], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/excuse/:id', (req, res) => {
    pool.query("DELETE FROM excuse WHERE excuseid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/excuse/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE excuse SET datestart=$1, dateend=$2, childid=$3, daypart=$4, reason=$5, employeeid=$6, syschangedatutc=$8 WHERE excuseid=$7`,
        [body.datestart, body.dateend, body.childid, body.daypart, body.reason, body.employeeid, req.params.id, datenew], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})

//attendance
app.get('/attendance', (req, res) => {
    pool.query("SELECT * FROM attendance", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/attendance/:id', (req, res) => {
    pool.query("SELECT * FROM attendance where attendanceid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/attendance', (req, res) => {
    const body = req.body
    pool.query("insert into attendance ( date,childid,arrivaltime,leavingtime,excuseid,employeeid) values ($1,$2,$3,$4,$5,$6) RETURNING *",
        [body.date, body.childid, body.arrivaltime, body.leavingtime, body.excuseid, body.employeeid], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/attendance/:id', (req, res) => {
    pool.query("DELETE FROM attendance WHERE attendanceid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/attendance/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE attendance SET date=$1,childid=$2,arrivaltime=$3,leavingtime=$4,excuseid=$5,employeeid=$6, syschangedatutc=$8 WHERE attendanceid=$7 RETURNING *`,
        [body.date, body.childid, body.arrivaltime, body.leavingtime, body.excuseid, body.employeeid, req.params.id, datenew], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})

//skill_group
app.get('/skill_group', (req, res) => {
    pool.query("SELECT * FROM skill_group", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/skill_group/:id', (req, res) => {
    pool.query("SELECT * FROM skill_group where skill_groupid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/skill_group', (req, res) => {
    const body = req.body
    pool.query("insert into skill_group ( skillgroupname) values ($1)",
        [body.skillgroupname], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/skill_group/:id', (req, res) => {
    pool.query("DELETE FROM skill_group WHERE skill_groupid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/skill_group/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE skill_group SET skillgroupname=$1, syschangedatutc=$3 WHERE skill_groupid=$2`,
        [body.subjectname,req.params.id, datenew], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})



//skill
app.get('/skill', (req, res) => {
    pool.query("SELECT * FROM skill", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/skill/:id', (req, res) => {
    pool.query("SELECT * FROM skill where skillid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/skill', (req, res) => {
    const body = req.body
    pool.query("insert into skill ( skillname,skillgroupid) values ($1,$2) RETURNING *",
        [body.skillname, body.skillgroupid], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/skill/:id', (req, res) => {
    pool.query("DELETE FROM skill WHERE skillid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/skill/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE skill SET skillname=$1,skillgroupid=$2, syschangedatutc=$4 WHERE skillid=$3 RETURNING *`,
        [body.skillname, body.skillgroupid, req.params.id, datenew], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})



app.get('/question', (req, res) => {
    pool.query("SELECT * FROM question", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/question/:id', (req, res) => {
    pool.query("SELECT * FROM question where questionid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/question', (req, res) => {
    const body = req.body
    var datenew = new Date().toISOString()
    const { question_img } = req.files;
    var rendom = Math.floor(Math.random() * 10000000);
    var img2 = rendom + question_img.name.slice(question_img.name.lastIndexOf('.'));
    question_img.mv(__dirname + '/public/' + img2);
    pool.query("insert into question (question, question_img, answer, skillid,author,month,syscreatedatutc, syschangedatutc) values ($1, $2, $3, $4,$5,$6,$7,$8)",
        [body.question,img2,body.answer,body.skillid,body.author,body.month,datenew,datenew], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/question/:id', (req, res) => {
    pool.query("SELECT * FROM question where questionid=$1", [req.params.id], (err, result) => {
      if (result.rows.length>0) {
        if (!err) {
            fs.unlink(`./public/${result.rows[0].question_img}`, function (err) {
                if (err && err.code == 'ENOENT') {
                    console.info("File doesn't exist, won't remove it.");
                } else if (err) {
                    console.error("Error occurred while trying to remove file");
                } else {
                    console.info(`removed`);
                }
            });
        } else {
            res.status(400).send(err)
        }
      }
    })

    pool.query("DELETE FROM question WHERE questionid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
              
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/question/:id', (req, res) => {

    pool.query("SELECT * FROM question where questionid=$1", [req.params.id], (err, result) => {
        const { question_img }=req.files
        if (result.rows.length>0) {
          if (!err){
              question_img.mv(__dirname + '/public/' + result.rows[0].question_img);
          } else {
              res.status(400).send(err)
          }
        }
      })
    var datenew = new Date().toISOString()
    pool.query("SELECT * FROM question where questionid=$1", [req.params.id], (err, result) => {
        if (result.rows.length>0) {
          if (!err) {
              fs.unlink(`./public/${result.rows[0].question_img}`, function (err) {
                  if (err && err.code == 'ENOENT') {
                      console.info("File doesn't exist, won't remove it.");
                  } else if (err) {
                      console.error("Error occurred while trying to remove file");
                  } else {
                      console.info(`removed`);
                  }
              });
          } else {
              res.status(400).send(err)
          }
        }
      })
    const body = req.body
    pool.query(`UPDATE question SET question=$1,  answer=$3, skillid=$4,author=$5,month=$6 ,syschangedatutc=$7 WHERE questionid=$2`,
        [body.question, req.params.id,body.answer,body.skillid,body.author,body.month, datenew], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})

//test
app.get('/test', (req, res) => {
    pool.query("SELECT * FROM test", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/test/:id', (req, res) => {
    pool.query("SELECT * FROM test where testid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/test', (req, res) => {
    const body = req.body
    pool.query("insert into test ( testtitle, childid, questionid, date, score ) values ($1,$2,$3,$4,$5)",
        [body.testtitle, body.childid, body.questionid, body.date, body.score], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/test/:id', (req, res) => {
    pool.query("DELETE FROM test WHERE testid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/test/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE test SET testtitle=$1,childid=$2,questionid=$3,date=$4,score=$5, syschangedatutc=$7 WHERE testid=$6`,
        [body.testtitle, body.childid, body.questionid, body.date, body.score, req.params.id, datenew], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})



//timetable
app.get('/timetable', (req, res) => {
    pool.query("SELECT * FROM timetable", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/timetable/:id', (req, res) => {
    pool.query("SELECT * FROM timetable where timetableid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/timetable', (req, res) => {
    const body = req.body
    var datenew = new Date().toISOString()
    pool.query("insert into timetable( weekday, groupid, subjectid, begining, finishing, employeeid, roomid,day,syscreatedatutc, syschangedatutc ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,10$)",
        [body.weekday, body.groupid, body.subjectid, body.begining, body.finishing, body.employeeid, body.roomid,body.day,datenew,datenew], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/timetable/:id', (req, res) => {
    pool.query("DELETE FROM timetable WHERE timetableid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/timetable/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE timetable SET weekday=$1,groupid=$2,subjectid=$3,begining=$4,finishing=$5,employeeid=$6,roomid=$7, day=$8, syschangedatutc=$9 WHERE timetableid=$10 RETURNING *`,
        [body.weekday, body.groupid, body.subjectid, body.begining, body.finishing, body.employeeid, body.roomid,body.day, req.params.id, datenew], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})

//syllabus
app.get('/syllabus', (req, res) => {
    pool.query("SELECT * FROM syllabus", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/syllabus/:id', (req, res) => {
    pool.query("SELECT * FROM syllabus where syllabusid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/syllabus', (req, res) => {
    const body = req.body
    pool.query("insert into syllabus ( year,month,weeknumber,topic,subjectid,quantity) values ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
        [body.year, body.month, body.weeknumber, body.topic, body.subjectid, body.quantity], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/syllabus/:id', (req, res) => {
    pool.query("DELETE FROM syllabus WHERE syllabusid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/syllabus/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE syllabus SET year=$1,month=$2,weeknumber=$3,topic=$4,subjectid=$5,quantity=$6, syschangedatutc=$8 WHERE timetableid=$7`,
        [body.year, body.month, body.weeknumber, body.topic, body.subjectid, body.quantity, req.params.id, datenew], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})
app.get('/syllabu', (req, res) => {
    pool.query("SELECT * FROM syllabu", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/syllabu/:id', (req, res) => {
    pool.query("SELECT * FROM syllabu where syllabuid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/syllabu', (req, res) => {
    const body = req.body
    pool.query("insert into syllabu ( subjectid,winterparty,winterles,mountain,animal) values ($1,$2,$3,$4,$5) RETURNING *",
        [body.subjectid, body.winterparty, body.winterles, body.mountain, body.animal], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/syllabu/:id', (req, res) => {
    pool.query("DELETE FROM syllabu WHERE syllabuid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/syllabu/:id', (req, res) => {
    var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE syllabu SET subjectid=$1,winterparty=$2,winterles=$3,mountain=$4,animal=$5, WHERE timetableid=$6`,
        [body.subjectid, body.winterparty, body.winterles, body.mountain, body.animal, req.params.id], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})




app.listen(PORT, function () {
    console.log(`Listening to Port ${PORT}`);
});
