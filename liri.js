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
// if (args[0] == "do-what-it-says")
// 	args = resolveAction()
switch (args[0]) {
	case "my-tweets":
		myTweets();
		break;
	case "spotify-this-song":
		if(args.length == 2)
		spotifyThisSong(args[1]);
		else
			spotifyThisSong("The Sign");
		break;
	case "movie-this":
		movieThis();
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
		//console.log(JSON.stringify(data));
		var results = data.tracks.items;
		var i = 0;
		var found = false;
		// console.log(typeof results);
		while (i<results.length && !found){
			if (results[i].name.toUpperCase() == song.toUpperCase()){
				found = true;
				console.log("Artist Name: ", results[i].artists[0].name);
				console.log("Track Name: ", results[i].name);
				console.log("Preview: ", results[i].preview_url);
				console.log("Album: ", results[i].album.name);
			}
			else
				i++;
		}
		if (!found){
			console.log("No song found with that name! Reprhrase?");
		}
	});
}

function movieThis() {
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
		}

function outputToLog(command, outputText) {
			// fs to log.txt
		}

function resolveAction() {
			// Reads from Random.txt and determines what to do

			return resultArray
		}