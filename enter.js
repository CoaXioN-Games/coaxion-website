


//old stuff but now just hides scrollbar
function openEnterScreen() {
	document.getElementsByTagName("body")[0].style.overflow = "hidden";
};

//transition effect
function transitionScreen(){
	screenCover = document.getElementById('transitionScreen');
	screenCover.style.opacity = .25;
	screenCover.style.display = "block";
	setTimeout(()=>{
		screenCover.style.opacity = 0;
	}, 300);
	setTimeout(()=>{
		screenCover.style.display = "none";
	}, 800);
};

//fades out splash screen and hides it
function closeEnterScreen(){
	document.getElementsByTagName("body")[0].style.overflow = "auto";
	screenCover = document.getElementById("screenCover")
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
  loadPageContents(uri);
};



//music
let mainMusic = new Audio('./res/5Limbs-Ninja_Killer.mp3');
let click = new Audio('./res/click.mp3');

function music() {
	if (mainMusic.paused === false){
		mainMusic.pause();
		document.getElementsByClassName('playbackButton')[0].style.backgroundImage = "url('./res/notVibing.gif')";
	} else {
		mainMusic.play();
		document.getElementsByClassName('playbackButton')[0].style.backgroundImage = "url('./res/vibing.gif')";
	}
};


function clickSound(){
	click.play();
};


//page switching
pageHtml = "";

url = window.location.href;

uri = url.substring(url.search("=") +1 , url.length);

function loadPageContents(name) {
	console.log(name);
	if (name === 'home' || name === 'deathmatch-classic-refragged' || name === 'lambda-fortress' || name === 'the-espionage-project' || name === 'error'){
		//changes url
		const url = new URL(window.location);
		url.searchParams.set('', [name]);
		window.history.pushState({}, '', url);
		//fetches html file
		fetch("./" + [name] + ".html")
		.then(response => response.text())
		.then(text => pageHtml = text)
		.then(enact => {
			let stage = document.getElementById("infoCards");
			console.log(pageHtml);
			stage.innerHTML = pageHtml;
			pageSpecificChanges(name);
		});
	} else {
		console.log('i ran');
		const url = new URL(window.location);
		url.searchParams.set('', 'home');
		window.history.pushState({}, '', url);
		loadPageContents('home');
	};
};

function pageSpecificChanges(page){
	switch(page){
		case "home":
			resetIcons();
			break;
		case "deathmatch-classic-refragged":
			resetIcons();
			icon = document.getElementById("dmcrIcon");
			icon.style.backgroundImage = "url('./res/dmcrIcon.png')";
			break;
		case "lambda-fortress":
			resetIcons();
			icon = document.getElementById("lfIcon");
			icon.style.backgroundImage = "url('./res/lfIcon.png')";
			break;
		case "the-espionage-project":
			resetIcons();
			icon = document.getElementById("tepIcon");
			icon.style.backgroundImage = "url('./res/tepIcon.png')";
			break;
		default:
			resetIcons();
			break;
	};
};


//resets icon styles
function resetIcons(){
	dmcrIcon = document.getElementById("dmcrIcon");
	lfIcon = document.getElementById("lfIcon");
	tepIcon = document.getElementById("tepIcon");
	dmcrIcon.style.backgroundImage = "url('./res/dmcrIconGrey.png')";
	lfIcon.style.backgroundImage = "url('./res/lfIconGrey.png')";
	tepIcon.style.backgroundImage = "url('./res/tepIconGrey.png')";
};




//mobile scroll physics
if (screen.width < 1053){
	window.onscroll = function(e) {
	  // print "false" if direction is down and "true" if up
	  let scrollingDown = this.oldScroll < this.scrollY;
	  this.oldScroll = this.scrollY;
	  console.log(scrollingDown);
	  if (scrollingDown === true){
		  document.getElementsByClassName('topBar')[0].style.top = '-100px';
	  } else {
		  document.getElementsByClassName('topBar')[0].style.top = '0px';
	  };
	};
};