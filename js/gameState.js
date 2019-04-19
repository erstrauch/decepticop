class gameState
{
	constructor(playerVal, players)
	{
		this.deck = deck;
		this.turn = playerVal;//Math.floor(Math.random() * players);
		this.players = players;
		this.playerVal = playerVal;
		this.lastPlayed = "";
		this.cards = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
		this.currCard = 0;
		this.bots = Array();
		for(var i = 0; i < players -1; i++)
		{
			this.bots.push(new bsBot(i, deck, this));
		}
	}
	nextTurn()
	{
		this.turn = (this.turn+1) % this.players;
		this.currCard = (this.currCard + 1) % this.cards.length;
		console.log(this.turn);
		document.getElementById("card").text = this.getCurrCard();
		if(this.turn === this.playerVal)
		{
			let button = document.getElementById("submitButton");
			button.disabled = false;
		}
		else
		{
			this.bots[this.turn].playTurn();
			let bsButtons = document.getElementsByClassName("bs");
			for(var i = 0; i < bsButtons.length; i++)
			{
				bsButtons[i].disabled = false;
			}
		}
	}	
	getCurrCard()
	{
		return this.cards[this.currCard];
	}
}