/*
*	bank accounts' classes
*/

class CurrentAccount {
	constructor(clientID, ID, currency) {
		this.clientID = clientID
		this.ID = ID
		this.currency = currency
		this.balance = 0

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

module.exports = CurrentAccount