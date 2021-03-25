/*
*	router's function-handlers
*/

// dependencies
const url = require('url');

// "database"
Accounts = {}

// Классы
// Текущий счет
class CurrentAccount {
	constructor(clientID, ID, currency) {
		this.clientID = clientID
		this.ID = ID
		this.currency = currency

		this.balance = 0
		this.type = "Current"

		this.reserved = false
		this.opened = false
		this.closed = false
	}
	// резервирование
	reserve(){
		if(this.reserved == false){
			this.reserved = true
			return {
				status: true,
				msg: "Success! The bank account (ID:"+ this.ID +") was successfully reserved"
			}
		} else {
			return {
				status: false,
				msg: 'Error! The bank account (ID:'+ this.ID +') already passed the process of reservation'
			}
		}
	}
	// открытие
	open(){
		if(this.opened == false){
			if (this.reserved == true){
				this.opened = true
				console.log("Success! The bank account (ID:"+ this.ID +") was successfully opened.")
				return {
					status: true,
					msg: "Success! The bank account (ID:"+ this.ID +") was successfully opened."
				}
			} else {
				console.log("Error! The bank account (ID:"+ this.ID +") must be reserved before.")
				return {
					status: false,
					msg: "Error! The bank account (ID:"+ this.ID +") must be reserved before."
				}
			}
		} else {
			console.log("Error! The bank account (ID:"+ this.ID +") was already opened.")
			return {
				status: false,
				msg: "Error! The bank account (ID:"+ this.ID +") was already opened."
			}
		}
	}
	// пополнение
	topUp(amount){
		if (this.closed == false){
			if (this.opened == true){
				this.balance += parseInt(amount,10)
				console.log("Success! The bank account (ID:"+ this.ID +") was topped up. Current balance: " + this.balance.toString() + " " + this.currency.toString())
				return {
					status: true,
					msg: "Success! The bank account (ID:"+ this.ID +") was topped up. Current balance: " + this.balance.toString() + " " + this.currency.toString()
				}
			} else {
				console.log("Error! The bank account (ID:"+ this.ID +") must be opened before.")
				return {
					status: false,
					msg: "Error! The bank account (ID:"+ this.ID +") must be opened before."
				}
			}
		} else {
			return {
				status: false,
				msg: "Error! The bank account (ID:"+ this.ID +") closed."
			}
		}
		
	}
	// списание
	withdraw(amount){
		if (this.closed == false){
			if (this.opened == true){
				this.balance -= parseInt(amount,10)
				console.log("Success! The money has been withdrawn from the bank account (ID:"+ this.ID +"). Current balance: " + this.balance.toString() + " " + this.currency.toString())
				return {
					status: true,
					msg: "Success! The money has been withdrawn from the bank account (ID:"+ this.ID +"). Current balance: " + this.balance.toString() + " " + this.currency.toString()
				}
			} else {
				console.log("Error! The bank account (ID:"+ this.ID +") must be opened before.")
				return {
					status: false,
					msg: "Error! The bank account (ID:"+ this.ID +") must be opened before."
				}
			}
		} else {
			return {
				status: false,
				msg: "Error! The bank account (ID:"+ this.ID +") closed."
			}
		}
		
	}
	// закрытие
	close(){
		if (this.closed == false){
			if (this.opened == true){
				this.closed = true
				console.log("Success! The bank account (ID:"+ this.ID +") was successfully closed.")
				return {
					status: true,
					msg: "Success! The bank account (ID:"+ this.ID +") was successfully closed."
				}
			} else {
				console.log("Error! The bank account (ID:"+ this.ID +") must be opened before.")
				return {
					status: false,
					msg: "Error! The bank account (ID:"+ this.ID +") must be opened before."
				}
			}
		} else {
			console.log('Error! The bank account (ID:'+ this.ID +') already closed.')
			return {
				status: false,
				msg: 'Error! The bank account (ID:'+ this.ID +') already closed.'
			}
		}
	}

}

// Депозит до востребования
class DemandDeposit extends CurrentAccount {
	constructor(clientID, ID, currency, interestRate) {
		super(clientID)
		this.ID = ID
		this.currency = currency

		this.interestRate = interestRate
		this.type = "DemandDeposit"
	}
	// начисление процентов
	interestCharge(){
		if (this.closed == false){
			if (this.opened == true){
				return {
					status: true,
					msg: "Success! The interest was charged."
				}
			} else {
				return {
					status: false,
					msg: "Error! The bank account (ID:"+ this.ID +") must be opened before."
				}
			}
		} else {
			return {
				status: false,
				msg: "Error! The bank account (ID:"+ this.ID +") closed."
			}
		}
	}

	// уплата процентов
	interestPay(){
		if (this.closed == false){
			if (this.opened == true){
				return {
					status: true,
					msg: "Success! The interest was paid."
				}
			} else {
				return {
					status: false,
					msg: "Error! The bank account (ID:"+ this.ID +") must be opened before."
				}
			}
		} else {
			return {
				status: false,
				msg: "Error! The bank account (ID:"+ this.ID +") closed."
			}
		}
	}
}

// Срочный депозит
class FixedTermDeposit extends DemandDeposit {
	constructor(clientID, ID, currency, interestRate, closureDate) {
		super(clientID)
		this.ID = ID
		this.currency = currency

		this.interestRate = interestRate
		this.type = "FixedTermDeposit"

		this.closureDate = closureDate
	}
	// hide() {
	// 	alert(`${this.name} прячется!`);
	// }
}

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
		let interestRate
		let newAccount
		if (ID && clientID && type && currency !== undefined){

			switch (type){
				case "Current":
					newAccount = new CurrentAccount(clientID, ID, currency)

					Accounts[newAccount.ID] = newAccount
					console.log("New account (ID:"+ ID +") was successfully created!")
					res.status(201).send("New account (ID:"+ ID +") was successfully created!")
					break
				case "DemandDeposit":
					interestRate = req.body.interestRate
					if (interestRate !== undefined && interestRate > 0){

						newAccount = new DemandDeposit(clientID, ID, currency, interestRate)

						Accounts[newAccount.ID] = newAccount
						console.log("New account (ID:"+ ID +") was successfully created!")
						res.status(201).send("New account (ID:"+ ID +") was successfully created!")
						break
					} else {
						res.status(400).send("Error! 'interestRate' value must be a positive number.")
					}
					
				case "FixedTermDeposit":
					interestRate = req.body.interestRate
					let closureDate = req.body.closureDate
					if (interestRate !== undefined && interestRate > 0 && closureDate !== undefined){

						newAccount = new FixedTermDeposit(clientID, ID, currency, interestRate, closureDate)

						Accounts[newAccount.ID] = newAccount
						console.log("New account (ID:"+ ID +") was successfully created!")
						res.status(201).send("New account (ID:"+ ID +") was successfully created!")
						break
					} else {
						res.status(400).send("Error! 'interestRate' value must be a positive number and closureDate must not be empty.")
					}
					
				default: 
					res.status(400).send("Error! Wrong account type. Correct values are: \n 'Current', 'DemandDeposit', 'FixedTermDeposit'")
			}
			// switch (type)
			// current => new Account(clientID, ID, currency)

			
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

				case "interestCharge":
					operationResponse = account.interestCharge()
					if(operationResponse.status == true){
						res.status(200).send(operationResponse.msg)
					} else {
						res.status(403).send(operationResponse.msg)
					}
					break

				case "interestPay":
					operationResponse = account.interestPay()
					if(operationResponse.status == true){
						res.status(200).send(operationResponse.msg)
					} else {
						res.status(403).send(operationResponse.msg)
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