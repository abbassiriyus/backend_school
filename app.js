require('dotenv').config()
var express = require('express');
var app = express();
var cors = require('cors')
const upload = require("express-fileupload")
const fs = require('fs')
const uuid = require("uuid");
var nodemailer = require('nodemailer');
const math = require('mathjs')
const pool = require("./db")
const PORT = process.env.PORT || 5000
app.use(cors())
app.use(upload())

const jwt = require('jsonwebtoken');
const e = require('express');
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
    pool.query("insert into address (region, city, street, house, building, flat) values ($1, $2, $3, $4, $5, $6) RETURNING *",
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
            res.status(200).send("Deleted")
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/address/:id', (req, res) => {
    const body = req.body
    pool.query(`UPDATE address SET region=$1, city=$2, street=$3, house=$4, building=$5, flat=$6 WHERE addressid=$7 RETURNING *`,
        [body.region, body.city, body.street, body.house, body.building, body.flat, req.params.id], (err, result) => {
            if (!err) {
                res.status(200).send("Updated")
            } else {
                res.status(400).send(err)
            }
        })
})

// Person
app.get('/person', (req, res) => {
    pool.query("SELECT * FROM person", (err, result) => {
        if(!err) {
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
    pool.query("insert into person (personlastname, personfirstname, personmiddlename, dateofbirth, gender, passportseries,passportnumber, passportdate, phone, email, addressid, syscreatedatutc, syschangedatutc) values ($1, $2, $3, $4, $5, $6,$7, $8, $9, $10, $11, $12, $13) RETURNING *",
        [body.personlastname, body.personfirstname, body.personmiddlename, body.dateofbirth, body.gender, body.passportseries, body.passportnumber, body.passportdate, body.phone, body.email, body.addressid, body.syscreatedatutc, body.syschangedatutc], (err, result) => {
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
            res.status(200).send("Deleted")
        } else {
            res.status(400).send(err)
        }
    })
})

// ishlamadi 
app.put('/person/:id', (req, res) => {
    const body = req.body
    pool.query(`UPDATE person SET personlastname=$1, personfirstname=$2, personmiddlename=$3, dateofbirth=$4, gender=$5, passportseries=$6 passportnumber=$7, passportdate=$8, phone=$9, email=$10, addressid=$11 WHERE personid=$12 RETURNING *`,
        [body.personlastname, body.personfirstname, body.personmiddlename, body.dateofbirth, body.gender, body.passportseries, body.passportnumber, body.passportdate, body.phone, body.email, body.addressid, req.params.id], (err, result) => {
            if (!err) {
                res.status(200).send("Updated")
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
    pool.query("insert into legal_rep ( personid, company, syscreatedatutc, syschangedatutc) values ($1, $2, $3, $4) RETURNING *",
        [body.personid, body.company, body.syscreatedatutc, body.syschangedatutc], (err, result) => {
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
            res.status(200).send("Deleted")
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/legal_rep/:id', (req, res) => {
    const body = req.body
    pool.query(`UPDATE legal_rep SET personid=$1, company=$2 WHERE legalrepid=$3 RETURNING *`,
        [body.personid, body.company, req.params.id], (err, result) => {
            if (!err) {
                res.status(200).send("Updated")
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
    pool.query("insert into position ( positiontitle, syscreatedatutc, syschangedatutc ) values ($1, $2, $3) RETURNING *",
        [body.positiontitle, body.syscreatedatutc, body.syschangedatutc], (err, result) => {
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
            res.status(200).send("Deleted")
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/position/:id', (req, res) => {
    const body = req.body
    pool.query(`UPDATE position SET positiontitle=$1 WHERE positionid=$2 RETURNING *`,
        [body.positiontitle, req.params.id], (err, result) => {
            if (!err) {
                res.status(200).send("Updated")
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
app.post('/labor', (req, res) => {
    const body = req.body
    pool.query("insert into labor ( laborname, syscreatedatutc, syschangedatutc ) values ($1, $2, $3) RETURNING *",
        [body.laborname, body.syscreatedatutc, body.syschangedatutc], (err, result) => {
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
            res.status(200).send("Deleted")
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/labor/:id', (req, res) => {
    const body = req.body
    pool.query(`UPDATE labor SET laborname=$1 WHERE laborid=$2 RETURNING *`,
        [body.laborname, req.params.id], (err, result) => {
            if (!err) {
                res.status(200).send("Updated")
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
    })
})
app.get('/employee/:id', (req, res) => {
    pool.query("SELECT * FROM employee where employeeid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
// ishlamadi
// app.post('/employee', (req, res) => {
//     const body = req.body
//     pool.query("insert into employee ( personid,positionid,laborid,hiredate,dismissaldate,medical_Ñert,education,photo, syscreatedatutc, syschangedatutc ) values ($1, $2, $3,$4,$5,$6, $7, $8,$9,$10) RETURNING *",
//         [body.personid, body.positionid, body.laborid, body.hiredate, body.dismissaldate, body.medical_Ñert, body.education, body.photo, body.syscreatedatutc, body.syschangedatutc], (err, result) => {
//             if (!err) {
//                 res.status(201).send("Created")
//             } else {
//                 res.status(400).send(err)
//             }
//         })
// })
app.delete('/employee/:id', (req, res) => {
    pool.query("DELETE FROM labor WHERE employeeid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send("Deleted")
        } else {
            res.status(400).send(err)
        }
    })
})
// ishlamadi
// app.put('/employee/:id', (req, res) => {
//     const body = req.body
//     pool.query(`UPDATE employee SET laborname=$1 WHERE employeeid=$2 RETURNING *`,
//         [body.laborname, req.params.id], (err, result) => {
//             if (!err) {
//                 res.status(200).send("Updated")
//             } else {
//                 res.status(400).send(err)
//             }
//         })
// })



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
    pool.query("insert into room ( roomnumber,floor,square, syscreatedatutc, syschangedatutc ) values ($1, $2, $3,$4,$5) RETURNING *",
        [body.roomnumber, body.floor, body.square, body.syscreatedatutc, body.syschangedatutc], (err, result) => {
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
            res.status(200).send("Deleted")
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/room/:id', (req, res) => {
    const body = req.body
    pool.query(`UPDATE room SET roomnumber=$1,floor=$2,square=$3 WHERE roomid=$4 RETURNING *`,
        [body.roomnumber, body.floor, body.square,  req.params.id], (err, result) => {
            if (!err) {
                res.status(200).send("Updated")
            } else {
                res.status(400).send(err)
            }
        })
})

//group
// ishlamadi


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
    pool.query("insert into group_emp ( groupid syscreatedatutc, syschangedatutc ) values ($1, $2, $3) RETURNING *",
        [body.groupid, body.syscreatedatutc, body.syschangedatutc], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/group_emp/:id', (req, res) => {
    pool.query("DELETE FROM group_emp WHERE employeeid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send("Deleted")
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/group_emp/:id', (req, res) => {
    const body = req.body
    pool.query(`UPDATE group_emp SET groupid=$1 WHERE employeeid=$2 RETURNING *`,
        [body.groupid, req.params.id], (err, result) => {
            if (!err) {
                res.status(200).send("Updated")
            } else {
                res.status(400).send(err)
            }
        })
})

//child
// ishlamadi rasm borakan nimadur qilish kerak


//vaccination
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
    const body = req.body
    pool.query("insert into vaccination ( namevac, syscreatedatutc, syschangedatutc ) values ($1, $2, $3) RETURNING *",
        [body.namevac, body.syscreatedatutc, body.syschangedatutc], (err, result) => {
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
            res.status(200).send("Deleted")
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/vaccination/:id', (req, res) => {
    const body = req.body
    pool.query(`UPDATE vaccination SET namevac=$1 WHERE vaccinationid=$2 RETURNING *`,
        [body.namevac, req.params.id], (err, result) => {
            if (!err) {
                res.status(200).send("Updated")
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
    pool.query("insert into child_vac ( childid,vaccinationid,date, syscreatedatutc, syschangedatutc ) values ($1, $2, $3,$4,$5) RETURNING *",
        [body.childid, body.vaccinationid, body.date, body.syscreatedatutc, body.syschangedatutc], (err, result) => {
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
            res.status(200).send("Deleted")
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/child_vac/:id', (req, res) => {
    const body = req.body
    pool.query(`UPDATE child_vac SET childid=$1,vaccinationid=$2,date=$3 WHERE child_vacid=$4 RETURNING *`,
        [body.childid, body.vaccinationid, body.date,  req.params.id], (err, result) => {
            if (!err) {
                res.status(200).send("Updated")
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
    pool.query("insert into relation ( legalrepid,childid,status, syscreatedatutc, syschangedatutc ) values ($1, $2, $3,$4,$5) RETURNING *",
        [body.legalrepid, body.childid, body.status, body.syscreatedatutc, body.syschangedatutc], (err, result) => {
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
            res.status(200).send("Deleted")
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/relation/:id', (req, res) => {
    const body = req.body
    pool.query(`UPDATE relation SET legalrepid=$1,childid=$2,status=$3 WHERE relationid=$4 RETURNING *`,
        [body.legalrepid, body.childid, body.status, req.params.id], (err, result) => {
            if (!err) {
                res.status(200).send("Updated")
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
    pool.query("insert into contract ( number,date,legalrepid,childid, syscreatedatutc, syschangedatutc ) values ($1, $2, $3,$4,$5,$6) RETURNING *",
        [body.number, body.date, body.legalrepid, body.childid, body.syscreatedatutc, body.syschangedatutc], (err, result) => {
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
            res.status(200).send("Deleted")
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/contract/:id', (req, res) => {
    const body = req.body
    pool.query(`UPDATE contract SET number=$1,date=$2,legalrepid=$3,childid=$4 WHERE contractid=$5 RETURNING *`,
        [body.number, body.date, body.legalrepid, body.childid, req.params.id], (err, result) => {
            if (!err) {
                res.status(200).send("Updated")
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
    pool.query("insert into subject_group ( subjectgroupname,description, syscreatedatutc, syschangedatutc ) values ($1, $2, $3,$4) RETURNING *",
        [body.subjectgroupname, body.description, body.syscreatedatutc, body.syschangedatutc], (err, result) => {
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
            res.status(200).send("Deleted")
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/subject_group/:id', (req, res) => {
    const body = req.body
    pool.query(`UPDATE subject_group SET subjectgroupname=$1,description=$2, WHERE subject_groupid=$3 RETURNING *`,
        [body.subjectgroupname, body.description,  req.params.id], (err, result) => {
            if (!err) {
                res.status(200).send("Updated")
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
    const body = req.body
    pool.query("insert into subject ( subjectname,subjectgroupid,duration,syscreatedatutc, syschangedatutc ) values ($1,$2,$3,$4,$5) RETURNING *",
        [body.subjectname, body.subjectgroupid, body.duration,  body.syscreatedatutc, body.syschangedatutc], (err, result) => {
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
            res.status(200).send("Deleted")
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/subject/:id', (req, res) => {
    const body = req.body
    pool.query(`UPDATE subject SET subjectname=$1,subjectgroupid=$2,duration=$3 WHERE subjectid=$4 RETURNING *`,
        [body.subjectname, body.subjectgroupid, body.duration,  req.params.id], (err, result) => {
            if (!err) {
                res.status(200).send("Updated")
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
    pool.query("insert into attendance ( date,childid,arrivaltime,leavingtime,excuseid,employeeid,syscreatedatutc, syschangedatutc ) values ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
        [body.date, body.childid, body.arrivaltime, body.leavingtime, body.excuseid, body.employeeid, body.syscreatedatutc, body.syschangedatutc], (err, result) => {
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
            res.status(200).send("Deleted")
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/attendance/:id', (req, res) => {
    const body = req.body
    pool.query(`UPDATE attendance SET date=$1,childid=$2,arrivaltime=$3,leavingtime=$4,excuseid=$5,employeeid=$6 WHERE attendanceid=$7 RETURNING *`,
        [body.date, body.childid, body.arrivaltime, body.leavingtime, body.excuseid, body.employeeid, req.params.id], (err, result) => {
            if (!err) {
                res.status(200).send("Updated")
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
    pool.query("insert into excuse ( datestart,dateend,childid,daypart,reason,employeeid,syscreatedatutc, syschangedatutc ) values ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
        [body.datestart, body.dateend, body.childid, body.daypart, body.reason, body.employeeid, body.syscreatedatutc, body.syschangedatutc], (err, result) => {
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
            res.status(200).send("Deleted")
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/excuse/:id', (req, res) => {
    const body = req.body
    pool.query(`UPDATE excuse SET datestart=$1,dateend=$2,childid=$3,daypart=$4,reason=$5,employeeid=$6 WHERE excuseid=$7 RETURNING *`,
        [body.datestart, body.dateend, body.childid, body.daypart, body.reason, body.employeeid, req.params.id], (err, result) => {
            if (!err) {
                res.status(200).send("Updated")
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
    pool.query("insert into skill_group ( subjectname,subjectgroupid,duration,syscreatedatutc, syschangedatutc ) values ($1,$2,$3,$4,$5) RETURNING *",
        [body.subjectname, body.subjectgroupid, body.duration, body.syscreatedatutc, body.syschangedatutc], (err, result) => {
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
            res.status(200).send("Deleted")
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/skill_group/:id', (req, res) => {
    const body = req.body
    pool.query(`UPDATE skill_group SET subjectname=$1,subjectgroupid=$2,duration=$3 WHERE skill_groupid=$4 RETURNING *`,
        [body.subjectname, body.subjectgroupid, body.duration, req.params.id], (err, result) => {
            if (!err) {
                res.status(200).send("Updated")
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
    pool.query("insert into skill ( skillname,skillgroupid,syscreatedatutc, syschangedatutc ) values ($1,$2,$3,$4) RETURNING *",
        [body.skillname, body.skillgroupid,body.syscreatedatutc, body.syschangedatutc], (err, result) => {
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
            res.status(200).send("Deleted")
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/skill/:id', (req, res) => {
    const body = req.body
    pool.query(`UPDATE skill SET skillname=$1,skillgroupid=$2 WHERE skillid=$3 RETURNING *`,
        [body.skillname, body.skillgroupid,  req.params.id], (err, result) => {
            if (!err) {
                res.status(200).send("Updated")
            } else {
                res.status(400).send(err)
            }
        })
})


//question
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
    pool.query("insert into question ( question,answer,skillid, syscreatedatutc, syschangedatutc ) values ($1,$2,$3,$4) RETURNING *",
        [body.question, body.answer,body.skillid,  body.syscreatedatutc, body.syschangedatutc], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/question/:id', (req, res) => {
    pool.query("DELETE FROM question WHERE questionid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send("Deleted")
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/question/:id', (req, res) => {
    const body = req.body
    pool.query(`UPDATE question SET question=$1,answer=$2,skillid=$3 WHERE questionid=$4 RETURNING *`,
        [body.question, body.answer, body.skillid, req.params.id], (err, result) => {
            if (!err) {
                res.status(200).send("Updated")
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
    pool.query("insert into test ( testtitle,childid,questionid,date,score, syscreatedatutc, syschangedatutc ) values ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
        [body.testtitle, body.childid, body.questionid, body.date, body.score, body.syscreatedatutc, body.syschangedatutc], (err, result) => {
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
            res.status(200).send("Deleted")
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/test/:id', (req, res) => {
    const body = req.body
    pool.query(`UPDATE test SET testtitle=$1,childid=$2,questionid=$3,date=$4,score=$5 WHERE testid=$6 RETURNING *`,
        [body.testtitle, body.childid, body.questionid, body.date, body.score, req.params.id], (err, result) => {
            if (!err) {
                res.status(200).send("Updated")
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
    pool.query("insert into timetable ( weekday,groupid,subjectid,start,end,employeeid,roomid, syscreatedatutc, syschangedatutc ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
        [body.weekday, body.groupid, body.subjectid, body.start, body.end, body.employeeid, body.roomid, body.syscreatedatutc, body.syschangedatutc], (err, result) => {
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
            res.status(200).send("Deleted")
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/timetable/:id', (req, res) => {
    const body = req.body
    pool.query(`UPDATE timetable SET weekday=$1,groupid=$2,subjectid=$3,start=$4,end=$5,employeeid=$6,roomid=$7 WHERE timetableid=$8 RETURNING *`,
        [body.weekday, body.groupid, body.subjectid, body.start, body.end, body.employeeid, body.roomid, req.params.id], (err, result) => {
            if (!err) {
                res.status(200).send("Updated")
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
    pool.query("insert into syllabus ( year,month,weeknumber,topic,subjectid,quantity,syscreatedatutc, syschangedatutc ) values ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
        [body.year, body.month, body.weeknumber, body.topic, body.subjectid, body.quantity, body.syscreatedatutc, body.syschangedatutc], (err, result) => {
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
            res.status(200).send("Deleted")
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/syllabus/:id', (req, res) => {
    const body = req.body
    pool.query(`UPDATE syllabus SET year=$1,month=$2,weeknumber=$3,topic=$4,subjectid=$5,quantity=$6 WHERE timetableid=$7 RETURNING *`,
        [body.year, body.month, body.weeknumber, body.topic, body.subjectid, body.quantity, req.params.id], (err, result) => {
            if (!err) {
                res.status(200).send("Updated")
            } else {
                res.status(400).send(err)
            }
        })
})



app.listen(PORT, function () {
    console.log(`Listening to Port ${PORT}`);
});
