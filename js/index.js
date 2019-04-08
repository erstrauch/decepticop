

function setName()
{
	let playerName = document.getElementById("nameBox").value;
	window.localStorage.setItem("bs-player-name", playerName);
	console.log(localStorage.getItem("bs-player-name"));
}