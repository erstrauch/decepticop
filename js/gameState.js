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
		this.currCard = 12;
		this.bots = Array();
		for(var i = 0; i < players -1; i++)
		{
			this.bots.push(new bsBot(i, deck, this));
		}
	}
	nextTurn()
	{
		this.checkWinState();
		document.getElementById("player" + this.turn).style.backgroundColor = "white";
		this.turn = (this.turn+1) % this.players;
		this.currCard = (this.currCard + 1) % this.cards.length;
		document.getElementById("player" + this.turn).style.backgroundColor = "blue"; //blue allows selected box to be seen
		document.getElementById("card").text = this.getCurrCard();
	
		if(this.turn === this.playerVal)
		{
			let button = document.getElementById("submitButton");
			button.disabled = false;

			let bsButtons = document.getElementsByClassName("bs");
			for(var i = 0; i < bsButtons.length; i++)
			{
				bsButtons[i].disabled = true;
			}
		}
		else
		{
			this.bots[this.turn].playTurn();
			let bsButtons = document.getElementsByClassName("bs");
			for(var i = 0; i < bsButtons.length; i++)
			{
				bsButtons[i].disabled = false;
			}

			let button = document.getElementById("submitButton");	//duplicating fixes beginning of game issue
			button.disabled = true;
		}
	}	
	getCurrCard()
	{
		return this.cards[this.currCard];
	}

	decideBS()
	{
		var toRet = true;
		for(var i = 0; i < this.bots.length; i++)
		{
			if(this.bots[i].bs == null)
			{
				toRet = false;
			}
		}
		return toRet;
	}
	checkWinState()
	{
		let tempTurn = this.turn;
		const Http = new XMLHttpRequest();
		const url = "https://deckofcardsapi.com/api/deck/" + deck.deck_id + "/pile/" + this.turn + "/list/";
		Http.open("GET", url);
		Http.send();
		Http.onreadystatechange = (e)=>
		{
			if(Http.readyState == 4 && Http.status == 200)
			{
				let response = JSON.parse(Http.responseText);
				if(response.piles[tempTurn].remaining == 0)
				{
					document.getElementById("table").innerHTML = "";
					document.getElementById("player0").innerHTML = "";
					document.getElementById("player1").innerHTML = "";
					document.getElementById("player2").innerHTML = "";
					document.getElementById("player3").innerHTML = "";

					if(tempTurn !== this.playerVal)
					{
						alert("Player " + tempTurn + " has won the game!");
					}
					else
					{
						alert("You have won the game!");
					}
					
					// Eye tracking calibration goes here
					
					/*
					//First start up the recording script
					let http = new XMLHttpRequest();
					let url = "./cgi-bin/GazeTracking/QA2.py";
					http.open("POST", url);
					http.send();
					http.onreadystatechange = (e)=>
					{
						if(http.readyState == 4 && http.status == 200)
						{
							
						}
					}

					//Then do the calibration points

					//Number the touchpoints 1-9, and each time one is clicked, send a POST request to gameLog.py with the data {"calibration": true, "touchpoint": *touchpoint*}, so the calibration can be synced with the QA2.py video

					*/
					window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSe_UAyKMXjWzVpHJn5VJlcm7i00ghntyjFwBdrEE3KquD-YVg/viewform?usp=sf_link";
				}
			}
		}
	}
}