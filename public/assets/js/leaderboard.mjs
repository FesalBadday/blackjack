"use strict";

// fetch data and return it into json
const fetchData = async () => {
  try {
    // fetch data
    const response = await fetch('players');
    // data variable
    let data = null;

    // check if response is ok
    if (!response.ok) {
      // if not throw an error
      throw new Error('Not 200 OK');
    } else {
      data = await response.json(); // return json file with data
    }

    // dataSection query selector
    const dataSection = document.querySelector(".data");

    // output variable
    let output = '';
    let i = 1;
    // check if data isn't undefined and it's an array
    if (typeof data !== 'undefined' && Array.isArray(data)) {
      // for loop to build the data
      data.forEach((player) => {
        output += `
          <tr>
            <td>${i++}.</td>
            <td>${player.userName}</td>
            <td>${player.highestScore}</td>
            <td>${player.dateSigned}</td>
            <td>${player.gamesPlayed}</td>
          </tr>`;
      })
    } else {
      dataSection.innerHTML = data.error;
    }

    // print output and date
    dataSection.innerHTML += output;

  } catch (err) { // catch errors
    console.log('Caught an error!', err); // console log the error
  }
}

// call fetchData function
fetchData();