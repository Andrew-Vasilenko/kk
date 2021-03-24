/*
*	router's function-handlers
*/

// dependencies
const fs = require('fs')

// "database"
Accounts = {}

// classes
class Account {
	constructor(clientID, ID, currency, balance) {
		this.clientID = clientID
		this.ID = ID
		this.currency = currency
		this.balance = balance

		this.reserved = false
		this.opened = false
		this.closed = false
	}
	// резервирование
	reserve(){
		if(this.reserved == false){
			this.reserved = true
			console.log("Success! The bank account (ID:"+ ID +") was successfully reserved")
		}
		else {
			console.log('Error! The bank account (ID:'+ ID +') already passed the process of reservation')
		}
	}
	// открытие
	open(){
		if(this.opened == false){
			this.opened = true
			console.log("Success! The bank account (ID:"+ ID +") was successfully opened")
		}
		else {
			console.log('Error! The bank account (ID:'+ ID +') already opened')
		}
	}
	// пополнение
	topUp(){

	}
	// списание
	withdraw(){

	}
	// закрытие
	close(){
		if(this.closed == false){
			this.closed = true
			console.log("Success! The bank account (ID:"+ ID +") was successfully closed")
		}
		else {
			console.log('Error! The bank account (ID:'+ ID +') already closed')
		}
	}
	// age(x) {
	// 	return x - this.year;
	// }
}

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
	// res.send("account's CREATE function")
	let clientID = req.body.clientID
	let ID = req.body.ID
	let type = req.body.type
	let currency = req.body.currency
	let balance = req.body.balance
	
	if (clientID && ID && currency && balance && type !== undefined){
		// switch (type)
		// current => new Account(clientID, ID, currency, balance)
		let newAccount = new Account(clientID, ID, currency, balance)
		Accounts[newAccount.ID] = newAccount
		console.log(Accounts)
		res.send(newAccount)
	} else {
		res.send("Error! Account was not created. Check the required values.")
	}
}
handlers.editAccount = function(req,res){
	res.send("account's EDIT function")
}
handlers.closeAccount = function(req,res){
	res.send("account's DELETE function")
}

// module export
module.exports = handlers