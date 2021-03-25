/*
*	Primary file
*/

// dependencies
const express = require('express')	
const app = express()
const http = require('http')
const handlers = require('./handlers.js')
const bodyParser = require('body-parser')
// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => {
	handlers.index(req,res)
})


app.get("/accounts", (req, res) => {
	handlers.getAccount(req,res)
})
app.post("/accounts", (req, res) => {
	handlers.createAccount(req,res)
})
app.put("/accounts", (req, res) => {
	handlers.editAccount(req,res)
})
app.delete("/accounts", (req, res) => {
	handlers.deleteAccount(req,res)
})

// server
var server = app.listen(3000, () => console.log("Server is listening on port 3000"))