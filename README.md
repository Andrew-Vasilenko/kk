# kc test task

Запуск:

npm install express
npm install node-schedule
node index

Просмотр информации обо всех имеющихся счетах:

GET => "/"


Просмотр информации о конкретном счете по его ID:

GET => /accounts?ID=ID


Пример создания счета - текущий счет:

POST => "/accounts"

POST body = {
	clientID: "clientID",	// id клиента
	ID: "ID",				// id счета
	currency: "currency",	// валюта счета
	type: "Current"			// тип счета
}

Пример создания счета - депозит до востребования:

POST body = {
	clientID: "clientID",	
	ID: "ID",				
	currency: "currency",	
	type: "DemandDeposit",	
	interestRate: 12		// процентная ставка
}


Пример создания счета - срочный депозит:

POST body = {
	clientID: "clientID",
	ID: "ID",
	currency: "currency",
	type: "DemandDeposit",
	interestRate: 100500,
	duration: 43800			// время жизни счета в минутах(!) 
}


Примеры:
"резервирования" счета:

PUT => "/accounts"

PUT body = {
	ID: "ID",
	action: "reserve"		// действие над счетом
}


"открытия" счета:

PUT body = {
	ID: "ID",
	action: "open"
}


"пополнения" счета:

PUT body = {
	ID: "ID",
	action: "topUp",
	amount: 100500			// сумма пополнения/списания
}


"списания" со счета:

PUT body = {
	ID: "ID",
	action: "withdraw",
	amount: 100500
}


"начисления" процентов на счет:

PUT body = {
	ID: "ID",
	action: "interestCharge"
}


"уплаты" процентов на счет:

PUT body = {
	ID: "ID",
	action: "interestPay"
}


"закрытия" счета:

PUT body = {
	ID: "ID",
	action: "close"
}
Примечания:
При закрытии счета, счет не удаляется.
Написаны проверки - закрыть можно только тот счет который уже открыт (а до этого резервирован)
и имеет неотрицательный баланс.
При закрытии депозитов (срочных и до востребования) - деньги зачисляются на текущие счета того же клиента.
Если текущих счетов у клиента нету, то такие создаются.
Срочные депозиты будут закрыты автоматически по истечении срока.
(Отсчет срока будет производиться с момента их открытия, а не создания)

Пример удаления счета (после закрытия он не удаляется а только блокируются операции над ним):

DELETE => "/accounts"

DELETE body = {
	ID: ID
}

Мега костыль (!):
Все счета хранятся в json'e и соответственно существуют пока сервер не будет перезапущен 