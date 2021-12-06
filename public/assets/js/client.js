"use strict";

import { runGame } from './build-game.mjs';
import { checkScore } from './check-score.mjs';
import { cashInBank } from './check-score.mjs';
import { playerHit, dealerHit } from './start-game.mjs';

export let playerCards = document.querySelector(".player-cards");
export let dealerCards = document.querySelector(".dealer-cards");
export let displayPlayerScore = document.querySelector(".player-score");
export let displayDealerScore = document.querySelector(".dealer-score");
export let scoreOutput = document.querySelector(".score-output p");
export let bank = document.querySelector(".bank span");
export let playOn = document.querySelector(".play-on");
export let bank1 = document.querySelector(".chips");
// errorMsg variable
export const errorMsg = document.querySelector('.start-section')

export let cashOnTable = 0;
let highestScore = 0;

const start = () => {
  if (cashOnTable > 0) {
    document.querySelector(".mydiv").style = "top: 79.5%;";
    document.querySelector("h1").classList.toggle("hide-toggle");
    document.querySelector(".chips").classList.toggle("hide-toggle");
    document.querySelector(".deal").classList.toggle("hide-toggle");
    document.querySelector(".clear").classList.toggle("hide-toggle");
    document.querySelector(".game-section").classList.toggle("hide-toggle");
    runGame();
  } else {
    alert('select cash fisrt')
  }
};

const clear = () => {
  cashOnTable = 0;
  bank.textContent = `Bank: ${cashInBank}`;
  playOn.textContent = `Play on: ${cashOnTable}`;
};

const restart = () => {
  buildChips();

  document.querySelector(".mydiv").style = "top: 50%; left: 50%; transform: translate(-50%, -50%);";
  document.querySelector(".chips").classList.toggle("hide-toggle");
  document.querySelector(".deal").classList.toggle("hide-toggle");
  document.querySelector(".clear").classList.toggle("hide-toggle");

  if (cashInBank > highestScore) {
    highestScore = cashInBank;

    axios({
      method: 'post',
      url: '/',
      data: {
        userName: 'Test',
        highestScore: highestScore,
      }
    })
  }

  document.querySelector("h1").classList.toggle("hide-toggle");
  document.querySelector(".game-section").classList.toggle("hide-toggle");

  cashOnTable = 0;
  playerCards.innerHTML = '';
  dealerCards.innerHTML = '';
  scoreOutput.textContent = '';
  displayPlayerScore.textContent = '';
  displayDealerScore.textContent = '';
  bank.textContent = `Bank: ${cashInBank}`;
  playOn.textContent = `Play on: ${cashOnTable}`;

  toggleAction();
  //runGame();
};

export const toggleAction = () => {
  document.querySelector(".score-output").classList.toggle("hide-toggle");
  document.querySelector(".restart").classList.toggle("hide-toggle");
  document.querySelector(".stand").classList.toggle("hide-toggle");
  document.querySelector(".hit").classList.toggle("hide-toggle");
};

document.querySelector(".deal").addEventListener("click", start);
document.querySelector(".clear").addEventListener("click", clear);
document.querySelector(".hit").addEventListener("click", playerHit);
document.querySelector(".stand").addEventListener("click", dealerHit);
document.querySelector(".restart").addEventListener("click", restart);

const buildChips = () => {
  if (cashInBank <= 0) {
    document.querySelector(".score-output").classList.toggle("hide-toggle");
    document.querySelector(".chips").classList.toggle("hide-toggle");
    document.querySelector(".deal").classList.toggle("hide-toggle");
    document.querySelector(".clear").classList.toggle("hide-toggle");
    console.log(scoreOutput.textContent)
    document.querySelector("h1").textContent = "Game Over!";
    document.querySelector(".score-output p").textContent = 'You ran out of cash, but don’t worry because today is your LUCKY DAY!, here is another $1000 on us :)';
    document.querySelector(".play-again").classList.toggle("hide-toggle");
    document.querySelector(".exit").classList.toggle("hide-toggle");
  } else {
  bank1.innerHTML = '';
  bank.textContent = `Bank: ${cashInBank}`;
  playOn.textContent = `Play on: ${cashOnTable}`;

  for (let i = 100; i <= cashInBank; i += 100) {
    if (i <= 1000) {
      bank1.innerHTML += `<img class="chip" src='assets/images/chip-${i}.png' alt='chip-${i}'>`;
    }
  }

  // select all btns and add click event
  document.querySelectorAll('.chip').forEach(btn => {
    btn.addEventListener("click", () => {
      const cashOnHand = Number(btn.alt.split('-')[1]);
      if (cashInBank <= 0) {
        alert(highestScore)
      } else {
        if (cashOnTable + cashOnHand <= cashInBank) {
          let bankMoney = cashInBank;
          cashOnTable += cashOnHand;
          bank.textContent = `Bank: ${bankMoney - cashOnTable}`;
          playOn.textContent = `Play on: ${cashOnTable}`;
        } else {
          alert('Not enough cash')
        }
      }
    });
  });
}
}

buildChips();

// Make the DIV element draggable:
dragElement(document.querySelector(".mydiv"));

function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}