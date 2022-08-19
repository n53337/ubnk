'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
                      // BANKIST APP


// ---------------------------> Data <---------------------------

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// ---------------------------> Elements <---------------------------

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


// ---------------------------> LOGIC <---------------------------

// --> Display Movements

const displayMovement = function (_movement) {
  containerMovements.innerHTML = '';
  _movement.forEach((el,i) => {
    const _type = el > 0 ? 'deposit' : 'withdrawal';
    const htmlTemp = `
    <div class="movements__row">
    <div class="movements__type movements__type--${_type}">${i} ${_type}</div>
    <div class="movements__date">
    </div> <div class="movements__value">${el}€</div> </div> `;
    containerMovements.insertAdjacentHTML('afterbegin', htmlTemp);
  })}

displayMovement(account1.movements);

// --> Display Balance

const displayBalance = function (movements) {
  const _balance = movements.reduce((prv,cur)=> prv+cur);
  labelBalance.textContent = `${_balance}€`;
}

displayBalance(account1.movements);

// --> Display Summary

const displaySummary = function (movement, interest) {
  const _in = movement.filter(e=>e>0).reduce((prv,cur)=>prv+cur);
  const _out = movement.filter(e=>e<0).reduce((prv,cur)=>prv+cur);
  const _intrest = (_in * interest) /100;
  labelSumIn.textContent = `${_in}€`;
  labelSumOut.textContent = `${_out}€`;
  labelSumInterest.textContent = `${_intrest}€`;
}

displaySummary(account1.movements, account1.interestRate);