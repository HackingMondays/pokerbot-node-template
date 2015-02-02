var Ranker = require('handranker');

var TYPE_ROYAL_FLUSH     =   'royal flush';
var TYPE_STRAIGHT_FLUSH  =   'straight flush';
var TYPE_FOUR_OF_A_KIND  =   'four of a kind';
var TYPE_FULL_HOUSE      =   'full house';
var TYPE_FLUSH           =   'flush';
var TYPE_STRAIGHT        =   'straight';
var TYPE_THREE_OF_A_KIND =   'three of a kind';
var TYPE_TWO_PAIR        =   'two pair';
var TYPE_PAIR            =   'pair';
var TYPE_HIGH_CARD       =   'high card';

var hand_levels = ["---skip---", TYPE_HIGH_CARD, TYPE_PAIR, TYPE_TWO_PAIR, TYPE_THREE_OF_A_KIND, TYPE_STRAIGHT, TYPE_FLUSH, TYPE_FULL_HOUSE, TYPE_FOUR_OF_A_KIND, TYPE_STRAIGHT_FLUSH, TYPE_ROYAL_FLUSH];

function getHand(gameObject) {
    console.log("hand: ", best_hand);
    return best_hand;
}

function toCard(desc) {
    return {rank:desc.substr(0,1), suit:desc.substr(1)};
}

function Hand(game) {
    
    if (!(this instanceof Hand)) {
        return new Hand(game);
    }
    
    this.name = undefined;
    this.handLevel = undefined;
    this.highCard = undefined;
    
    this.state = game.state; // "pre-flop", "flop", "turn", "river"
    
    this.bestHand = undefined;
    var all_cards = (game.community || []).concat(game.self.cards);
    try {
        
        this.bestHand = Ranker.getHand(all_cards);
        
    } catch (e) {
        
        this.bestHand = {
            playingCards: all_cards && all_cards.length>0?all_cards.map(toCard):[{rank:0}],
            ranking: "none"
        };
        
        if (this.bestHand.playingCards.length == 2 && this.bestHand.playingCards[0].rank !== undefined 
            && this.bestHand.playingCards[0].rank === this.bestHand.playingCards[1].rank) {
            this.bestHand.ranking = "pair";
        }
    }
    
    this.game = game;
}

/**
 * Returns an integer referring to the ranking. The higher, the better.
 * @param hand
 * @returns {number} a number from 1 to 10
 */
Hand.prototype.getNumericRanking = function() {
    var rank = hand_levels.indexOf(this.bestHand.ranking);
    return rank<0?undefined:rank;
}

/**
 * Returns an integer referring to the ranking of the best card in hand.
 * @param hand
 * @returns {number} a number from 1 to 13
 */
Hand.prototype.getNumericBestCard = function() {
    var rank = this.bestHand.playingCards[0].rank;
    var candidate = parseInt(rank, 10);
    if (candidate>0) {
        return candidate - 1;
    }
    switch (rank) {
        case 'T':
            return 11;
        case 'J':
            return 12;
        case 'Q':
            return 13;
        case 'K':
            return 14;
        case 'A':
            return 15;
    }
    return undefined;
};


exports.Hand = Hand;