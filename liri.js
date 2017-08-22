var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var Twitter = require('twitter');

var leng = Math.max((process.argv[1].lastIndexOf('\\') + 1), (process.argv[1].lastIndexOf('/') + 1))
var path = process.argv[1].slice(0, leng)
var args = process.argv;
args.shift();
args.shift();

// console.log(path);


//main execution

switch (args[0]) {
	case "do-what-it-says":
		resolveAction();
		break;
	case "my-tweets":
		myTweets();
		break;
	case "spotify-this-song":
		if (args.length == 2)
			spotifyThisSong(args[1]);
		else
			spotifyThisSong("The Sign");
		break;
	case "movie-this":
		if (args.length == 2)
			movieThis(args[1]);
		else
			movieThis("Mr. Nobody");
		break;
}

//do-what-it-says - pulls from file random.txt


function myTweets() {
	//This will show your last 20 tweets and when they were created at in your terminal/bash window.
	// request("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=TacochickenNode&count=20", function (error, response, body) {
	// console.log(keys);
	var client = new Twitter(keys.twitter);
	var params = { screen_name: 'nodejs' };
	client.get('statuses/home_timeline.json', params, function (error, tweets, response) {
		// console.log(error);
		// console.log(body);
		if (!error) {
			//var twweets = JSON.parse(tweets)
			tweets.forEach(function (element) {
				console.log("By @" + element.user.screen_name);
				console.log(element.text);
				console.log("--------------------------");
			}, this);
		}
	});
	// 	console.log(error);
	// 	console.log(JSON.parse(response));
	// 	if (!error && response.statusCode === 200) {

	// 		// Then log the body from the site!
	// 		console.log("body = " + body);
	// 		var bodyObject = JSON.parse(body);
	// 		console.log("Changed" + bodyObject);
	// 		//outputToLog("my-tweets",body);
	// 	}
	// });
}

function spotifyThisSong(song) {
	//Information about a song
	// This will show the following information about the song in your terminal/bash window

	// Artist(s)
	// The song's name
	// A preview link of the song from Spotify
	// The album that the song is from

	// if no song is provided then your program will default to

	// "The Sign" by Ace of Base
	// console.log("Entered Spotify");
	var Spotify = require('node-spotify-api');
	var spotify = new Spotify(keys.spotify);
	spotify.search({ type: 'track', query: song }, function (err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		}
		// console.log(JSON.stringify(data));
		var results = data.tracks.items;
		var i = 0;
		var found = false;
		// console.log(typeof results);
		while (i < results.length && !found) {
			if (results[i].name.toUpperCase() == song.toUpperCase()) {
				found = true;
				console.log("Artist Name: ", results[i].artists[0].name);
				console.log("Track Name: ", results[i].name);
				console.log("Preview: ", results[i].preview_url);
				console.log("Album: ", results[i].album.name);
			}
			else
				i++;
		}
		if (!found) {
			console.log("No song found with that name! Reprhrase?");
		}
	});
}

function movieThis(movie) {
	// This will output the following information to your terminal/bash window:

	//   * Title of the movie.
	//   * Year the movie came out.
	//   * IMDB Rating of the movie.
	//   * Country where the movie was produced.
	//   * Language of the movie.
	//   * Plot of the movie.
	//   * Actors in the movie.
	//   * Rotten Tomatoes URL.
	// If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

	// If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/
	// It's on Netflix!
	var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + keys.OMDB

	// This line is just to help us debug against the actual URL.
	//console.log(queryUrl);

	request(queryUrl, function (error, response, body) {

		// If the request is successful
		if (!error && response.statusCode === 200) {

			// Parse the body of the site and recover just the imdbRating
			// (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
			//console.log(body)
			var urlTitle = JSON.parse(body).Title.toLowerCase().replace(/ /g, "_").replace(/[^\w\s]/gi, '');
			//console.log(urlTitle)
			console.log("Title: " + JSON.parse(body).Title);
			console.log("Release Year: " + JSON.parse(body).Year);
			console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
			console.log("Country: " + JSON.parse(body).Country);
			console.log("Language: " + JSON.parse(body).Language);
			console.log("----------------------------------------------------");
			console.log("Plot: " + JSON.parse(body).Plot);
			console.log("Starring: " + JSON.parse(body).Actors);
			console.log("----------------------------------------------------");
			console.log("Rotten Tomatoes Review: https://www.rottentomatoes.com/m/" + urlTitle);
		}
	});

}

function outputToLog(command, outputText) {
	// fs to log.txt
}

function resolveAction() {
	// Reads from Random.txt and determines what to do
	fs.readFile(path + "random.txt", "utf8", function (error, data) {

		// If the code experiences any errors it will log the error to the console.
		if (error) {
			return console.log(error);
		}

		// We will then print the contents of data
		//   console.log(data);
		//   console.log(typeof data);
		// Then split it by commas (to make it more readable)
		var dataArr = data.split(",");

		// We will then re-display the content as an array for later use.
		console.log(dataArr);
		console.log(typeof dataArr);
		console.log(dataArr.length);

		 switch (dataArr[0]) {
			case "my-tweets":
				myTweets();
				break;
			case "spotify-this-song":
				if (dataArr.length == 2)
					spotifyThisSong(dataArr[1].replace(/['"]+/g, ''));
				else
					spotifyThisSong("The Sign");
				break;
			case "movie-this":
				if (dataArr.length == 2)
					movieThis(dataArr[1]);
				else
					movieThis("Mr. Nobody");
				break;
		}

	});
	// return resultArray
}