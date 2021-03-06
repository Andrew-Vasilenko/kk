/*
*	router's function-handlers
*/

// dependencies
const url = require('url');
const schedule = require('node-schedule');

// "database"
Accounts = {}

// autoclosing function
autoclose = function(accountID, closureDate){
	job = schedule.scheduleJob(closureDate, function(){
		// только если аккаунт не был закрыт или вовсе удален...
		if(Accounts[accountID] !== undefined && Accounts[accountID].closed == false){
			Accounts[accountID].close()
			console.log("WARNING! The bank account (ID:"+ accountID +") was automatically closed.")
		}		
	});
}


// Классы:
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
				return {
					status: true,
					msg: "Success! The bank account (ID:"+ this.ID +") was successfully opened."
				}
			} else {
				return {
					status: false,
					msg: "Error! The bank account (ID:"+ this.ID +") must be reserved before."
				}
			}
		} else {
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
				return {
					status: true,
					msg: "Success! The bank account (ID:"+ this.ID +") was topped up. Current balance: " + this.balance.toString() + " " + this.currency.toString()
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
	// списание
	withdraw(amount){
		if (this.closed == false){
			if (this.opened == true){
				this.balance -= parseInt(amount,10)
				return {
					status: true,
					msg: "Success! The money has been withdrawn from the bank account (ID:"+ this.ID +"). Current balance: " + this.balance.toString() + " " + this.currency.toString()
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
	// закрытие
	close(){
		if (this.closed == false){
			if (this.opened == true){
				if (this.balance > 0){
					this.balance = 0
					this.opened = false
					this.closed = true
					return {
						status: true,
						msg: "Success! The bank account (ID:"+ this.ID +") was successfully closed."
					}
				} else {
					if (this.balance == 0){
						return {
							status: true,
							msg: "Success! The bank account (ID:"+ this.ID +") had been closed. The money had been transferred to another account (ID:"+ outcomeAccount.ID +")"
						}
					} else {
						return {
							status: false,
							msg: "Error! The bank account (ID:"+ this.ID +") cannot be closed while having negative balance."
						}
					}
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
	// переопределение close()...
	// если мы закрываем депозит до востребования - то деньги с него переводятся на текущий счет того же клиента,
	// а если у него такого счета нету - такой создается (+ резервируется и открывается автоматически)
	close(){
		if (this.closed == false){
			if (this.opened == true){
				if (this.balance > 0){
					let outcomeAccount
					for (var key in Accounts){
						let account = Accounts[key]
						if(account.clientID == this.clientID && account.type == "Current" && account.opened == true){
							outcomeAccount = Accounts[key]
						}
					}
					if(outcomeAccount !== undefined){
						if (outcomeAccount.topUp(this.balance)){
							this.balance = 0
							this.opened = false
							this.closed = true
							return {
								status: true,
								msg: "Success! The bank account (ID:"+ this.ID +") had been closed. The money had been transferred to another account (ID:"+ outcomeAccount.ID +")"
							}
						} else {
							return {
								status: false,
								msg: "Error! Fatal error during transfering the money to another account."
							}
						}					
					} else {
						let ID = this.ID + "generated"
						outcomeAccount = new CurrentAccount(this.clientID, ID, this.currency)
						outcomeAccount.reserve()
						outcomeAccount.open()
						outcomeAccount.topUp(this.balance)
						Accounts[outcomeAccount.ID] = outcomeAccount
						this.balance = 0
						this.opened = false
						this.closed = true
						return {
							status: true,
							msg: "Success! The bank account (ID:"+ this.ID +") had been closed. The money had been transferred to another account (ID:"+ outcomeAccount.ID +")"
						}
					}
				} else {
					if (this.balance == 0){
						return {
							status: true,
							msg: "Success! The bank account (ID:"+ this.ID +") had been closed. The money had been transferred to another account (ID:"+ outcomeAccount.ID +")"
						}
					} else {
						return {
							status: false,
							msg: "Error! The bank account (ID:"+ this.ID +") cannot be closed while having negative balance."
						}
					}
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
				msg: 'Error! The bank account (ID:'+ this.ID +') already closed.'
			}
		}
	}
}

// Срочный депозит
class FixedTermDeposit extends DemandDeposit {
	constructor(clientID, ID, currency, interestRate, duration) {
		super(clientID)
		this.ID = ID
		this.currency = currency

		this.interestRate = interestRate
		this.type = "FixedTermDeposit"

		this.duration = duration
	}
	// переопределение open()...
	// ...как только срочный депозит открыт (opened == true) - 
	// начинается запускается функция его автозакрытия, впрочем закрыть его можно и вручную, если сделать это до истечения срока
	open(){
		if(this.opened == false){
			if (this.reserved == true){
				this.opened = true

				// current timestamp in milliseconds...
				let ts = Date.now()
				// ...plus duration in minutes
				ts += 1000 * 60 * this.duration
				let closureDate = new Date(ts)
				autoclose(this.ID, closureDate)

				return {
					status: true,
					msg: "Success! The bank account (ID:"+ this.ID +") was successfully opened."
				}
			} else {
				return {
					status: false,
					msg: "Error! The bank account (ID:"+ this.ID +") must be reserved before."
				}
			}
		} else {
			return {
				status: false,
				msg: "Error! The bank account (ID:"+ this.ID +") was already opened."
			}
		}
	}
}

// container
var handlers = {}

handlers.index = function(req,res){
	res.status(200).send(Accounts)
}

// Required values: ID
handlers.getAccount = function(req,res){
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
		if (ID && ID.includes("generated") == false && clientID && type && currency){

			switch (type){
				case "Current":
					newAccount = new CurrentAccount(clientID, ID, currency)

					Accounts[newAccount.ID] = newAccount

					res.status(201).send("New account (ID:"+ ID +") was successfully created!")
					break
				case "DemandDeposit":
					interestRate = req.body.interestRate
					if (interestRate > 0){

						newAccount = new DemandDeposit(clientID, ID, currency, interestRate)

						Accounts[newAccount.ID] = newAccount

						res.status(201).send("New account (ID:"+ ID +") was successfully created!")
						break
					} else {
						res.status(400).send("Error! 'interestRate' value must be a positive number.")
					}
					
				case "FixedTermDeposit":
					interestRate = req.body.interestRate
					let duration = req.body.duration
					if (interestRate > 0 && duration !== undefined){

						newAccount = new FixedTermDeposit(clientID, ID, currency, interestRate, duration)

						Accounts[newAccount.ID] = newAccount

						res.status(201).send("New account (ID:"+ ID +") was successfully created!")
						
					} else {
						res.status(400).send("Error! 'interestRate' and 'duration' values must be a positive numbers.")
					}
					break
					
				default: 
					res.status(400).send("Error! Wrong account type. Correct values are: \n 'Current', 'DemandDeposit', 'FixedTermDeposit'")
			}
			
		} else {
			res.status(400).send("Error! Account was not created. Check the required values and keep in mind that 'ID' value cannot contain 'generated' substring.")
		}
	}
	
}

// Required values: ID, action
// Optional values: amount
handlers.editAccount = function(req,res){
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