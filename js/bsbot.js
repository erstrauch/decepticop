class bsBot
{
	constructor(playerID, state)
	{
		this.playerID = playerID;
		this.deck = deck;
		this.state = state;
		this.bs = null;
	}

	playTurn()
	{
		//hides previously played cards from display
		var myList = document.getElementById("table").childNodes;
		if(myList != null){
			for(var i = 0; i < myList.length; i++){
				myList[i].hidden = true;
			}
		}

		moveAllCards("lastPlayed", "table");
		this.playCards();
		//alert("Player " + this.playerID + " has played " + numCards + " " + state.getCurrCard() + "'s.");

	}

	checkHand(numPlayed)
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

					if(cards[state.getCurrCard()] != undefined && cards[state.getCurrCard()].length + parseInt(numPlayed) > 4)
					{
						this.bs = true;
					}
					else
					{
						this.bs = false;
					}
				}
			}
		}
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
						var count = document.getElementById("table").childNodes.length +cards[state.getCurrCard()].length -3;
						document.getElementById("card-count").innerText = "Pile has "+count+" cards";					
						for(var i = 0; i < cards[state.getCurrCard()].length; i++)
						{
							playCards += cards[state.getCurrCard()][i].code + ",";
							table.appendChild(document.getElementById(cards[state.getCurrCard()][i].code));
						}
						document.getElementById("last-played").innerText = "Player " + (this.playerID+1) + " played " + cards[state.getCurrCard()].length + " " + state.getCurrCard() + "(s)";
						movePiles("lastPlayed", playCards, function(){});
					}
					else
					{
						let seed = Math.random();
						var numCards = 1;
						if(seed > .99)
						{
							numCards = 4;
						}
						if(seed > .95)
						{
							numCards = 3;
						}
						if(seed > .75)
						{
							numCards = 2;
						}
						var count = document.getElementById("table").childNodes.length +numCards -3;
						document.getElementById("card-count").innerText = "Pile has "+count+" cards";
						document.getElementById("last-played").innerText = "Player " + (this.playerID+1) + " played " + numCards + " " + state.getCurrCard() + "(s)";					
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
			}
		}
	}
}