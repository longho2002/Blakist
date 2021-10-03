
'use strict';	

/////////////////////////////////////////////////	
/////////////////////////////////////////////////	
// BANKIST APP	

// Data	
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

// Elements	
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

/////////////////////////////////////////////////	
/////////////////////////////////////////////////	
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const displayMovement = function(movements, sorted = false) {
  containerMovements.innerHTML = '';

  const movs = sorted ? movements.slice().sort((a,b) => a - b) : movements;

  movs.forEach(function(mov, i) {
      const type = mov > 1 ? 'deposit' : 'withdrawal';
      const html = `<div class="movements__row">
  <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
  <div class="movements__date">3 days ago</div>
  <div class="movements__value">${mov}</div>
</div>`;
      containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const cat = [2, 5, 76, 4, 5];


// map method

const newCat = cat.map(function(mov) {
  return mov + 3;
});
console.log(newCat);

const creatUserName = function(accs) {
  accs.forEach(function(acc) {
      acc.username = acc.owner
          .toLowerCase()
          .split(' ')
          .map(function(mov) {
              return mov[0];
          })
          .join('');
  });
};

console.log(accounts);

// filter
const deposit = movements.filter(function(mov) {
  return mov > 0;
});

console.log(deposit);
//reduce method

const calcDisplayBalane = function(acc) {
  acc.balance = acc.movements.reduce((acc, cur, i, arr) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

const displaySummary = function(acc) {
  const sumin = acc.movements
      .filter(function(mov) {
          return mov > 0;
      })
      .reduce(function(acc, cur) {
          return acc + cur;
      }, 0);
  const sumout = acc.movements
      .filter(function(mov) {
          return mov < 0;
      })
      .reduce(function(acc, cur) {
          return acc + cur;
      }, 0);
  const suminterest = acc.movements
      .filter(function(mov) {
          return mov > 0;
      })
      .map(function(mov) {
          return (mov * acc.interestRate) / 100;
      })
      .reduce(function(acc, cur) {
          return acc + cur;
      }, 0);
  console.log(sumin, sumout);
  labelSumIn.textContent = `${sumin} €`;
  labelSumOut.textContent = `${Math.abs(sumout)} €`;
  labelSumInterest.textContent = `${suminterest} €`;
};


const updateUI = function(acc) {
  displaySummary(acc);
  calcDisplayBalane(acc);
  displayMovement(acc.movements);
}
let currentAccount;
creatUserName(accounts);
btnLogin.addEventListener('click', function(e) {
  e.preventDefault();
  currentAccount = accounts.find(
      acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
      labelWelcome.textContent = `welcome back ${
    currentAccount.owner.split(' ')[0]
  }`;
      inputLoginPin.value = inputLoginUsername.value = '';
      inputLoginPin.blur();
      containerApp.style.opacity = 100;
      updateUI(currentAccount);
  } else {
      containerApp.style.opacity = 0;
      alert('Wrong!');
  }
});

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const activeAcc = accounts.find(acc => acc.username === inputTransferTo.value)

  console.log(amount, activeAcc);
  console.log(currentAccount.balance);
  if (currentAccount.balance >= amount && amount > 0 && activeAcc && activeAcc?.username !== currentAccount.username) {
      activeAcc.movements.push(amount);
      console.log(activeAcc.movements);
      currentAccount.movements.push(-amount);
      inputTransferTo.value = inputTransferAmount.value = ``;
      inputTransferAmount.blur();
      updateUI(currentAccount);
  }
})

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount >= 0 && currentAccount.movements.some(mov => mov >= amount*0.1) ){
    currentAccount.movements.push(amount);
    inputLoanAmount.value = ``;
    updateUI(currentAccount);
  }
})

btnClose.addEventListener('click', function(e) {
  e.preventDefault();
  if(Number(inputClosePin.value) === currentAccount.pin && currentAccount.username === inputCloseUsername.value)
  {
    const id = accounts.findIndex(acc => acc.username === inputCloseUsername.value)
    accounts.splice(id,1);
    inputClosePin.value = inputCloseUsername.value = '';
    containerApp.style.opacity = 0;
  }
})

let flag = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovement(currentAccount.movements, !flag);
  flag = !flag;
})

// SOME Array method
console.log(movements.some(mov => mov >= 0));
// EVERY Array method
console.log(movements.every(mov => mov >= 0));


// flat and flatMap

const arr = [200,[543,324],454,12];
console.log(arr.flat());
const arr1 = [[200,[543,324]],454,12];
console.log(arr1.flat(1));

console.log(accounts.map(mov => mov.movements).flat().reduce((acc,value) => acc + value, 0))
console.log(accounts.flatMap(mov => mov.movements).reduce((acc,value) => acc + value, 0))

console.log(movements.slice().sort((a,b) => a - b));