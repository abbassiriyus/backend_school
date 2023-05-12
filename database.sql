CREATE TABLE "address" (
"addressid" SERIAL PRIMARY KEY,
"region" VARCHAR(50) NOT NULL,
"city" VARCHAR(50) NOT NULL,
"street" VARCHAR(50) NOT NULL,
"house" VARCHAR(12) NOT NULL,
"building" VARCHAR(12) NULL,
"flat" SMALLINT NULL,
"syscreatedatutc" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
"syschangedatutc" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE TABLE person (
personid SERIAL PRIMARY KEY,
personlastname VARCHAR(50) NOT NULL,
personfirstname VARCHAR(50) NOT NULL,
personmiddlename VARCHAR(50) NOT NULL,
dateofbirth DATE NOT NULL,
gender CHAR(1) NOT NULL,
passportseries CHAR(4) NOT NULL,
passportnumber CHAR(6) NOT NULL,
passportdate DATE NOT NULL,
phone VARCHAR(30) NOT NULL,
email VARCHAR(255) NOT NULL,
addressid INTEGER NOT NULL,
syscreatedatutc TIMESTAMP(3) DEFAULT NOW() NOT NULL,
syschangedatutc TIMESTAMP(3) DEFAULT NOW() NOT NULL,
FOREIGN KEY (addressid) REFERENCES address (addressid)
);


create table legal_rep (
legalrepid serial primary key,
personid integer not null,
company varchar (100),
syscreatedatutc timestamp default current_timestamp not null,
syschangedatutc timestamp default current_timestamp not null
);

CREATE TABLE "position" (
"positionid" SERIAL PRIMARY KEY,
"positiontitle" VARCHAR (100) NOT NULL,
"syscreatedatutc" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
"syschangedatutc" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "labor" (
"laborid" SERIAL PRIMARY KEY,
"laborname" VARCHAR (100) NOT NULL,
"syscreatedatutc" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
"syschangedatutc" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE employee(
"employeeid" SERIAL NOT NULL PRIMARY KEY,
"personid" INTEGER NOT NULL,
"positionid" INTEGER NOT NULL,
"laborid" INTEGER NOT NULL,
"hiredate" DATE NOT NULL,
"dismissaldate" DATE,
"medical_cert" DATE NOT NULL,
"education" VARCHAR (50) NOT NULL,
"photo" BYTEA,
syscreatedatutc TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
syschangedatutc TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_person FOREIGN KEY (personid) REFERENCES person(personid),
CONSTRAINT fk_position FOREIGN KEY (positionid) REFERENCES position(positionid),
CONSTRAINT fk_labor FOREIGN KEY (laborid) REFERENCES labor(laborid)
);

CREATE TABLE "room" ( "roomid" serial NOT NULL, "roomnumber" smallint NOT NULL, "floor" smallint NOT NULL, "square" numeric(5,2) NOT NULL, "syscreatedatutc" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "syschangedatutc" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "pk_room" PRIMARY KEY ("roomid") ); CREATE TABLE "age" ( "ageid" serial NOT NULL, "categoryage" varchar(3) NOT NULL, "syscreatedatutc" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "syschangedatutc" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "pk_age" PRIMARY KEY ("ageid") );
CREATE TABLE "group" (
"groupid" serial primary key,
"groupname" varchar(50) not null,
"ageid" integer not null,
"syscreatedatutc" timestamp(3) not null default (now()),
"syschangedatutc" timestamp(3) not null default (now())
);

CREATE TABLE "group_emp" (
"employeeid" integer not null,
"groupid" integer not null,
"syscreatedatutc" timestamp(3) not null default (now()),
"syschangedatutc" timestamp(3) not null default (now()),
primary key ("groupid", "employeeid"),
foreign key ("groupid") references "group" ("groupid"),
foreign key ("employeeid") references "employee" ("employeeid")
);

CREATE TABLE "child"(
"childid" serial primary key,
"childlastname" varchar(50) not null,
"childfirstname" varchar(50) not null,
"childmiddlename" varchar(50) not null,
"dateofbirth" date not null,
"addressid" integer not null,
"gender" varchar(12) not null,
"certificateofbirth" varchar(15) not null,
"groupid" integer not null,
"health" char (1) not null, 
"isregisteredwith" varchar(1000),
"allergy" varchar(1000), 
"deviations" varchar(1000),
"medicines" varchar(1000),
"healthrestrictions" varchar(1000),
"diet" varchar(2000),
"photo" bytea,
"comment" varchar(2000), 
"syscreatedatutc" timestamp default current_timestamp not null,
"syschangedatutc" timestamp default current_timestamp not null,
constraint "fk_chid_address" foreign key ("addressid") references "address" ("addressid"),
constraint "fk_group" foreign key ("groupid") references "group" ("groupid")
);

CREATE SEQUENCE seq_vaccination START WITH 1 INCREMENT BY 1;
CREATE TABLE vaccination (
vaccinationid INT NOT NULL DEFAULT NEXTVAL('seq_vaccination'),
namevac VARCHAR(100) NOT NULL,
syscreatedatutc TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
syschangedatutc TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
PRIMARY KEY (vaccinationid)
);

CREATE SEQUENCE seq_child_vac START WITH 1 INCREMENT BY 1;
CREATE TABLE child_vac (
child_vacid INT NOT NULL DEFAULT NEXTVAL('seq_child_vac'),
childid INT NOT NULL,
vaccinationid INT NOT NULL,
date DATE NOT NULL,
syscreatedatutc TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
syschangedatutc TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
PRIMARY KEY (child_vacid),
FOREIGN KEY (childid) REFERENCES child(childid),
FOREIGN KEY (vaccinationid) REFERENCES vaccination(vaccinationid)
);

create table "relation" (
"relationid" serial primary key,
"legalrepid" integer not null,
"childid" integer not null,
"status" varchar(10) not null,
"syscreatedatutc" timestamp default current_timestamp not null,
"syschangedatutc" timestamp default current_timestamp not null,
foreign key ("childid") references "child" ("childid"),
foreign key ("legalrepid") references "legal_rep" ("legalrepid")
);

create table "contract" (
"contractid" serial primary key,
"number" varchar(10) not null,
"date" date not null,
"legalrepid" integer not null,
"childid" integer not null,
"syscreatedatutc" timestamp default current_timestamp not null,
"syschangedatutc" timestamp default current_timestamp not null,
foreign key ("childid") references "child" ("childid"),
foreign key ("legalrepid") references "legal_rep" ("legalrepid")
);

CREATE TABLE subject_group (
subject_groupid SERIAL PRIMARY KEY,
subjectgroupname VARCHAR(100) NOT NULL,
description VARCHAR(2000) NOT NULL,
syscreatedatutc TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
syschangedatutc TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE subject (
subjectid SERIAL PRIMARY KEY,
subjectname VARCHAR(100) NOT NULL,
subjectgroupid INT NOT NULL,
duration TIME NOT NULL,
syscreatedatutc TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
syschangedatutc TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
CONSTRAINT fk_subjectgroup FOREIGN KEY (subjectgroupid) REFERENCES subject_group (subject_groupid)
);
CREATE TABLE attendance (
attendanceid SERIAL PRIMARY KEY,
date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
childid INTEGER NOT NULL,
arrivaltime TIMESTAMP,
leavingtime TIMESTAMP ,
excuseid INTEGER,
employeeid INTEGER NOT NULL,
syscreatedatutc TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
syschangedatutc TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
CONSTRAINT fk_employee_att FOREIGN KEY (employeeid) REFERENCES employee (employeeid),
CONSTRAINT fk_child_att FOREIGN KEY (childid) REFERENCES child (childid)
);

CREATE TABLE excuse (
excuseid SERIAL PRIMARY KEY,
datestart TIMESTAMP NOT NULL,
dateend TIMESTAMP NOT NULL,
childid INTEGER NOT NULL,
daypart VARCHAR(50) NOT NULL,
reason VARCHAR(50) NOT NULL,
employeeid INTEGER NOT NULL,
syscreatedatutc TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
syschangedatutc TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_employee_exs FOREIGN KEY (employeeid) REFERENCES employee (employeeid),
CONSTRAINT fk_child_exs FOREIGN KEY (childid) REFERENCES child (childid)
);

CREATE TABLE skill_group (
skillgroupid SERIAL PRIMARY KEY,
skillgroupname VARCHAR(100) NOT NULL,
syscreatedatutc TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
syschangedatutc TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE skill (
skillid SERIAL PRIMARY KEY,
skillname VARCHAR(100) NOT NULL,
skillgroupid INT NOT NULL,
syscreatedatutc TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
syschangedatutc TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
CONSTRAINT fk_skillgroup FOREIGN KEY (skillgroupid)
REFERENCES skill_group (skillgroupid)
);
CREATE TABLE "question" (
"questionid" serial NOT NULL,
"question" TEXT NOT NULL,
"question_img" TEXT NOT NULL,
"answer" integer NOT NULL,
"author" text NOT NULL,
"month" TEXT NOT NULL,
"skillid" integer NOT NULL,
"syscreatedatutc" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
"syschangedatutc" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT "pk_question" PRIMARY KEY ("questionid")
);

CREATE TABLE "test" (
"testid" serial NOT NULL,
"testtitle" varchar (50) NOT NULL,
"childid" integer NOT NULL,
"questionid" integer NOT NULL,
"date" date,
"score" smallint NOT NULL DEFAULT 0,
"syscreatedatutc" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
"syschangedatutc" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT "pk_test" PRIMARY KEY ("testid"),
CONSTRAINT "fk_child_journal" FOREIGN KEY ("childid") REFERENCES "child" ("childid"),
CONSTRAINT "fk_question" FOREIGN KEY ("questionid") REFERENCES "question" ("questionid")
);

CREATE TABLE "timetable" (
"timetableid" SERIAL PRIMARY KEY,
"weekday" VARCHAR(11) NOT NULL,
"groupid" INTEGER NOT NULL,
"subjectid" INTEGER NOT NULL,
"begining" TEXT NOT NULL,
"finishing" TEXT  NOT NULL,
"employeeid" INTEGER NOT NULL,
"roomid" INTEGER NOT NULL,
"day" TEXT not null,
"syscreatedatutc" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
"syschangedatutc" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
CONSTRAINT "fk_group_timetable" FOREIGN KEY ("groupid") REFERENCES "group" ("groupid"),
CONSTRAINT "fk_event_timetable" FOREIGN KEY ("subjectid") REFERENCES "subject" ("subjectid"),
CONSTRAINT "fk_room_timetable" FOREIGN KEY ("roomid") REFERENCES "room" ("roomid"),
CONSTRAINT "fk_employee_timetable" FOREIGN KEY ("employeeid") REFERENCES "employee" ("employeeid")
);

CREATE TABLE syllabus (
syllabusid SERIAL PRIMARY KEY,
year INT NOT NULL,
month VARCHAR(8) NOT NULL,
weeknumber INT NOT NULL,
topic VARCHAR(100) NOT NULL,
subjectid INT NOT NULL,
quantity INT NOT NULL,
syscreatedatutc TIMESTAMP DEFAULT NOW() NOT NULL,
syschangedatutc TIMESTAMP DEFAULT NOW() NOT NULL,
FOREIGN KEY (subjectid) REFERENCES subject(subjectid)
);

create table syllabu (
    "syllabuid" SERIAL PRIMARY KEY,
    "subjectid" integer NOT NULL,
    "winterparty" integer  not null,
     "winterles" integer  not null,
    "mountain" integer  not null,
    "animal" integer  not null,
    FOREIGN KEY (subjectid) REFERENCES subject(subjectid)
)

ALTER TABLE legal_rep ADD CONSTRAINT fk_lr_person FOREIGN KEY (personid) REFERENCES person(personid);

ALTER TABLE person ADD CONSTRAINT uq_passport UNIQUE (passportseries, passportnumber, passportdate);
ALTER TABLE attendance ALTER COLUMN date SET DEFAULT CURRENT_DATE;
ALTER TABLE attendance ADD CONSTRAINT fk_excuse FOREIGN KEY (excuseid) REFERENCES excuse(excuseid);

