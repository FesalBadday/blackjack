"use strict";

import { playerScore, dealerScore } from './start-game.mjs';
import { displayDealerScore, toggleAction, scoreOutput, cashOnTable } from './client.js';

export let cashInBank = 1000;

export const checkScore = () => {
  document.querySelector(".dealer").classList.toggle("hide");
  displayDealerScore.textContent = dealerScore;
  toggleAction();

  const checkMaxScore = Math.max(playerScore, dealerScore);
  const checkMinScore = Math.min(playerScore, dealerScore);

  if (dealerScore === 21) {
    scoreOutput.textContent = 'Blackjack!. Dealer Wins :(';
    cashInBank = cashInBank - cashOnTable;
  } else if (playerScore === 21) {
    scoreOutput.textContent = 'Blackjack!. You Win :)';
    cashInBank = cashInBank + cashOnTable;
  } else if (checkMaxScore <= 20 && playerScore === dealerScore) {
    scoreOutput.textContent = 'Draw. Dealer Wins :(';
    cashInBank = cashInBank - cashOnTable;
  } else if (checkMinScore > 21) {
    scoreOutput.textContent = 'You Both Lost -_-';
    cashInBank = cashInBank - cashOnTable;
  } else if (checkMaxScore <= 20 && checkMaxScore === playerScore) {
    scoreOutput.textContent = 'Congratulations You Win!';
    cashInBank = cashInBank + cashOnTable;
  } else if (checkMaxScore > 21 && checkMinScore === playerScore) {
    scoreOutput.textContent = 'Congratulations You Win!';
    cashInBank = cashInBank + cashOnTable;
  } else {
    scoreOutput.textContent = 'You Lost. Dealer Wins :(';
    cashInBank = cashInBank - cashOnTable;
  }
}