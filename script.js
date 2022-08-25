////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2022-07-24T17:01:17.194Z",
    "2022-07-26T23:36:17.929Z",
    "2022-07-29T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];
/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////

// formant Currency

const formantCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

// dispaly formant date with calculations

const formatMovementDate = function (date) {
  const calDaysPassed = (date1, date2) => {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };
  const daysPassed = calDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days Ago`;

  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

//Display Movements

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const moves = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  moves.forEach((item, index) => {
    const type = item > 0 ? `deposit` : "withdrawal";

    const date = new Date(acc.movementsDates[index]);

    const displayDate = formatMovementDate(date);
    const formatedMov = formantCurrency(item, acc.locale, acc.currency);
    const html = ` 
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div> 
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formatedMov}</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calBalanceandPrint = function (acc) {
  acc.balance = acc.movements.reduce(
    (accumulator, current) => accumulator + current,
    0
  );
  const formatedMov = formantCurrency(acc.balance, acc.locale, acc.currency);
  // acc.balance = balance;
  labelBalance.textContent = formatedMov;
};

const calDisplaySummary = function (accnt) {
  // income display like Deposit
  const income = accnt.movements
    .filter((move) => move > 0)
    .reduce((accumu, current) => accumu + current, 0);
  labelSumIn.textContent = formantCurrency(
    income,
    accnt.locale,
    accnt.currency
  );
  // Withdrawls display
  const outGoing = accnt.movements
    .filter((move) => move < 0)
    .reduce((accum, current) => accum + current, 0);
  labelSumOut.textContent = formantCurrency(
    outGoing,
    accnt.locale,
    accnt.currency
  );

  // intrest Display
  const intrestEarned = accnt.movements
    .filter((move) => move > 0)
    .map((deposit) => (deposit * accnt.interestRate) / 100)
    .filter((intrest) => intrest >= 1)
    .reduce((accu, intrest) => accu + intrest, 0);

  labelSumInterest.textContent = formantCurrency(
    intrestEarned,
    accnt.locale,
    accnt.currency
  );
};

// Create Username from the Data
const createUserName = function (accs) {
  accs.forEach((ac) => {
    ac.userName = ac.owner
      .toLowerCase()
      .split(" ")
      .map((item) => item[0])
      .join("");
  });
};
createUserName(accounts);

// Updating UI after movements
const updateUI = function (currentAccount) {
  displayMovements(currentAccount);
  //Display balance
  calBalanceandPrint(currentAccount);

  //Display summary
  calDisplaySummary(currentAccount);
};

const startLogOutTimer = function () {
  let time = 2 * 60;
  const timer = setInterval(() => {
    const mins = String(Math.trunc(time / 60)).padStart(2, "0");
    const sec = String(Math.trunc(time % 60)).padStart(2, "0");

    const message = mins >= 1 ? "Mins" : "Sec";
    labelTimer.textContent = `${mins}:${sec} ${message}`;
    time = time - 1;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Login to get started";
      containerApp.style.opacity = 0;
    }
  }, 1000);
};

// Login with valid Credientials
let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("LOGIN");

  // Checking Username from Input Filed
  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);

  // Checking Pin from Input Filed
  if (currentAccount?.pin === Number(inputLoginPin?.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welecome back ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const minutes = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = `${day}/${month}/${year},${hour}:${minutes}`;

    // clear the input fields
    inputLoginPin.value = "";
    inputLoginUsername.value = "";
    inputLoginPin.blure;

    startLogOutTimer();
    //update UI
    updateUI(currentAccount);
  }
});

// Transfer Functionality from one Acc to Another
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);

  const receiverAccount = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  inputTransferAmount.value = "";
  inputTransferTo.value = "";
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAccount?.userName !== currentAccount.userName
  ) {
    // doing the transfer
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());
    //update UI
    updateUI(currentAccount);
  }
  //console.log("amount", amount, "receiverac", receiverAccount);
});

// Account close Functionality
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    console.log("if ");
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );
    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = "";
  inputClosePin.value = "";
});

// Requesting loan Functionality
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((move) => move > amount / 10)
  ) {
    //Add movements
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());

    // update the UI
    updateUI(currentAccount);
    inputLoanAmount.value = "";
  }
});

// Sorting Functionality
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

//console.log(accounts);

// map method Example
// while iteration if you want to perform some operations then you always use map method

// const euroToUsd = 1.1;
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const euroUSD = movements.map((move) => Math.abs(move * euroToUsd));
// console.log(euroUSD);

// movements.map((item, index, ary) => {
//   if (item > 0) {
//     console.log(`item is ${index + 1} You deposited ${item}`);
//   } else {
//     console.log(`item is ${index + 1} you withdrew ${item}`);
//   }
// });

// Function to return userNames
const user = "Steven Thomas Williams"; //stw
const lowerCase = user
  .toLowerCase()
  .split(" ")
  .map((item) => item[0])
  .join("");

//console.log(lowerCase);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// reduce method
//reduce method will have three parameteres like accumulator,

const balance = movements.reduce((accumulator, currentEl, i, ary) => {
  //console.log(`accmulator ${i} ${accumulator}`);
  return accumulator + currentEl;
}, 0); // starging value of an iteration

//console.log(balance);

// finding  maximu vlaue using reduce method

const max = movements.reduce((acc, cur) => {
  if (acc > cur) {
    return acc;
  } else {
    return cur;
  }
});
//console.log(max);

// sorting arrays

// assending order
const sortdArray = movements.sort((a, b) => {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
});
//console.log(sortdArray);
//Desending order

const sortdArrayDesc = movements.sort((a, b) => {
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
});
//console.log(sortdArrayDesc);

// practice some array methods

//1
//const bankDeposit = accounts.map((ac) => ac.movements).flat();  // return same as below
const bankDeposit = accounts
  .flatMap((ac) => ac.movements)
  .filter((acc) => acc > 0)
  .reduce((sum, cur) => sum + cur, 0);

//console.log(bankDeposit);

//2
// const depositsWith1Thousand$ = accounts
//   .flatMap((ac) => ac.movements)
//   .filter((deposits) => deposits > 1000);

// console.log(depositsWith1Thousand$);

const depositsWith1Thousand$ = accounts
  .flatMap((ac) => ac.movements)
  .reduce((accu, cur) => (cur >= 1000 ? accu + 1 : accu), 0);

//console.log(depositsWith1Thousand$);

// Reminder Operator

console.log(5 % 2); // it returns 1 the remaing value  5=2*2+1
console.log(5 / 2); // it  returns 2.5 the number of times it divedd

//even or oadd

console.log(4 % 2); // even number the reminder is 0
console.log(4 / 2); // 2 number of times divisable

const isEven = function (number) {
  return number % 2 === 0 ? "EVEN" : "ODD";
};
console.log(isEven(7));
