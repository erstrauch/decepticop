class bsBot
{
	constructor(playerID)
	{
		this.playerID = playerID;
		this.deck = deck;
	}

	playTurn()
	{
		moveAllCards("lastPlayed", "table");
		let numCards = Math.floor((Math.random() * 4)) + 1;
		this.playCards(numCards);

	}

	playCards(numCards)
	{
		for(var i = 0; i < numCards; i++)
		{
			const Http = new XMLHttpRequest();
			const url = "https://deckofcardsapi.com/api/deck/" + deck.deck_id + "/pile/" + this.playerID + "/draw/";
			Http.open("GET", url);
			Http.send();
			Http.onreadystatechange = (e)=>
			{
				if(Http.readyState == 4 && Http.status == 200)
				{
					let response = JSON.parse(Http.responseText);
					var cards = response.cards[0].code + ",";
					document.getElementById("table").appendChild(document.getElementById(response.cards[0].code));
					movePiles("lastPlayed", cards, function(){});
				}
			}
		}
	}
}