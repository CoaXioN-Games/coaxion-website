


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
let mainMusic = new Audio('./res/Crack_a_Lack-N+(Handheld).mp3');
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
	//changes url
	const url = new URL(window.location);
	url.searchParams.set('', [name]);
	window.history.pushState({}, '', url);
	if (name === 'home' || name === 'deathmatch_classic_refragged' || name === 'lambda_fortress' || name === 'the_espionage_project' || name === 'error'){
		//fetches html file
		fetch("./" + [name] + ".html")
		.then(response => response.text())
		.then(text => pageHtml = text)
		.then(enact => {
			let stage = document.getElementById("infoCards");
			stage.innerHTML = pageHtml;
			pageSpecificChanges(name);
			window.scrollTo(0, 0);
		});
	//for fetching blog pages
	} else if(name.search('-') > -1){
		postName = name.substring(name.search("-") + 1, name.length);
		game = name.substring(0, name.search("-"));
		//normal page fetch but it puts it in a card
		fetch("./blogs/" + game + "/" + postName + ".html")
		.then(response => response.text())
		.then(text => pageHtml = text)
		.then(enact => {
			let stage = document.getElementById("infoCards");
			stage.innerHTML = '';
			let newCard = document.createElement("div");
			newCard.classList.add("infoCard");
			newCard.innerHTML = pageHtml;
			stage.appendChild(newCard);
			pageSpecificChanges(game);
			window.scrollTo(0, 0);
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
			//just to make home look more normal, i got rid of its search parameter
			const url = new URL(window.location);
			url.searchParams.delete('');
			window.history.pushState({}, '', url);
			resetIcons();
			break;
		case "error":
			resetIcons();
			break;
		case "deathmatch_classic_refragged":
			resetIcons();
			icon = document.getElementById("dmcrIcon");
			icon.style.backgroundImage = "url('./res/dmcrIcon.png')";
			break;
		case "lambda_fortress":
			resetIcons();
			icon = document.getElementById("lfIcon");
			icon.style.backgroundImage = "url('./res/lfIcon.png')";
			break;
		case "the_espionage_project":
			resetIcons();
			icon = document.getElementById("tepIcon");
			icon.style.backgroundImage = "url('./res/tepIcon.png')";
			break;
		default:
			resetIcons();
			break;
	};
};

//i stole this code so idk. it changes the page when you use the browser to navigate back a page but doesnt work well.
window.addEventListener('popstate', function(event) {
  loadPageContents(url.substring(url.search("=") +1 , url.length));
  clickSound();
  transitionScreen();
  console.log('Browser back button was pressed');
});

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