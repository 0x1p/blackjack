
// GAME STATES //
var START = 'START';
var INITIAL = 'INITIAL';
var PLAYER_TURN = 'PLAYER_TURN';
var DEALER_TURN = 'DEALER_TURN';
var END = 'END';

// GLOBAL VARIABLES //
var playerList = [
  {
    name: `Bighead`,
    hand: [],
    points: 0,
    score: 0,
    isBusted: false,
    isBlackJack: false,
  },

  {
    name: `Morty`,
    hand: [],
    points: 0,
    score: 0,
    isBusted: false,
    isBlackJack: false,
  },
];

var shuffleDeck = [];
var winningScore = 5;
var currentPlayer;

// OUTPUT STATEMENTS //
var initialHandOutput = '';
var blackjackOutput = '';
var checkPointsOutput = '';
var nextCardOutput = '';
var hitOrStandOutput = '';
var bustedOutput = '';
var winnerOutput = '';
var dealerOutput = '';

// SET INITIAL STATE //
var gameState = START;

var pointsToWin = document.querySelector("#points-to-win");
var playerCard_1 = document.querySelector("#player-card-1");
var playerCard_2 = document.querySelector("#player-card-2");
var playerCard_3 = document.querySelector("#player-card-3");
var playerCard_4 = document.querySelector("#player-card-4");
var playerCard_5 = document.querySelector("#player-card-5");

var dealerCard_1 = document.querySelector("#dealer-card-1");
var dealerCard_2 = document.querySelector("#dealer-card-2");
var dealerCard_3 = document.querySelector("#dealer-card-3");
var dealerCard_4 = document.querySelector("#dealer-card-4");
var dealerCard_5 = document.querySelector("#dealer-card-5");

var dealerSection = document.querySelector("#dealer-section");
var playerSection = document.querySelector("#player-section");

var dealerImage = document.querySelector("#dealer-img");
var playerImage = document.querySelector("#player-img");

var dealerScore = document.querySelector("#dealer-score");
var playerScore = document.querySelector("#player-score");

var dealButton = document.querySelector("#deal-button");
var hitButton = document.querySelector("#hit-button");
var standButton = document.querySelector("#stand-button");

var popUpbutton = document.querySelector("#close-popup");
var popUpScreen = document.querySelector("#popup");

var endScene = document.querySelector("#end-scene");
var endCredits = document.querySelector("#end-credits");
var endImage = document.querySelector("#end-img");
var playAgain = document.querySelector("#play-again");

endScene.style.display = "none";
pointsToWin.innerHTML = winningScore;

popUpbutton.addEventListener("click", function () {
  popUpScreen.style.display = "none";
})

dealButton.addEventListener("click", function () {
  var result = deal();
  var output = document.querySelector("#div-output");
  output.innerHTML = result;
});

hitButton.addEventListener("click", function () {
  var result = hit ();
  var output = document.querySelector ("#div-output");
  output.innerHTML = result;
});

standButton.addEventListener("click", function () {
  var result = stand ();
  var output = document.querySelector ("#div-output");
  output.innerHTML = result;
});


// HELPER FUNCTIONS //
//Create cardDeck
var createDeck = function () {
  var cardDeck = [];
  var suits = ["hearts", "clubs", "diamonds", "spades"];
  var currentSuit = 0;

  while (currentSuit < suits.length) {
    var cardSuit = suits[currentSuit];
    var currentRank = 1;

    while (currentRank <= 13) {
      var cardRank = currentRank;
      var cardName = cardRank;
      var cardPoints = 0;

      if (cardName == 1) {
        cardName = 'ace';
      } else if (cardName == 11) {
        cardName = 'jack';
      } else if (cardName == 12) {
        cardName = 'queen';
      } else if (cardName == 13) {
        cardName = 'king';
      }

      if (cardRank >= 10) {
        cardPoints = 10;
      } else {
        cardPoints = cardRank;
      }

      var card = {
        suit: cardSuit,
        rank: cardRank,
        name: cardName + "of" + cardSuit,
        points: cardPoints,
        image: `<img src="images/playing-cards/${cardName}_of_${cardSuit}.png" style="width:100px;">`
      };

      cardDeck.push(card);
      currentRank += 1;
    }
    currentSuit += 1;
  }

  return cardDeck;
};

//Create shuffleDeck
var shuffleCards = function () {
  shuffleDeck = createDeck();
  var currentIndex = 0;

  while (currentIndex < shuffleDeck.length) {
    var randomIndex = Math.floor(Math.random() * 52);
    var randomCard = shuffleDeck[randomIndex];
    var currentCard = shuffleDeck[currentIndex];
    shuffleDeck[currentIndex] = randomCard;
    shuffleDeck[randomIndex] = currentCard;

    currentIndex += 1;
  }
  return shuffleDeck;
};

//Deal initial 2 cards
var dealCards = function () {
  var cardsDealt = 0;
  while (cardsDealt < 2) {
    var playerTurn = playerList.length - 1;
    while (playerTurn >= 0) {
    
      playerList[playerTurn].hand.push(shuffleDeck.pop());
      playerTurn -= 1;
    }
    cardsDealt += 1;
  }

  initialHandOutput += `${playerList[1].name} has <span class="special-text">${playerList[1].hand[0].name}</span> and <span class="special-text">${playerList[1].hand[1].name}</span>.<br>
  ${playerList[0].name} has an open <span class="special-text">${playerList[0].hand[1].name}</span> card.<br>`
  
  return null;
}

//Check if either dealer or player has blackjack. Linked to check below.
var checkForBlackJack = function () {
  var playerBlackJackCheck = 0;
  
  while (playerBlackJackCheck < playerList.length) {
    var handOne = playerList[playerBlackJackCheck].hand[0];
    var handTwo = playerList[playerBlackJackCheck].hand[1];

    if (
      (handOne.rank == 1 && handTwo.rank >= 10) || 
      (handOne.rank >= 10 && handTwo.rank == 1) ||
      (handOne.rank == 1 && handTwo.rank == 1)
    ) {
      playerList[playerBlackJackCheck].isBlackJack = true;
    }
    
    playerBlackJackCheck += 1;
  }
  return null;
};

//1st check: If BlackJack is present. Game ends regardless.
var blackjackStatement = function () {
  checkForBlackJack();

  if (playerList[0].isBlackJack == 1 && playerList[1].isBlackJack == 0) {
    blackjackOutput += `${playerList[0].name} hit blackjack! <span class="special-text">${playerList[0].name} wins!</span><br>`;
    playerList[0].score += 2;
    dealerImage.src = "images/bighead-win.png";
    playerImage.src = `images/morty-lose.png`;
    gameState = END;
  }

  if (playerList[0].isBlackJack == 0 && playerList[1].isBlackJack == 1) {
    blackjackOutput += `${playerList[1].name} hit blackjack! <span class="special-text">${playerList[1].name} wins!</span><br>`;
    playerList[1].score += 2;
    playerImage.src = "images/morty-win.jpg";
    dealerImage.src = "images/bighead-lose.png";
    gameState = END;
  }

  if (playerList[0].isBlackJack == 1 && playerList[1].isBlackJack == 1) {
    blackjackOutput += `Both have blackjacks! It's a draw!<br>`;
    gameState = END;
  }

  if (playerList[0].isBlackJack == 0 && playerList[1].isBlackJack == 0) {
    blackjackOutput += `No blackjack luck for both of you...<br> Morty. start the dance-off. `;
    gameState = INITIAL;
  }
  return null;
}

// Check if points has busted. Helper function to checkPoints()
var checkForBusted = function (checkBusted) {
  if (playerList[checkBusted].points > 21) {
    playerList[checkBusted].isBusted = true;
  }
  return null;
}

//Ace is either 1 or 11.
var checkForAce = function (player) {
  var i = 0;
  var gotAce = 0;
  while (i < player.hand.length) {
    if (player.hand[i].rank == 1) {
      gotAce += 1;
    }
    i+=1;
  }
  
  if (gotAce > 0 && player.points < 11) {
    player.points += 10;  
  }
  return null;
}

// Check points for all players, and if they have busted.
var checkPoints = function () {
  var playerTurn = 0;
  var currentPlayerPoints = 0;
  while (playerTurn < playerList.length) {
    var cardsTurn = 0;
  
    while (cardsTurn < playerList[playerTurn].hand.length) {
      currentPlayerPoints += playerList[playerTurn].hand[cardsTurn].points;
      cardsTurn += 1;
    }   
    playerList[playerTurn].points = currentPlayerPoints;
    
    checkForAce(playerList[playerTurn]);

    checkForBusted(playerTurn);
    currentPlayerPoints = 0;
    playerTurn += 1;
  }
  return null;
}

//If busted, issue busted statement. Excludes fiveCardDragon logic
var bustedStatement = function () {
  if (gameState == PLAYER_TURN && playerList[1].isBusted == true) {
    bustedOutput += `${playerList[1].name} has <span class="highlight-text">busted</span>! It's ${playerList[0].name}'s turn now.<br>` 
    gameState = DEALER_TURN;
  }

  if (gameState == DEALER_TURN && playerList[0].isBusted == true) {
    bustedOutput += `${playerList[0].name} has <span class="highlight-text">busted!</span><br>`;
  }
    styleControl();
  return null;
}

//Statement for current points and who is leading
var checkPointsStatement = function () {
  checkPointsOutput += `${playerList[1].name} has <span class="special-text">${playerList[1].points} points. </span>` 

  if (gameState == DEALER_TURN) {
  checkPointsOutput += `${playerList[0].name} has <span class="special-text">${playerList[0].points} points</span>.`
  }
  return null;
}

//Check who won and issue statement
var checkWhoWon = function () {
  
  if ((playerList[0].points > playerList[1].points && playerList[0].isBusted == false) || 
  (playerList[0].points < playerList[1].points && playerList[1].isBusted == true && playerList[0].isBusted == false)) {
    winnerOutput += `${playerList[0].name} wins this round!<br>`;
    playerList[0].score += 1;
    dealerImage.src = "images/bighead-win.png";
    playerImage.src = "images/morty-lose.png";
  }

  if ((playerList[0].points < playerList[1].points && playerList[1].isBusted == false) ||
  (playerList[0].points > playerList[1].points && playerList[0].isBusted == true && playerList[1].isBusted == false)) {
    winnerOutput += `${playerList[1].name} wins this round!<br>`;
    playerList[1].score += 1;
    playerImage.src = "images/morty-win.jpg";
    dealerImage.src = "images/bighead-lose.png";
  }

  if (playerList[0].points == playerList[1].points) {
    winnerOutput += `It's a draw for this round!<br>`;
  }

  if (playerList[0].isBusted && playerList[1].isBusted) {
    winnerOutput += `Both busted! No one wins.<br>`;
  }
  
  return null;
}

var hitOrStand = function () {
  if ((gameState == INITIAL) || (gameState == PLAYER_TURN && playerList[1].isBusted == false)) {
    hitOrStandOutput += `${playerList[1].name}, will you <span class="special-text">Hit</span> or <span class="special-text">Stand</span>?.`
  }
  return null;
}

//Deal 1 card, check if card count is 4 or 5, and issues points
var dealOneCard = function () {
  var nextCard = shuffleDeck.pop();
  currentPlayer.hand.push(nextCard);
  nextCardOutput += `${currentPlayer.name} is dealt <span class="special-text">${nextCard.name}</SPAN>. <br>`
  checkPoints();

  if (currentPlayer.hand.length == 4 && currentPlayer.points < 21) {
    nextCardOutput += `Is ${currentPlayer.name} is going for the five card dragon kill? `
  }

  if (currentPlayer.hand.length == 5 && currentPlayer.points <= 21) {
    currentPlayer.score += 3;
    nextCardOutput += `${currentPlayer.name} went for the kill and got it! He won big!(+3 pt) `
    gameState = END;
    styleControl();
  }

  if (currentPlayer.hand.length == 5 && currentPlayer.points > 21) {
    currentPlayer.score -= 1;
    nextCardOutput += `${currentPlayer.name} went for the dragon and missed(-1 pt). Better luck next time. `
    gameState = END;
    styleControl();
  }

  return nextCardOutput;
}

var dealDealer = function () {
  if (playerList[0].points < 17) {   
    dealerOutput += " bighead is dealt ";
    while (playerList[0].points < 17 && playerList[0].hand.length < 5) {
      var nextCard = shuffleDeck.pop();
      playerList[0].hand.push(nextCard);
      dealerOutput += `<span class="special-text">${nextCard.name}</span>`;
      checkPoints();
            
      if (playerList[0].points < 17 && playerList[0].hand.length < 5) {
        dealerOutput +=" and ";
      } else {
        dealerOutput +=". "
      }
    }
  }
  return null;
}

var resetStatements = function () {
  initialHandOutput = '';
  blackjackOutput = '';
  checkPointsOutput = '';
  hitOrStandOutput = '';
  nextCardOutput = '';
  bustedOutput = '';
  winnerOutput = '';
  dealerOutput = '';
  return null;
}

var resetgame = function () {
  clearDealerCards();
  clearPlayerCards(); 
  clearHands();  
  shuffleDeck = [];
  return null;
}

var clearHands = function () {
  var k = 0;
  while (k < 2) {
  playerList[k].hand = [];
  playerList[k].points = 0;
  playerList[k].isBlackJack = false;
  playerList[k].isBusted = false;

  k += 1;
  }
  return null;
}

var displayDealerCards = function () {
  var i = 0;
  var j = i + 1;
  while (i < playerList[0].hand.length) {
    var currentCard = this["dealerCard_"+j];
    currentCard.innerHTML = playerList[0].hand[i].image;
    i += 1;
    j += 1;
  }

  if ((gameState == INITIAL || gameState == PLAYER_TURN) && playerList[0].isBlackJack == 0) {
    dealerCard_1.innerHTML = `<img src="images/playing-card-back.jpg" class="card-layout">`;
  }

  return null;
}

var clearDealerCards = function () {
  var i = 0;
  var j = i + 1;
  while (i < playerList[0].hand.length) {
    var currentCard = this["dealerCard_"+j];
    currentCard.innerHTML = "";
    i += 1;
    j += 1;
  }
  return null;
}

var displayPlayerCards = function () {
  var i = 0;
  var j = i + 1;
  while (i < playerList[1].hand.length) {
    var currentCard = this["playerCard_"+j];
    currentCard.innerHTML = playerList[1].hand[i].image;
    i += 1;
    j += 1;
  }
  return null;
}

var clearPlayerCards = function () {
  var i = 0;
  var j = i + 1;
  while (i < playerList[1].hand.length) {
    var currentCard = this["playerCard_"+j];
    currentCard.innerHTML = "";
    i += 1;
    j += 1;
  }
  return null;
}

var styleControl = function () {
  if (gameState == START) {
    dealButton.innerHTML = "Deal";
    playerImage.src = "images/morty.png";
    dealerImage.src = "images/bighead.png";
  }
  
  if (gameState == INITIAL) {
    dealButton.innerHTML = "Next";
    dealerScore.innerHTML = playerList[0].score;
    playerScore.innerHTML = playerList[1].score;
  }

  if (gameState == PLAYER_TURN) {
    playerSection.style.border = "5px solid #08BAE3";
    dealButton.disabled = true;
    hitButton.disabled = false;
    standButton.disabled = false;
  }

  if (gameState == DEALER_TURN) {
    playerSection.style.border = "";
    dealerSection.style.border = "5px solid #08BAE3";
    dealerCard_1.innerHTML = playerList[0].hand[0].image;
    dealButton.disabled = false;
    hitButton.disabled = true;
    standButton.disabled = true;   
  }

  if (gameState == END) {
    dealerScore.innerHTML = playerList[0].score;
    playerScore.innerHTML = playerList[1].score;
    dealerSection.style.border = "";
    dealButton.disabled = false;
    hitButton.disabled = true;
    standButton.disabled = true;
  }

  return null;
}

var checkEndGame = function () {
  if (playerList[1].score >= winningScore) {
    endScene.style.display = "block";
  }

  if (playerList[0].score >= winningScore) {
    endCredits.innerHTML = "Morty! You failed!! Why!!! Kaboom!!!!..."
    endImage.src = "images/game-lose.jpg";
    endScene.style.display = "block";
  }
}

//MAIN FUNCTION//
var deal = function () {
  if (gameState == START) {
    shuffleCards();
    dealCards();
    blackjackStatement(); //GAME END FUNCTION: Game state changes to INITIAL or END here
    styleControl();
    displayDealerCards();
    displayPlayerCards();
    currentPlayer = playerList[1];
    return initialHandOutput + blackjackOutput;
  }

  if (gameState == INITIAL) {
    checkPoints();
    checkPointsStatement();
    hitOrStand();
    gameState = PLAYER_TURN;
    styleControl();
    return checkPointsOutput + hitOrStandOutput;
  }

  if (gameState == DEALER_TURN) {
    resetStatements();
    dealDealer();
    checkPoints();
    checkPointsStatement();
    bustedStatement();
    displayDealerCards();
    checkWhoWon();
    gameState = END;
    styleControl();  
    return dealerOutput + bustedOutput + checkPointsOutput + winnerOutput;
  }    
  
  if (gameState == END) {
    resetgame();
    resetStatements();
    checkEndGame();
    gameState = START;
    styleControl();
    
    var pointDifference;
    var pointsToGo;
    var scoreCheckStatement = 'Wubba Lubba Dab Dab!<br>';
    if (playerList[1].score > playerList[0].score) {
      pointDifference = playerList[1].score - playerList[0].score;
      pointsToGo = winningScore - pointDifference;
      scoreCheckStatement += `Morty is <span class="special-text">${pointDifference}</span> points ahead. ${pointsToGo} points to go!`
    } else if (playerList[1].score < playerList[0].score) {
      pointDifference = playerList[0].score - playerList[1].score;
      scoreCheckStatement += `Morty is <span class="special-text">${pointDifference}</span> points behind. C'mon Morty. Catch up!`
    } else if (playerList[1].score == playerList[0].score) {
      scoreCheckStatement += `Morty has the same score as bighead. Shall we go again?`
    }

    return scoreCheckStatement;
  }
}

var hit = function () {
  if (gameState == PLAYER_TURN) {
    if (playerList[1].hand.length < 4) {
      resetStatements();
      dealOneCard();
      checkPoints();
      checkPointsStatement();
      bustedStatement(); //Might change to DEALER_TURN
      hitOrStand();
      styleControl();
      displayPlayerCards();
      return nextCardOutput + checkPointsOutput + bustedOutput + hitOrStandOutput;
    }

    if (playerList[1].hand.length == 4) { //five card dragon scenario
      resetStatements();
      dealOneCard();
      displayPlayerCards();
    return nextCardOutput;
    }
  }
}

var stand = function () {
  if (gameState == PLAYER_TURN) {
    currentPlayer = playerList[0];
    gameState = DEALER_TURN;
    styleControl();
    return `${playerList[1].name} has chosen to stand <span class="special-text">${playerList[1].points}</span> points. <br>
    It's ${playerList[0].name}'s turn now. He has <span class="special-text">${playerList[0].points}</span> points`
  }
}