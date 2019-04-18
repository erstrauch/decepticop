class gameState
{
	constructor(playerVal, players)
	{
		this.deck = deck;
		this.turn = Math.floor(Math.random() * players);
		this.players = players;
		this.playerVal = playerVal;
		this.lastPlayed = "";
		this.cards = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];
		this.currCard = 0;
		this.bots = Array();
		for(var i = 0; i < players -1; i++)
		{
			this.bots.push(new bsBot(i, deck));
		}
	}
	nextTurn()
	{
		this.turn = (this.turn+1) % this.players;
		this.currCard = (this.currCard + 1) % this.cards.length;
		document.getElementById("card").text = this.getCurrCard();
		if(this.turn === this.playerVal)
		{
			let button = document.getElementById("submitButton");
			button.disabled = false;
		}
		else
		{
			console.log(this.turn);
			this.bots[this.turn].playTurn();
			this.nextTurn();
		}
	}
	getCurrCard()
	{
		return this.cards[this.currCard];
	}
}