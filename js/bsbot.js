class bsBot
{
	constructor(playerID, state)
	{
		this.playerID = playerID;
		this.deck = deck;
		this.state = state;
	}

	playTurn()
	{
		moveAllCards("lastPlayed", "table");
		this.playCards();
		//alert("Player " + this.playerID + " has played " + numCards + " " + state.getCurrCard() + "'s.");

	}

	playCards()
	{
		const Http = new XMLHttpRequest();
		const url = "https://deckofcardsapi.com/api/deck/" + deck.deck_id + "/pile/" + this.playerID + "/list/";
		Http.open("GET", url);
		Http.send();
		Http.onreadystatechange = (e)=>
		{
			if(Http.readyState == 4 && Http.status == 200)
			{
				let response = JSON.parse(Http.responseText);
				var cards = [];
				if(response.piles[this.playerID] != undefined)
				{
					for(var i = 0; i < response.piles[this.playerID].cards.length; i++)
					{
						if(cards[response.piles[this.playerID].cards[i].value] == undefined)
						{
							cards[response.piles[this.playerID].cards[i].value] = Array();
						}
						cards[response.piles[this.playerID].cards[i].value].push(response.piles[this.playerID].cards[i]);
					}
					if(cards[state.getCurrCard()] != undefined)
					{
						var playCards = "";
						let table = document.getElementById("table");
						for(var i = 0; i < cards[state.getCurrCard()].length; i++)
						{
							playCards += cards[state.getCurrCard()][i].code + ",";
							table.appendChild(document.getElementById(cards[state.getCurrCard()][i].code));
						}
						movePiles("table", playCards, function(){});
					}
				}
			}
		}
	}
}