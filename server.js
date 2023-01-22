const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const mysql = require('mysql');

const app = express()
app.use(express.json());


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "covid",
    port: "3306"
}) 
 connection.connect((err) => {
    if (err){
        console.log("Error connect to My database")
        return;
    }
    console.log("MySQl successfully")
 })
// create user
 app.post("/create", async (req,res) => {
    const { fullname ,address, email } = req.body;
    
    try{
        connection.query(
            "INSERT INTO covid_schema( fullname ,address, email) VALUES(?,?,?)",
            [  fullname ,address, email ],
            (err,results,fields) => {
                if (err){
                    console.log("Error cannot insert covid to database", err);
                    return res.status(400).send();
                }
                return res.status(201).json({ message : "Created successfully"})
            }
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send()
    }
 })
// get all
 app.get("/read", async (req,res) => {
    try {
            connection.query("SELECT * FROM covid_schema", (err,results,fields) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                res.status(200).json(results)
            })
    }   catch(err){
        console.log(err);
        return res.status(500).send();

    }
 })

//get by id
app.get("/read/:id", async (req,res) => {
    const id = req.params.id;
    

    try {
            connection.query("SELECT * FROM covid_schema WHERE id = ?", [id],(err,results,fields) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                res.status(200).json(results)
            })
    }   catch(err){
        console.log(err);
        return res.status(500).send();

    }
 })


// update
 app.put("/update/:id", async (req,res) => {
    const id = req.params.id;
    const newFullname = req.body.newFullname;
    const newAddress = req.body.newAddress;
    const newEmail = req.body.newEmail;

    try {
            connection.query("UPDATE covid_schema SET fullname= ?,address= ?,email = ? WHERE id = ?", [newFullname,newAddress,newEmail,id],(err,results,fields) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                res.status(200).json({ message: "update successfully"})
            })
    }   catch(err){
        console.log(err);
        return res.status(500).send();

    }
 })

 //delete by id
app.delete("/delete/:id", async (req,res) => {
    const id = req.params.id;
    

    try {
            connection.query("DELETE FROM covid_schema WHERE id = ?", [id],(err,results,fields) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ message: "cannot delete this user"})
                }
                return res.status(200).json({ message : "delete successfully"})
            })
    }   catch(err){
        console.log(err);
        return res.status(500).send();

    }
 })



 app.listen(3000, () => console.log('Server is running on port 3000'))