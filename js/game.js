
const Http = new XMLHttpRequest();
const url='https://deckofcardsapi.com/api/deck/new/shuffle/';
Http.open("GET", url);
Http.send();
Http.onreadystatechange = (e)=>
{
	if(Http.readyState == 4 && Http.status == 200)
	{
		var deck = JSON.parse(Http.responseText);
		deal(deck);
		console.log(deck);
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
	const url= 'https://deckofcardsapi.com/api/deck/' + deck.deck_id + '/pile/' + pile + '/add/?cards=' + card.card_id;
	Http.open("GET", url);
	Http.send();
	Http.onreadystatechange = (e)=>
	{
		if(Http.readyState == 4 && Http.status == 200)
		{
			//console.log(pile);
			//console.log(Http.responseText);
			let node = document.createElement("img");
			console.log(node);
			node.src = card.image;
			node.classList.add("card");
			node.height = document.getElementById("player1").height;
			document.getElementById("player" + pile).appendChild(node);
		}
	}
}