
function setAgreement()
{
	let acceptVal = document.getElementsByClassName("selected")[0];
	window.localStorage.setItem("bs-accept-value", acceptVal.value);
}

function setSelected(e)
{
	let btn = e.target;
	let acceptValues = document.getElementsByClassName("selected");
	acceptValues[0].classList.remove("selected");
	btn.classList.add("selected");
}