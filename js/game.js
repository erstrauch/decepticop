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

function getCardsFromPile(pile, nextCall)
{
	let http = new XMLHttpRequest();
	let url = "https://deckofcardsapi.com/api/deck/" + deck.deck_id + "/pile/" + pile + "/list/"
	http.open("GET", url);
	http.send();
	http.onreadystatechange = (e)=>
	{
		if(Http.readyState == 4 && Http.status == 200)
		{
			let piles = JSON.parse(http.responseText);
			console.log(piles);
		}
	}
}

function playerPlayCards()
{
	getCardsFromPile("lastPlayed", movePiles);

	let selecteds = document.getElementsByClassName("selected");
	let cards = "";
	for(var i = 0; i < selecteds.length; i++)
	{
		cards += selecteds[i].card.code + ",";
		document.getElementById("table").appendChild(selecteds[i]);
	}
	movePiles(3,"lastPlayed", cards, function(){});
	clearSelected();
}

function movePiles(pile1, pile2, cards, callback)
{
	const Http = new XMLHttpRequest();
	// create query string for the card
	const url= 'https://deckofcardsapi.com/api/deck/' + deck.deck_id + '/pile/' + pile1 + '/draw/?cards=' + cards;
	Http.open("GET", url);
	Http.send();
	Http.onreadystatechange = (e)=>
	{
		if(Http.readyState == 4 && Http.status == 200)
		{
			let http2 = new XMLHttpRequest();
			let url2 = 'https://deckofcardsapi.com/api/deck/' + deck.deck_id + '/pile/' + pile2 + '/add/?cards=' + cards;
			http2.open("GET", url);
			http2.send();
			http2.onreadystatechange = (e) => 
			{
				callback();
			}
		}
	}
}
