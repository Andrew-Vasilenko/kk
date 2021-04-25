# kc test task
# Задача:
Есть объекты:

«Текущий счет»
«Срочный депозит»
«Депозит до востребования»
У них есть жизненный цикл из следующих этапов (в порядке возможности наступления):
«Резервирование»
«Открытие»
«Пополнение»
«Расход»
«Начисление процентов»
«Уплата процентов»
«Закрытие»
При этом: черные могут в пределах ЖЦ выполняться только единожды и они обязательны,
красные – более одного раза, и последовательность между самими красными не важна и они не
обязательны.

Особенности:

Текущий счет не имеет процентной ставки, начисление и уплата % не выполняется, он не
имеет срока действия (закрывается по факту требования клиентом)
Депозит до востребования – аналогично текущему счету не имеет срока
действия(закрывается по факту требования клиентом), но при этом имеет процентную ставку и в
обязательном порядке выполняется начисление и уплата %
Срочный депозит – имеет строго ограниченный срок действия (при наступлении даты
окончания закрывается не зависимо от желания клиента, если средства на депозите вывести
некуда – создается новый текущий счет на того же клиента, на который выводятся средства со
срочного депозита при закрытии), плюс имеет процентную ставку и в обязательном порядке
производится начисление и уплата процентов.

Задача:

Разработать иерархию классов для реализации жизненного цикла объектов с соблюдением всех
принципов ООП. Язык реализации – любой C-подобный. Реализацию методов изменения
состояния объектов выполнить в виде заглушек: вывод в консоль сообщения об успешном (или
нет) изменении состояния.


# Запуск:

npm install express  
npm install node-schedule  
node index  

Просмотр информации обо всех имеющихся счетах:

GET => "/"


Просмотр информации о конкретном счете по его ID:

GET => /accounts?ID=ID


Пример создания счета - текущий счет:

POST => "/accounts"

<pre><code>POST body = {
	clientID: "clientID",			// id клиента  
	ID: "ID",				// id счета
	currency: "currency",			// валюта счета
	type: "Current"				// тип счета
}</code></pre>

Пример создания счета - депозит до востребования:

<pre><code>POST body = {
	clientID: "clientID",	
	ID: "ID",				
	currency: "currency",	
	type: "DemandDeposit",	
	interestRate: 12			// процентная ставка
}</code></pre>


Пример создания счета - срочный депозит:

<pre><code>POST body = {
	clientID: "clientID",
	ID: "ID",d
	currency: "currency",
	type: "DemandDeposit",
	interestRate: 100500,
	duration: 43800				// время жизни счета в минутах(!) (duration представляет собой значение срока на который открывается счет) 
}</code></pre>


Примеры:
"резервирования" счета:

PUT => "/accounts"

<pre><code>PUT body = {
	ID: "ID",
	action: "reserve"			// действие над счетом
}</code></pre>


"открытия" счета:

<pre><code>PUT body = {
	ID: "ID",
	action: "open"
}</code></pre>


"пополнения" счета:

<pre><code>PUT body = {
	ID: "ID",
	action: "topUp",
	amount: 100500				// сумма пополнения/списания
}</code></pre>


"списания" со счета:

<pre><code>PUT body = {
	ID: "ID",
	action: "withdraw",
	amount: 100500
}</code></pre>


"начисления" процентов на счет:

<pre><code>PUT body = {
	ID: "ID",
	action: "interestCharge"
}</code></pre>


"уплаты" процентов на счет:

<pre><code>PUT body = {
	ID: "ID",
	action: "interestPay"
}</code></pre>


"закрытия" счета:

<pre><code>PUT body = {
	ID: "ID",
	action: "close"
}</code></pre>
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

<pre><code>DELETE body = {
	ID: ID
}</code></pre>

Мега костыль (!):
Все счета хранятся в json'e и соответственно существуют пока сервер не будет перезапущен 
