"use strict";

import { startGame } from './start-game.mjs';
import { errorMsg } from './client.js';
export let cardsArray;

// fetch data and return it into json
export const runGame = async () => {
  try {
    let response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
    let data = null
    cardsArray = [];

    // check if response is ok
    if (!response.ok) {
      // if not throw an error
      throw new Error('Not 200 OK');
    } else {
      data = await response.json() // return json file with id
    }

    // load the cards
    response = await fetch(`https://deckofcardsapi.com/api/deck/${data.deck_id}/draw/?count=52`)

    // check if response is ok
    if (!response.ok) {
      // if not throw an error
      throw new Error('Not 200 OK');
    } else {
      data = await response.json() // return json file with array of 52 cards

      for (let i = 0; i < data.cards.length; i++) {
        cardsArray.push(data.cards[i]);
      }

      startGame();
    }

  } catch (e) { // catch errors
    console.log('Caught an error!', e)
    document.querySelector(".game-section").classList.toggle("hide-toggle");
    // print error message
    errorMsg.innerHTML =
      `<div class="error">
        <p>An error occurred while loading the game. Please try again later.</p>
        <img src="assets/images/pixeltrue-error.svg" alt="pixeltrue-error">
      </div>`;
  }
}