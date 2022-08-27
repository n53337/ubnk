'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
                      // UBANK APP @n53337


// ---------------------------> Data <---------------------------

const account1 = {
  owner: 'Midha Maryam',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Othman Abdul Aziz',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Samira Ridwan',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Nadira Sherif',
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


let _account ;


// --> Generate Usernames


const genUsrnm = (_accounts)=>{
  _accounts.forEach(el=>{
    const _usrnm = el.owner.toLowerCase().split(' ').map(e=>e.at(0)).join('');
    el.username = _usrnm;
  })
}
genUsrnm(accounts);


// Eventlistner Template


const useEventListner = (_element, _type='click', _logic)=>{
  return _element.addEventListener(_type,_logic);
};


// current Date


const dtNow = ()=>{
    const _d = new Date();
    return new Intl.DateTimeFormat('gb-GB',{timeStyle:'medium'}).format(_d);
};


// Timer


let timerExist;

const timer = (_seconds)=>{
  let _min = Math.trunc(_seconds / 60);
  let _sec = _seconds % 60;
  const tLogic = ()=>{
    if (!_sec && _min) {
      _min--;
      _sec = 59;
      labelTimer.textContent = `${String(_min).padStart(2,0)}:${String(_sec).padStart(2,0)}`;
    }
    else if(!_min && !_sec){
      clearInterval(tLogic);
      containerApp.style.opacity = '0';
      labelWelcome.textContent = 'Log in to get started';
    }
    else {
      _sec--;
      labelTimer.textContent = `${String(_min).padStart(2,0)}:${String(_sec).padStart(2,0)}`;
    }
  }
  tLogic();
  timerExist = setInterval(tLogic , 1000);
  return timerExist;
}


// --> Display Movements


const displayMovement = function (_movement) {
  containerMovements.innerHTML = '';
  _movement.forEach((el,i) => {
    const _type = el > 0 ? 'deposit' : 'withdrawal';
    const htmlTemp = `
    <div class="movements__row">
    <div class="movements__type movements__type--${_type}">${i} ${_type}</div>
    <div class="movements__value">${el.toFixed(2)}€</div> </div> `;
    containerMovements.insertAdjacentHTML('afterbegin', htmlTemp);
  })}


// --> Display Balance


const displayBalance = function (movements) {
  const _balance = movements.reduce((prv,cur)=> prv+cur).toFixed(2);
  labelBalance.textContent = `${_balance}€`;
  // display Date
  setInterval(() => {
    labelDate.textContent = dtNow();
  }, 1000);
}


// --> Display Summary


const displaySummary = function (movement, interest) {
  const _in = movement.filter(e=>e>0).reduce((prv,cur)=>prv+cur).toFixed(2);
  let _out =  movement.filter(e=>e<0);
  _out.length != 0 ? _out = _out.reduce((prv,cur)=>prv+cur).toFixed(2) : 0;
  const _interest = ((_in * interest) /100).toFixed(2);
  labelSumIn.textContent = `${_in}€`;
  labelSumOut.textContent = `${Math.abs(_out)}€`;
  labelSumInterest.textContent = `${_interest}€`;
}


// --> Refrech UI


const refrechUi = (_mov, _int)=>{
  displayBalance(_mov);
  displayMovement(_mov);
  displaySummary(_mov, _int);
}


// --> User Login


const userLogin = function (_user, _pin) {
  accounts.forEach(el => {
    if (_user === el.username && _pin === el.pin) {
      // set the current account as the user data
      _account = el;
      // make content visible
      containerApp.style.opacity = '100';
      // calculate and display UI
      refrechUi(_account.movements, _account.interestRate);
      // hide the user username and password
      inputLoginUsername.value = '';
      inputLoginPin.value = '';
      // welcome back user
      labelWelcome.textContent = `What’s up, ${_account.owner}`;
      // start timer
      if (!timerExist) {
        timer(300);
      }
      else{
        clearInterval(timerExist);
        timer(300);
      }
    }
  });
}

useEventListner(btnLogin,'click', (el)=>{
  el.preventDefault();
  userLogin(inputLoginUsername.value, Number(inputLoginPin.value));
});


// Transfer Money


useEventListner(btnTransfer,'click', (el)=>{
  el.preventDefault();
  accounts.forEach(el=>{
    const accBalance = _account.movements.reduce((prv,curr)=>prv+curr).toFixed(2);
    if (el.username === inputTransferTo.value && Number(inputTransferAmount.value) > 0 && accBalance > Number(inputTransferAmount.value) && inputTransferTo.value != _account.username) {
      el.movements.push(Number(inputTransferAmount.value));
      _account.movements.push(-Number(inputTransferAmount.value));
      inputTransferTo.value = '';
      inputTransferAmount.value = '';
      setTimeout(() => {
      refrechUi(_account.movements, _account.interestRate);
      // reset timer
      clearInterval(timerExist);
      timer(300);
      }, 500);
    }
  })
});


// Request loan


useEventListner(btnLoan,'click', (el)=>{
  el.preventDefault();
  const _amount = Number(inputLoanAmount.value).toFixed(2);
  // at least 10% of the requseted loan amount
  const canLoan = _account.movements.some(e=>e>_amount * .2);
  if (canLoan && _amount > 0) {
    _account.movements.push(Number(inputLoanAmount.value));
    setTimeout(() => {
      refrechUi(_account.movements, _account.interestRate);
      // reset timer
      clearInterval(timerExist);
      timer(300);
    }, 500);
  }
});


// Close Account


useEventListner(btnClose,'click',(el)=>{
  el.preventDefault();
  if (inputCloseUsername.value === _account.username && Number(inputClosePin.value) === _account.pin){
   const closeAccIndex = accounts.findIndex(e=>e.username === _account.username);
   accounts.splice(closeAccIndex,1);
   setTimeout(() => {
    containerApp.style.opacity = '0';
    labelWelcome.textContent = 'Log in to get started';
   }, 500);
  }
});


// Sorting


let isSorted = true;

useEventListner(btnSort,'click',(el)=>{
  el.preventDefault();
  isSorted = !isSorted;
  let mov = [..._account.movements]
  !isSorted ? mov = mov.sort((prv,curr)=> prv - curr) : 0;
  refrechUi(mov, _account.interestRate);
  // reset timer
  clearInterval(timerExist);
  timer(300);
});
