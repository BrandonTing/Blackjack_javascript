// 程式碼寫在這裡!
let yourDeck = [];
let dealerDeck = [];
let yourPoint = 0;
let dealerPoint = 0;
let inGame = false;
let winner = 0; //分辨勝負，0 = 未定

$(document).ready(function() {
    initCards();
    initButtons();
})


function initCards() {
    // let allCards = document.querySelectorAll('.card div');
    // allCards.forEach( card => {
    //     card.innerHTML = '㊖';
    // });

    $('.card div').html('㊖');
}

function initButtons() {
    $('#action-new-game').click(evt => {
        // 啟動遊戲
        newGame();
    })
    $('#action-hit').click(evt => {
        evt.preventDefault();
        yourDeck.push(deal());
        renderGameTable();
    })
    $('#action-stand').click(evt => {
        evt.preventDefault();
        dealerDeck.push(deal());
        dealerRound();
    })
}

function newGame() {
    resetGame();
    // 建立牌組
    // 洗牌
    deck = shuffle(buildDeck()); 
    // 發牌
    yourDeck.push(deal());
    dealerDeck.push(deal());
    yourDeck.push(deal());
    // 開始遊戲
    inGame = true;
    // 秀出目前的牌組
    renderGameTable();

}

function buildDeck() {
    let deck = [];
    for(let suit = 1; suit <= 4; suit++){
        for(let number = 1; number <=13 ; number++) {
            let c = new Card(suit, number);
            deck.push(c);
        }
    }
    return deck;
}

class Card {
    constructor(suit, number) {
        this.suit = suit;
        this.number = number;
    }
    
    cardNumber() {
        switch(this.number) {
            case 1: 
                return 'A';
            case 11: 
                return 'J';
            case 12: 
                return 'Q';
            case 13: 
                return 'K';
            default: 
                return this.number;
        }
    };
    
    cardPoint() {
        switch(this.number) {
            case 1: 
                return 11;
            case 11:
            case 12:
            case 13: 
                return 10;
            default: 
                return this.number;       
        }
    };

    cardSuit() {
        switch(this.suit) {
            case 1:
                return '♠'
            case 2: 
                return '♥'
            case 3: 
                return '♦'
            case 4:
                return '♣'
        }
    }
}

// 洗牌
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

function deal() {
    return deck.shift();

} 

function renderGameTable(){
    yourDeck.forEach((card, i) => {
        let theCard = $(`#yourCard${i+1}`);
        theCard.html(card.cardNumber());
        theCard.prev().html(card.cardSuit());
    });
    dealerDeck.forEach((card, i) => {
        let theCard = $(`#dealerCard${i+1}`);
        theCard.html(card.cardNumber());
        theCard.prev().html(card.cardSuit());
    });
    // 算點數
    yourPoint = calcPoint(yourDeck);
    dealerPoint = calcPoint(dealerDeck);

    if (yourPoint >= 21 || dealerPoint >= 21) {
        inGame = false;
    }

    // 決定勝負
    checkWinner();
    showWinStamp();

    $('.your-cards h1').html(`你(${yourPoint}點)`);
    $('.dealer-cards h1').html(`莊家(${dealerPoint}點)`);
    // 按鈕
    $('#action-hit').attr('disabled', !inGame);
    $('#action-stand').attr('disabled', !inGame);
}

function calcPoint(deck){
    let point = 0 ;
    deck.forEach(card => {
        point += card.cardPoint();
    });
    if (point > 21) {
        deck.forEach(card => {
            if(card.cardNumber() === 'A') {
                point -=10; //把A從11點變1點
            }
        })
    }
    return point;
}

function resetGame() {
    deck = [];
    yourDeck = [];
    dealerDeck = [];
    yourPoint = 0;
    dealerPoint = 0;
    initCards();
    winner = 0;
    clearStamp();
}

function dealerRound() {
    // 拿牌
    // 如果點數>=玩家:莊家贏
    // 如果點數<=玩家:繼續拿牌

    while (true) {
        dealerPoint = calcPoint(dealerDeck);
        if (dealerPoint < yourPoint) {
            dealerDeck.push(deal());
        } else {
            break;
        }
    }    
    inGame = false;
    renderGameTable();
}

function showWinStamp(){
    switch(winner) {

        case 1:
            $('.your-cards').addClass('result');
            break;

        case 2:
            $('.dealer-cards').addClass('result');
            break;

        case 3: // 平手
            break;

        default:
            break;
    }
}


function checkWinner(){
    switch(true){
        case yourPoint == 21:
            winner = 1;
            break;
        case yourPoint > 21:
            winner = 2;
            break;
        case dealerPoint > 21:
            winner = 1;
            break;
        case dealerPoint == yourPoint: 
            winner = 3;
            break;
        case dealerPoint > yourPoint:
            winner = 2; 
            break;

        default:
            winner = 0;
            break;             
        
    }
}

function clearStamp(){
    $('.your-cards').removeClass('result');
    $('.dealer-cards').removeClass('result');
}