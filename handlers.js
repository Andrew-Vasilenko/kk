/*
*	router's function-handlers
*/

// dependencies
const url = require('url');

// "database"
Accounts = {}

// classes
const CurrentAccount = require('./classes.js')

// container
var handlers = {}

handlers.index = function(req,res){
	res.write("write some intructions here...")
	res.end()
}

// Required values: ID
handlers.getAccount = function(req,res){
	// res.send("account' READ functions ('get all' option is also acceptable)")
	queryObject = url.parse(req.url,true).query
	if (queryObject.ID !== undefined){
		let ID = queryObject.ID
		if (Accounts.hasOwnProperty(ID)){
			res.status(200).send(Accounts[ID])
		} else {
			res.status(404).send("Error! There is no account with ID = "+ID.toString())
		}
	} else {
		res.status(400).send("Error! Check your querystring.")
	}
	
}

// Required values: ID, clientID, type, currency
handlers.createAccount = function(req,res){
	let ID = req.body.ID
	if (Accounts.hasOwnProperty(ID)){
		res.status(403).send("Error! Account with such ID ("+ID.toString()+") already exists.")
	} else {
		let clientID = req.body.clientID
		let type = req.body.type
		let currency = req.body.currency
		
		if (ID && clientID && type && currency !== undefined){
			// switch (type)
			// current => new Account(clientID, ID, currency)
			let newAccount = new CurrentAccount(clientID, ID, currency)
			Accounts[newAccount.ID] = newAccount

			console.log("New account (ID:"+ ID +") was successfully created!")
			res.status(201).send("New account (ID:"+ ID +") was successfully created!")
		} else {
			console.log("Error! Account was not created. Check the required values.")
			res.status(400).send("Error! Account was not created. Check the required values.")
		}
	}
	
}

// Required values: ID, action
// Optional values: amount
handlers.editAccount = function(req,res){
	// res.send("account's EDIT function")
	let ID = req.body.ID
	let action = req.body.action
	if (ID !== undefined){
		if (Accounts.hasOwnProperty(ID)){
			let account = Accounts[ID]
			let operationResponse
			let amount
			switch (action){
				case "reserve":
					operationResponse = account.reserve()
					if(operationResponse.status == true){
						res.status(200).send(operationResponse.msg)
					} else {
						res.status(403).send(operationResponse.msg)
					}
					break

				case "open":
					operationResponse = account.open()
					if(operationResponse.status == true){
						res.status(200).send(operationResponse.msg)
					} else {
						res.status(403).send(operationResponse.msg)
					}
					break

				case "topUp":
					amount = req.body.amount
					if (amount > 0) {
						operationResponse = account.topUp(amount)
						if(operationResponse.status == true){
							res.status(200).send(operationResponse.msg)
						} else {
							res.status(403).send(operationResponse.msg)
						}
					} else {
						res.status(400).send("Error! Wrong amount value.")
					}				
					break

				case "withdraw":
					amount = req.body.amount
					if (amount > 0) {
						operationResponse = account.withdraw(amount)
						if(operationResponse.status == true){
							res.status(200).send(operationResponse.msg)
						} else {
							res.status(403).send(operationResponse.msg)
						}
					} else {
						res.status(400).send("Error! Wrong amount value.")
					}				
					break

				case "close":
					operationResponse = account.close()
					if(operationResponse.status == true){
						res.status(200).send(operationResponse.msg)
					} else {
						res.status(403).send(operationResponse.msg)
					}
					break

				default:
					console.log("Error! There is no "+ action +" action. Check the 'action' value.")
					res.status(400).send("Error! There is no "+ action +" action. Check the 'action' value.")
			}

		} else {
			res.status(404).send("Error! There is no account with ID = "+ID.toString())
		}
	} else {
		res.status(400).send("Error! Undefined ID value.")
	}
	
	
}

// Required values: ID,
handlers.deleteAccount = function(req,res){
	let ID = req.body.ID
	if (ID !== undefined){
		if (Accounts.hasOwnProperty(ID)){
			let account = Accounts[ID]
			if (account.closed == true){
				delete Accounts[ID]
				res.status(200).send("Success! Account (ID:"+ID.toString()+") had been deleted.")
			} else {
				res.status(403).send("Error! Account (ID:"+ID.toString()+") must be closed in order to be deleted.")
			}
		} else {
			res.status(404).send("Error! There is no account with ID = "+ID.toString())
		}
	} else {
		res.status(400).send("Error! Undefined ID value.")
	}
	
}

// module export
module.exports = handlers