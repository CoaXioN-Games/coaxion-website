function openEnterScreen() {
	screen = document.getElementById("window");
	newElem = document.createElement("div");
	newElem.setAttribute("id","screenCover");
	newElem.setAttribute("onclick","closeEnterScreen()");
	screen.append(newElem);
	document.getElementsByTagName("body")[0].style.overflow = "hidden";
};

function closeEnterScreen(){
	document.getElementsByTagName("body")[0].style.overflow = "auto";
	screenCover = document.getElementById("screenCover")
	//screenCover.remove();
	screenCover.style.opacity = 0;
	setTimeout(()=>{
	screenCover.style.display = "none";
	}, 500);
};



window.onload = function(){
  openEnterScreen();
};