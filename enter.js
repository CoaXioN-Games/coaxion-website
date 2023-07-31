let mainMusic = new Audio('./res/5Limbs-Ninja_Killer.mp3');


//old stuff but now just hides scrollbar
function openEnterScreen() {
	/*screen = document.getElementById("window");
	newElem = document.createElement("div");
	newElem.setAttribute("id","screenCover");
	newElem.setAttribute("onclick","closeEnterScreen()");
	screen.append(newElem);*/
	document.getElementsByTagName("body")[0].style.overflow = "hidden";
};

//fades out splash screen and hides it
function closeEnterScreen(){
	document.getElementsByTagName("body")[0].style.overflow = "auto";
	screenCover = document.getElementById("screenCover")
	//screenCover.remove();
	screenCover.style.opacity = 0;
	setTimeout(()=>{
	screenCover.style.display = "none";
	}, 500);
	//plays music
	mainMusic.loop = true;
	mainMusic.play();
};


//runs on page load
window.onload = function(){
  openEnterScreen();
};



//music

function music() {
	if (mainMusic.paused === false){
		mainMusic.pause();
		document.getElementsByClassName('playbackButton')[0].style.backgroundImage = "url('./res/notVibing.gif')";
	} else {
		mainMusic.play();
		document.getElementsByClassName('playbackButton')[0].style.backgroundImage = "url('./res/vibing.gif')";
	}
};