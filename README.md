#CoaXion Website "Documentation"

This read me is here to provide clarity to anyone making changes to this website, however it is mostly intended just for updating blogs.

Note that much of this is subject to change so parts of this can become outdated very easily. 

##Contents

[TOC]

##General Page Information

###Introduction

Okay so sorry if you have found yourself working on this website because I've constructed a monster. 
Basically, their is only one page which is your standard `index.html`. This page uses url queries to fetch other html files and inserts them into the page. By default, the page will redirect to `https://coaxion.games/?=home.html`, meaning that it will load the contents of `home.html` without actually reloading the whole page. This system introduces plenty of problems, but nothing actually matters at all if you really think about it.

###Page Loading Overview

On load, the function `loadPageContents()` is called with the variable `uri`. The uri variable is defined as anything after the equal sign in the url. The function checks if uri is one of the main page names. If it is, the corresponding html is fetched and inserted into the page html. If not, the function checks if the url contains a hyphen, which it will only contain if the url is for a blog article. The blog will be fetched in mostly the same way. If the url matches none of those, the url is updated to the default `https://coaxion.games/?=home.html` using the function `loadPageContents('home')`.

The function also calls `transitionScreen()` and `clickSound()` everytime unless it detects that this is the first load of the page.

###Adding New Pages

The name of a page should be clear (no shortened acronym) and be spaced with underscores.

*E.g. Example Page => example_page.html*

The name of the page needs to be added to the if statement in the `loadPageContents()` function. 

Normally, the contents of the hmtl will just be copied into the page, you can also set other changes for loading a specific page. This is currently used to update the look of the selected mod icon. Just add a case in `pageSpecificChanges()` to set up a specific page change. Note that you should make sure that these changes can be reset in some way when switching to another page. *Might need to make a better system for this if more changes are added*

The contents of the html should follow these guidlines:
- Text should be contatined in divs with the class of "infoCard"
- Generally, any other content should not have a width greater than 800px
- Check unorthodox content on various screen sizes for readability issues

Will proably add more guidelines when image stuff is made consistent.

##Blog Articles
Reviewing General Page Information may be helpful for understanding this section better.

###Naming and Organization

Blog articles are saved as individual html files. The directory `/blogs/` contains folders for each game. The blog articles are stored in the folder of the game they belong to. The names of the actual files are not super important, but they should stay neat and consitint with each other to avoid confusion. No names can be identical.

###Blog Lists

Blog articles can be listed in html by making a div with the class "blogPostList". This requires and id which should be the game that you want to display blog articles for. 

*E.g. <div class="blogPostList" id="dmcrList"></div>* 

The div is populated with information fetched from `/blogs/bloglist.json`. This list contains arrays of article information for each game. Each entry in the array corresponds to one blog article. Each entry should contain:

- **title** - A title for the article
- **description** - A short description that previews on the contents of the article
- **date** - A date in the format mm/dd/yy *might eventually be updated to be less america centric*
- **contentUrl** - A string made up as such: game_name-post_name *E.g. deathmatch_classic_refragged-development_update_1*
- **trueUrl** - The actual path of the article html *isn't really used for anything atm*
- **thumbnailUrl** - Url for a thumbnail that should be 120px by 90px (save in /res/blogImages/)

###Adding Blog Articles

Each blog article should be an individual html file. The file must be saved in the directory of the game it belongs to in `/blogs/`. The contents of the article need to be wrapped in a div with the id "articlecontent". 

`/blogs/bloglist.json` must be updated every time a new article is added. Add an object to the array of the game that the article belongs to. Ensure that all of the extra info is present. You can look at the file for examples. The most important key is "contentUrl" which actually allows the article to be linked.

If I have an article `example_blog_post.html` for the game `example_game`, the contentUrl should be the string: `example_game-example_blog_post`.

Article thumbnails should be saved in `res/blogImagages/` and be sized 120px by 90px.

If adding articles for a new game, make a new folder for it and make sure an array with the same name is created in the json file.

##Known Issues

Some of this stuff might just never get fixed if it isn't a big enough problem, but this list is nice to have regardless.

- Browser back button does not work
 - While navigating the website does push new urls into the search bar, the website doesn't keep it's own history, meaning that the back button doesn't work properly.
- Transition effect broken if user enters page too fast
 - Clicking into the page too fast causes the transition effect to stay visible forever. Not super sure where to start with fixing this one, but the transition effect is also one of the more janky things so whatever.
- Page loading can be further optimized
 - The current system checks if the page should be loaded based on the name, instead of just attempting to load it no matter what. The blog articles do not do this and it should technically be faster. Maybe the page loading should work in the same way.
