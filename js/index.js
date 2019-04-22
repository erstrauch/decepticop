

function setName()
{
	let playerName = document.getElementById("nameBox").value;
	window.localStorage.setItem("bs-player-name", playerName);
	window.location.href = "./agreement.html";	
}