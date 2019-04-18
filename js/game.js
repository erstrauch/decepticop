let deck = null;
const Http = new XMLHttpRequest();
const url='https://deckofcardsapi.com/api/deck/new/shuffle/';
Http.open("GET", url);
Http.send();
Http.onreadystatechange = (e)=>
{
	if(Http.readyState == 4 && Http.status == 200)
	{
		deck = JSON.parse(Http.responseText);
		deal(deck);
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
	const url='https://deckofcardsapi.com/api/deck/' + deck.deck_id + '/draw/';
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
			if(pile === 3)
			{
				node.onclick = selectCards;
			}
			document.getElementById("player" + pile).appendChild(node);
		}
	}
}

function selectCards()
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
	for(var i = 0; i < selecteds.length; i++)
	{
		cards += selecteds[i].card.code + ",";
		document.getElementById("table").appendChild(selecteds[i]);
	}
	movePiles("lastPlayed", cards, function(){});
	clearSelected();
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
					cards += response.piles[pile1].cards[i].code + ","
				}
				movePiles(pile2, cards, function(){});
			}
		}
	}
}
