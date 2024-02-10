const pageStack = [];


//old stuff but now just hides scrollbar
function openEnterScreen() {
	//document.getElementsByTagName("body")[0].style.overflow = "hidden";
};

//transition effect
function transitionScreen(){
	screenCover = document.getElementById('transitionScreen');
	screenCover.style.opacity = .5;
	screenCover.style.display = "block";
	setTimeout(()=>{
		screenCover.style.opacity = 0;
	}, 300);
	setTimeout(()=>{
		screenCover.style.display = "none";
	}, 800);
};
//for if you killed him
let guyStatus = 'alive';
let guyHealth = 100;
if (readCookie('guyHealth')){
	guyStatus = 'dead';
	guyHealth = parseInt(readCookie('guyHealth'), 10);
};
//fades out splash screen and hides it
function closeEnterScreen(){
	document.getElementsByTagName("body")[0].style.overflow = "auto";
	screenCover = document.getElementById("screenCover")
	screenCover.style.transform = "translate(0px, -1000px)";
	screenCover.style.opacity = 0;
	setTimeout(()=>{
		screenCover.style.display = "none";
	}, 500);
	//plays music
	mainMusic.loop = true;
	if (guyStatus === 'dead'){
		document.getElementsByClassName('playbackButton')[0].setAttribute('onclick', "resuscitate()");
		document.getElementsByClassName('playbackButton')[0].style.backgroundImage = "url('./res/404.jpg')";
		console.log('he is dead. click him to resucitate');
	} else if (readCookie('muteMusic') === 'true') {
		console.log('mute pref = muted');
		document.getElementsByClassName('playbackButton')[0].style.backgroundImage = "url('./res/notVibing.gif')";
	} else {
		mainMusic.play();
	};
};

//bring him back
function resuscitate(){
	guyHealth++;
	writeCookie('guyHealth', guyHealth);
	console.log(guyHealth + "/100");
	if (guyHealth > 99){
		deleteCookie('guyHealth');
		document.getElementsByClassName('playbackButton')[0].setAttribute('onclick', "music()");
		document.getElementsByClassName('playbackButton')[0].style.backgroundImage = "url('./res/vibing.gif')";
		console.log("thanks man! i thought i was a goner for sure!")
		if (readCookie('muteMusic') === 'true') {
			console.log('mute pref = muted');
			document.getElementsByClassName('playbackButton')[0].style.backgroundImage = "url('./res/notVibing.gif')";
		} else {
			mainMusic.play();
		};
	};
};


//runs on page load
window.onload = function(){
  openEnterScreen();
  loadPageContents(getUri());
};



//music
let mainMusic = new Audio('./res/CoaXioNLowSampleRate.ogg');

function music() {
	if (mainMusic.paused === false){
		mainMusic.pause();
		document.getElementsByClassName('playbackButton')[0].style.backgroundImage = "url('./res/notVibing.gif')";
		writeCookie('muteMusic', 'true');
	} else {
		mainMusic.play();
		document.getElementsByClassName('playbackButton')[0].style.backgroundImage = "url('./res/vibing.gif')";
		deleteCookie('muteMusic');
	}
};

//music stops when tab not focused
const handleVisibilityChange = function() {
    if (document.visibilityState === 'visible') {
		if (readCookie('guyHealth') < 100){
			return;
		}
		if (readCookie('muteMusic') != 'true') {
			mainMusic.play();
		};
    } else {
		mainMusic.pause();
    };
};
document.addEventListener("visibilitychange", handleVisibilityChange);

//sounds
let soundPlaying = false;
function playSound(sound) {
	//prevents hover sound from playing on smaller screens
	if (sound === './res/hover.mp3'){
		if (screen.width < 1053){
			return;
		};
	};
	if (sound === './res/click.mp3' || sound === './res/hover.mp3'){
		var audio = new Audio(sound);
		audio.play();
		return;
	};
    if (soundPlaying === false) {
        var audio = new Audio(sound);
        audio.onloadedmetadata = function () {
            let soundLength = audio.duration;
            soundPlaying = true;
            audio.play();
			if (readCookie('muteMusic') != 'true'){
				mainMusic.volume = 0.1;
			};
            setTimeout(() => {
                soundPlaying = false;
				if (readCookie('muteMusic') != 'true'){
					mainMusic.volume = 1;
				};
            }, soundLength * 1000);
        };
    };
};


//page switching
pageHtml = "";

function getUri(){
	url = window.location.href;
	uri = url.substring(url.search("=") +1 , url.length);
	return uri;
};

firstLoad = true;

function loadPageContents(name) {
	if (firstLoad === false){
	//funny effects
	transitionScreen();
	playSound('./res/click.mp3');
	pageStack.push(getUri());
	};
	firstLoad = false;
	//changes url
	const url = new URL(window.location);
	url.searchParams.set('', [name]);
	window.history.pushState({}, '', url);
	//goatcounter inserted
	function initGoatCounter() {
		var t = setInterval(function() {
		if (window.goatcounter && window.goatcounter.visit_count) {
		  clearInterval(t);
		  window.goatcounter.visit_count({
			append: '#stats',
			no_branding: true,
			style: `
			  div { border-color: transparent; background-color: #141414; color: #888888; border-radius: 0px; }
			  #gcvc-views { font-family: monospace; }
			  #gcvc-for { color: #888888; }
			`
		  });
		}
	  }, 100);
	};
	function initGoatCounterFr() {
	  document.getElementById('stats').innerHTML ="<div style='position:relative; z-index:1; width:200px; height:25px; text-align:center; background-color:#141414; margin-bottom:-25px;'><p>Total Page Views:</p></div><div style='position:absolute; width:200px; height:50px; text-align:center; padding-top:20px;'><p>disable adblock to view</p></div>";
	  initGoatCounter();
	  var script2 = document.createElement('script');
	  script2.dataset.goatcounter = 'https://coaxion.goatcounter.com/count';
	  script2.async = true;
	  script2.src = './count.js';
	  document.body.appendChild(script2);
	};
	//back to page load
	if (name === 'home' || name === 'deathmatch_classic_refragged' || name === 'lambda_fortress' || name === 'the_espionage_project' || name === 'credits' || name === 'error'){
		initGoatCounterFr();
		//fetches html file
		fetch("./" + [name] + ".html")
		.then(response => response.text())
		.then(text => pageHtml = text)
		.then(enact => {
			let stage = document.getElementById("infoCards");
			stage.innerHTML = pageHtml;
			pageSpecificChanges(name);
			retreiveBlogList();
			window.scrollTo(0, 0);
		});
	//for fetching blog pages
	} else if(name.search('-') > -1){
		initGoatCounterFr();
		postName = name.substring(name.search("-") + 1, name.length);
		game = name.substring(0, name.search("-"));
		//normal page fetch but it puts it in a card
		fetch("./blogs/" + game + "/" + postName + ".html")
		.then(response => response.text())
		.then(text => pageHtml = text)
		.then(enact => {
			let stage = document.getElementById("infoCards");
			stage.innerHTML = '';
			//title
			let fullBlogList = {};
			fetch("./blogs/bloglist.json")
			.then(response => response.json())
			.then(json => fullBlogList = json)
			.then(bruh => {placeBlogInfo()});
			function placeBlogInfo(){
				let totalPostCount = fullBlogList[game].length;
				let postNumber = 0;
				for (let i = 0; i <= totalPostCount -1; i++){
					let title = fullBlogList[game][i].contentUrl;
					if (title === name){
						postNumber = i;
						break;
					};
				};
				let postTitle = fullBlogList[game][postNumber].title;
				let postDate = fullBlogList[game][postNumber].date;
				let newCard = document.createElement("div");
				newCard.classList.add("infoCard");
				newCard.innerHTML = "<h1>" + postTitle + "</h1><p>" + postDate + "</p>";
				stage.appendChild(newCard);
				//content
				newCard = document.createElement("div");
				newCard.classList.add("infoCard");
				newCard.innerHTML = pageHtml;
				stage.appendChild(newCard);
				pageSpecificChanges(game);
				retreiveBlogList();
				window.scrollTo(0, 0);
			};
		});
	} else {
		const url = new URL(window.location);
		url.searchParams.set('', 'home');
		window.history.pushState({}, '', url);
		firstLoad = true;
		document.getElementById('stats').innerHTML ="<div style='position:absolute; width:200px; height:25px; text-align:center; background-color:#141414;'><p>Page Views:</p></div>";
		loadPageContents('home');
	};
};

function pageSpecificChanges(page){
	var topBarColor = document.getElementsByClassName("topBar")[0];
	switch(page){
		case "home":
			//just to make home look more normal, i got rid of its search parameter
            topBarColor.style.borderColor = "white";
			const url = new URL(window.location);
			url.searchParams.delete('');
			window.history.pushState({}, '', url);
			resetIcons();
			break;
		case "error":
			resetIcons();
			break;
		case "deathmatch_classic_refragged":
            topBarColor.style.borderColor = "#ec382c";
			resetIcons();
			icon = document.getElementById("dmcrIcon");
			icon.style.filter = "saturate(1) brightness(1)";
			initCarousel();
			break;
		case "lambda_fortress":
            topBarColor.style.borderColor = "rgb(248, 176, 50)";
			resetIcons();
			icon = document.getElementById("lfIcon");
			icon.style.filter = "saturate(1) brightness(1)";
			initCarousel();
			break;
		case "legacy_lambda_fortress_extended":
			resetIcons();
			icon = document.getElementById("lfIcon");
			icon.style.filter = "saturate(1) brightness(1)";
			break;
		case "the_espionage_project":
            topBarColor.style.borderColor = "#3a6be9";
			resetIcons();
			icon = document.getElementById("tepIcon");
			icon.style.filter = "saturate(1) brightness(1)";
			initCarousel();
			break;
		default:
			resetIcons();
			break;
	};
};

//makes browser back button work
window.addEventListener('popstate', function(event) {
    if (pageStack.length > 0) {
		firstLoad = true;
        const previousPage = pageStack.pop();
        loadPageContents(previousPage);
        playSound('./res/click.mp3');
        transitionScreen();
    }
});

function retreiveBlogList(){
	//for building blog lists
	let fullBlogList = {};
	if (document.getElementsByClassName("blogPostList")[0] != undefined){
		fetch("./blogs/bloglist.json")
		.then(response => response.json())
		.then(json => fullBlogList = json)
		.then(bruh => {buildBlogList()});
	};
	//what to do if
	function buildBlogList(){
		let postListElement = document.getElementsByClassName("blogPostList")[0];
		let blogType = postListElement.id;
		let blogTypeName = '';
		switch(blogType){
			case "dmcrList":
				blogTypeName = 'deathmatch_classic_refragged';
				break;
			case "llfeList":
				blogTypeName = 'legacy_lambda_fortress_extended';
				break;
			case "lfList":
				blogTypeName = 'lambda_fortress';
				break;
		};
		let totalPostCount = fullBlogList[blogTypeName].length;
		for (let i = 0; i <= totalPostCount -1; i++){
			let post = document.createElement("div");
			post.classList.add("postPreview");
			let thumbnail = document.createElement("img");
			thumbnail.src = fullBlogList[blogTypeName][i].thumbnailUrl;
			post.appendChild(thumbnail);
			let previewTextDiv = document.createElement("div");
			previewTextDiv.classList.add("postPreviewText");
			let title = document.createElement("h2");
			title.innerHTML = fullBlogList[blogTypeName][i].title;
			let postUrl = fullBlogList[blogTypeName][i].contentUrl;
			post.setAttribute('onclick', "loadPageContents('" + postUrl + "')");
			previewTextDiv.appendChild(title);
			let date = document.createElement("p");
			date.innerHTML = fullBlogList[blogTypeName][i].date;
			previewTextDiv.appendChild(date);
			let description = document.createElement("p");
			description.innerHTML = fullBlogList[blogTypeName][i].description;
			previewTextDiv.appendChild(description);
			post.appendChild(previewTextDiv);
			post.style.order = -i;
			postListElement.appendChild(post);
		};
	};
};


//image carousel
let totalImages = 0;
let currentImage = 0;
function initCarousel(){
	totalImages = document.getElementsByClassName("carouselImage").length;
	currentImage = 0;
	document.getElementsByClassName("carouselImage")[currentImage].id = "";
	document.getElementsByClassName("imageNumber")[0].innerHTML = "<p>" + [currentImage + 1] + "/" + totalImages + "</p>";
};
function nextImage(){
	playSound('./res/click2.mp3');
	let currentImageElement = document.getElementsByClassName("carouselImage")[currentImage];
	currentImageElement.id = "imageHidden";
	currentImage++;
	//loopback image using modulo
	currentImage = currentImage % totalImages;
	currentImageElement = document.getElementsByClassName("carouselImage")[currentImage];
	currentImageElement.id = "";
	document.getElementsByClassName("imageNumber")[0].innerHTML = "<p>" + [currentImage + 1] + "/" + totalImages + "</p>";
};
function previousImage(){
	playSound('./res/click2.mp3');
	let currentImageElement = document.getElementsByClassName("carouselImage")[currentImage];
	currentImageElement.id = "imageHidden";
	--currentImage;
	//loopback image with if statement
	if (currentImage < 0){
		currentImage = totalImages - 1;
	};
	currentImageElement = document.getElementsByClassName("carouselImage")[currentImage];
	currentImageElement.id = "";
	document.getElementsByClassName("imageNumber")[0].innerHTML = "<p>" + [currentImage + 1] + "/" + totalImages + "</p>";
};

//resets icon styles
function resetIcons(){
	dmcrIcon = document.getElementById("dmcrIcon");
	lfIcon = document.getElementById("lfIcon");
	tepIcon = document.getElementById("tepIcon");
	dmcrIcon.style.filter = "saturate(0) brightness(1.6)";
	lfIcon.style.filter = "saturate(0)";
	tepIcon.style.filter = "saturate(0)";
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
		  document.getElementsByClassName('constructionMessage')[0].style.top = '20px';
	  } else {
		  document.getElementsByClassName('topBar')[0].style.top = '0px';
		  document.getElementsByClassName('constructionMessage')[0].style.top = '200px';
	  };
	};
};


//cookie functions borrowed from boxkid.net

function writeCookie(name, property) {
    document.cookie = name + '=' + property + ';expires=Thu, 01 Jan 2030 00:00:00 GMT;path=/';
};

function readCookie(name) {
	if (document.cookie !== '') {
	    let allCookies = document.cookie.split('; ');
		let cookie = allCookies.find(row => row.startsWith(name + '='));
		if (cookie) {
			let cookieValue = cookie.split('=')[1];
			return cookieValue;
		} else {
			return false;
		};
	};
};
function deleteCookie(name) {
	document.cookie = name + '=' + ';expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'; 
}
function clearCookies() {
	let allCookies = document.cookie.split('; ');
	for (var i = 0; i < allCookies.length; i++) {
		deleteCookie(allCookies[i]);
	};
};
