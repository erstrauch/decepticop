let state = null;
let deck = null;
newGame();

function newGame()
{
	const Http = new XMLHttpRequest();
	const url='https://deckofcardsapi.com/api/deck/new/shuffle/';
	Http.open("GET", url);
	Http.send();
	Http.onreadystatechange = (e)=>
	{
		if(Http.readyState == 4 && Http.status == 200)
		{
			deck = JSON.parse(Http.responseText);
			state = new gameState(3,4, deck);
			deal(deck);
		}
	}
}

function deal(deck)
{
	for(let i = 0; i < 13; i++)
	{
		for(let j = 0; j < 4; j++)
		{
			draw(deck, j);
		}
	}
}

function draw(deck, pile)
{
	const Http = new XMLHttpRequest();
	const url = 'https://deckofcardsapi.com/api/deck/' + deck.deck_id + '/draw/';
	Http.open("GET", url);
	Http.send();
	Http.onreadystatechange = (e)=>
	{
		if(Http.readyState == 4 && Http.status == 200)
		{
			var card = JSON.parse(Http.responseText);
			addToPile(deck,pile,card.cards[0]);
		}
	}
}

function addToPile(deck, pile, card)
{
	const Http = new XMLHttpRequest();
	//create query string for the card
	const url= 'https://deckofcardsapi.com/api/deck/' + deck.deck_id + '/pile/' + pile + '/add/?cards=' + card.code;
	Http.open("GET", url);
	Http.send();
	Http.onreadystatechange = (e)=>
	{
		if(Http.readyState == 4 && Http.status == 200)
		{
			let node = document.createElement("img");
			node.src = card.image;
			node.classList.add("card");
			node.height = document.getElementById("player1").height;
			node.card = card;
			node.id = card.code;
			node.onclick = selectCards;
			document.getElementById("player" + pile).appendChild(node);
		}
	}
}

function selectCards()
{
	if(this.parentNode.id == state.playerVal);
	{
		if(this.classList.contains("selected"))
		{
			this.classList.remove("selected");
		}
		else
		{
			let selecteds = document.getElementsByClassName("selected").length;
			let maxSelect = document.getElementById("numberSelect").value;
			if(selecteds < maxSelect)
			{
				this.classList.add("selected");
			}
		}
	}
}

function clearSelected()
{
	let selecteds = document.getElementsByClassName("selected");
	for(var i = 0; i < selecteds.length; i)
	{
		selecteds[i].classList.remove("selected");
	}
}

function playerPlayCards()
{
	moveAllCards("lastPlayed", "table");

	let selecteds = document.getElementsByClassName("selected");
	let cards = "";
	if(selecteds.length == document.getElementById("numberSelect").value)
	{
		for(var i = 0; i < selecteds.length; i++)
		{
			cards += selecteds[i].card.code + ",";
			document.getElementById("table").appendChild(selecteds[i]);
		}
		//document.getElementById("table").appendChild(document.createElement("br"));
		movePiles("lastPlayed", cards, function(){});
		clearSelected();
		let button = document.getElementById("submitButton");

		button.disabled = true;
		state.nextTurn();
	}
	else
	{
		alert("Please select the correct number of cards (" + document.getElementById("numberSelect").value + ")");
	}
}

function movePiles(pile, cards, callback)
{
	let http2 = new XMLHttpRequest();
	let url2 = 'https://deckofcardsapi.com/api/deck/' + deck.deck_id + '/pile/' + pile + '/add/?cards=' + cards;
	http2.open("GET", url2);
	http2.send();
	http2.onreadystatechange = (e) => 
	{
		if(http2.readyState == 4 && http2.status == 200)
		{	
			callback();
		}
	}
}

function moveAllCards(pile1, pile2)
{
	const Http = new XMLHttpRequest();
	// create query string for the card
	const url = "https://deckofcardsapi.com/api/deck/" + deck.deck_id + "/pile/" + pile1 + "/list/";
	Http.open("GET", url);
	Http.send();
	Http.onreadystatechange = (e)=>
	{
		if(Http.readyState == 4 && Http.status == 200)
		{
			let response = JSON.parse(Http.responseText);
			var cards = ""
			if(response.piles[pile1] != undefined)
			{
				for(var i = 0; i < response.piles[pile1].cards.length; i++)
				{
					cards += response.piles[pile1].cards[i].code + ",";
					if(pile2 != "table" && pile2 != "lastPlayed")
					{
						try
						{
							document.getElementById("player" + pile2).appendChild(document.getElementById(response.piles[pile1].cards[i].code));
						}
						catch(err)
						{
							console.log(err);
							console.log(document.getElementById("player" + pile2));
							console.log(pile2);
							console.log(document.getElementById(response.piles[pile1].cards[i].code));
						}
					}
				}
				movePiles(pile2, cards, function(){});
			}
		}
	}
}

function bs()
{
	let http = new XMLHttpRequest();
	let url = "https://deckofcardsapi.com/api/deck/" + deck.deck_id + "/pile/lastPlayed/list/";
	http.open("GET", url);
	http.send();
	http.onreadystatechange = (e)=>
	{
		if(http.readyState == 4 && http.status == 200) //allowed to go through twice???
		{
			let response = JSON.parse(http.responseText);
			var cards = Array();
			if(response.piles[state.turn] != undefined)
			{
				var bad = false;
				for(var i = 0; i < response.piles["lastPlayed"].cards.length; i++)
				{
					cards.push(response.piles["lastPlayed"].cards[i]);
					if(response.piles["lastPlayed"].cards[i].value !== state.getCurrCard())
					{
						bad = true;
						break;
					}
				}
				console.log(bad);
				if(bad)
				{
					moveAllCards("lastPlayed", state.turn);
					moveAllCards("table", state.turn);
					for(card in cards)
					{
						document.getElementById("player" + state.turn).appendChild(document.getElementById(cards[card].code));
					}
				}
				else
				{
					moveAllCards("lastPlayed", state.playerVal);
					moveAllCards("table", state.playerVal);
					for(card in cards)
					{
						document.getElementById("player" + state.playerVal).appendChild(document.getElementById(cards[card].code));
					}
				}
			}
			let bsButtons = document.getElementsByClassName("bs");
			for(var i = 0; i < bsButtons.length; i++)
			{
				bsButtons[i].disabled = true;
			}
			state.nextTurn();
		}
	}
}

function ok()
{
	let bsButtons = document.getElementsByClassName("bs");
	for(var i = 0; i < bsButtons.length; i++)
	{
		bsButtons[i].disabled = true;
	}
	state.nextTurn();
}

function startGame()
{
	state.nextTurn();
	document.getElementById("startGame").style.display = "none";
}