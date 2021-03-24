/*
*	router's function-handlers
*/

// dependencies
const accounts = require('./db/Accounts.js')
const clients = require('./db/Clients.js')
const fs = require('fs')

// container
var handlers = {}

handlers.index = function(req,res){
	res.write("write some intructions here...")
	res.end()
}


handlers.getAccount = function(req,res){
	res.send("account' READ functions ('get all' option is also acceptable)")
}
handlers.createAccount = function(req,res){
	res.send("account's CREATE function")
}
handlers.editAccount = function(req,res){
	res.send("account's EDIT function")
}
handlers.deleteAccount = function(req,res){
	res.send("account's DELETE function")
}


handlers.getClient = function(req,res){
	res.send("client's READ functions ('get all' option is also acceptable)")
}
handlers.createClient = function(req,res){
	res.send("client's CREATE function")
}
handlers.editClient = function(req,res){
	res.send("client's EDIT function")
}
handlers.deleteClient = function(req,res){
	res.send("client's DELETE function")
}

// module export
module.exports = handlers