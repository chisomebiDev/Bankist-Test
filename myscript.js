"use strict";

// BANKIST APP

// Data
const account1 = {
  owner: "Chisomebi Onwunyi",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Somto Mbamalu",
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

// LECTURES

function displayMovements(acc, sort = false) {
  let movs = sort
    ? acc.movements.slice().sort(function (a, b) {
        return a - b;
      })
    : acc.movements;
  containerMovements.innerHTML = "";
  movs.forEach(function (mov, i) {
    //
    let date = createDate(acc.movementsDates[i], false);
    let type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${date}</div>
        <div class="movements__value">${mov.toFixed(2)} ${"€"}</div>
    </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

function calcPrintBalance(acc) {
  acc.balance = acc.movements.reduce(function (ac, cur) {
    return ac + cur;
  }, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
}

function calcDisplaySummary(acc) {
  let incomes = acc.movements
    .filter((item) => item > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  let out = acc.movements
    .filter((item) => item < 0)
    .map((num) => Math.abs(num))
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${out.toFixed(2)}€`;

  let interest = acc.movements
    .filter((item) => item > 0)
    .map((num) => (num * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
}

function createUsernames(accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((e) => e[0])
      .join("");
  });
}

function findUser(username) {
  let user = accounts.find((acc) => acc.username === username);
  return user;
}
createUsernames(accounts);

function updateUI(acc) {
  //Updates UI
  calcPrintBalance(acc);
  displayMovements(acc);
  calcDisplaySummary(acc);
}
//Create Date
function createDate(date, bool = true) {
  let currentDate = new Date(date);
  let day = `${currentDate.getDate()}`.padStart(2, 0);
  let month = `${currentDate.getMonth() + 1}`.padStart(2, 0);
  let year = currentDate.getFullYear();
  let hour = `${currentDate.getHours()}`.padStart(2, 0);
  let minute = `${currentDate.getMinutes()}`.padStart(2, 0);

  if (bool) {
    return `${day}/${month}/${year}, ${hour}:${minute}`;
  } else {
    return `${day}/${month}/${year}`;
  }
}

// Event listener
let currentAccount;

//Fake Login///////////
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 1;
labelWelcome.textContent = `Welcome back, ${
  currentAccount.owner.split(" ")[0]
}`;

//Login
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  let currentUser = inputLoginUsername.value;
  let pin = +inputLoginPin.value;
  labelDate.textContent = createDate(new Date().toISOString());

  // Clear Login Fields
  inputLoginUsername.value = inputLoginPin.value = "";
  inputLoginPin.blur();
  inputLoginUsername.blur();

  currentAccount = accounts.find((acc) => {
    return acc?.username === currentUser && acc?.pin === pin;
  });

  if (currentAccount) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    //Calculate Balance
    updateUI(currentAccount);
    containerApp.style.opacity = 1;
  }
});

//Transfer
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  let amount = +inputTransferAmount.value;
  let receiverAcc = inputTransferTo.value;

  inputTransferAmount.value = "";
  inputTransferTo.value = "";

  let receiver = accounts.find(function (acc) {
    return acc.username === receiverAcc;
  });
  //Add transfer to receiver's movements array as deposit
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiver?.username !== currentAccount.username
  ) {
    // Transfer
    receiver?.movements.push(amount);
    receiver?.movementsDates.push(new Date().toISOString());
    //
    currentAccount?.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
});

//Loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  let amount = Math.floor(inputLoanAmount.value);
  inputLoanAmount.value = "";

  let loan = currentAccount.movements.some((mov) => mov >= amount * 0.1);

  if (loan && amount > 0) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  let account = inputCloseUsername.value;
  let accPin = +inputClosePin.value;

  inputCloseUsername.value = "";
  inputClosePin.value = "";

  if (currentAccount.username === account && currentAccount.pin === accPin) {
    let accIndex = accounts.findIndex(function (acc) {
      return acc.username === account && acc.pin === accPin;
    });

    if (accIndex !== -1) {
      accounts.splice(accIndex, 1);
      containerApp.style.opacity = 0;
    }
  }
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

function convertTitleCase(str) {
  let noneCap = ["a", "an", "is", "for", "and"];

  const capitalize = (str) => `${str[0].toUpperCase()}${str.slice(1)}`;

  let newStr = str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      if (!noneCap.includes(word)) {
        return capitalize(word);
      } else {
        return word;
      }
    })
    .join(" ");

  console.log(capitalize(newStr));
}

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // console.log(user);
// const currencies = new Map([
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"],
// ]);

// let usd = movements.map(function (element) {
//   return `${"USD"}:${(element * 1.1).toFixed(2)}`;
// });

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog + 1 is an adult, and is 5 years old") or a puppy ("Dog + 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
// function calcAverageHumanAge(ages) {
//   let humanAge = ages.map(function (age) {
//     return age <= 2 ? 2 * age : 16 + age * 4;
//   });
//   let adultAge = humanAge.filter(function (ageHuman) {
//     return ageHuman > 18;
//   });
//   let aveAge = adultAge.reduce(function (acc, cur, _i, arr) {
//     return acc + cur / arr.length;
//   }, 0);
//   console.log(ages);
//   console.log(humanAge);
//   console.log(adultAge);
//   console.log(aveAge);
// }
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]); ///////

// function checkDogs(dogsJulia, dogsKate) {
//   let [dogsJulia2, dogsKate2] = [dogsJulia.slice(1, -2), dogsKate];
//   let dogs = [dogsJulia2, dogsKate2];

//   dogs.forEach(function (person) {
//     console.log("---");
//     person.forEach(function (value, key) {
//       let age = value >= 3 ? "adult" : "puppy 🐶";

//       console.log(
//         `Dog + ${key + 1} is an ${age}, and is ${value} years old`
//       );
//     });
//   });
// }

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);  ///////

///////////////////////////////////////
// Coding Challenge #4

// Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
// Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
// Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

// 1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)

// 2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
// 3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
/////////////////////
// function eatingSarah(dogs) {
//   let dogSarah = dogs.find((dog) => dog.owners.includes("Sarah"));

//   if (
//     dogSarah.curFood > dogSarah.recommendedFood * 0.9 &&
//     dogSarah.recommendedFood * 1.1 > dogSarah.curFood
//   ) {
//     console.log(`Sarah's dog is eating Okay`);
//   } else if (dogSarah.recommendedFood * 1.1 < dogSarah.curFood) {
//     console.log(`Sarah's dog is eating too much`);
//   } else if (dogSarah.curFood < dogSarah.recommendedFood * 0.9) {
//     console.log(`Sarah's dog is too little`);
//   }
// }
////////////////////
// eatingSarah(dogs);
// 4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
const dogs = [
  { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
  { weight: 8, curFood: 200, owners: ["Matilda"] },
  { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
  { weight: 32, curFood: 340, owners: ["Michael"] },
];

function eating(dogs) {
  dogs.forEach(function (dog) {
    dog.recommendedFood = +(dog.weight ** 0.75 * 28).toFixed(2);
  });
  const check = dogs.reduce(
    function (cm, dog) {
      if (dog.recommendedFood * 1.1 < dog.curFood) {
        cm.ownersEatTooMuch[0].unshift(...dog.owners);
      } else if (dog.curFood < dog.recommendedFood * 0.9) {
        cm.ownersEatTooLittle[0].unshift(...dog.owners);
      } else {
        cm.ownersEatOkay.unshift(dog.owners);
      }

      return cm;
    },
    {
      ownersEatTooMuch: [[], "eat too much!"],
      ownersEatTooLittle: [[], "eat too little!"],
      ownersEatOkay: ["eats okay!"],
    }
  );

  Object.values(check).forEach(function (array) {
    array[0].forEach(function (ele, i) {
      if (i === 0) {
        let num = array[0].length - 1;

        if (array[0].length > 1) {
          array[0].push("dogs");
          array[0][num] = `and ${array[0][num]}'s`;
        } else {
          array[0].push("dog");
          array[0][num] = `${array[0][num]}'s`;
        }
      }
    });
  });

  let newList = Object.values(check)
    .map(function (elm) {
      return elm.flat(1).join(" ");
    })
    .forEach((elem) => console.log(elem));
  return check;
}
// eating(dogs);
// 5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
// Obj;
// 6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
// 7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
// 8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

// HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
// HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

// TEST DATA:

// GOOD LUCK 😀
