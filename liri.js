// LIRI Homework Assignment
// by Jason Mckinney
// 8/22/2017
//
// Impliments a node.js program to retrieve information for movies, music, or tweets 
// based on the arguments passed to the program
//----------------------------------------------------------------------------------

// Module require statements
var keys = require("./keys.js");	// my API Keys for security
var fs = require("fs");
var request = require("request");
var Twitter = require('twitter');

// Parsing the arguments
// Pulling Path of the liri.js - avoids filesystem problems
var leng = Math.max((process.argv[1].lastIndexOf('\\') + 1), (process.argv[1].lastIndexOf('/') + 1))
var path = process.argv[1].slice(0, leng)
// Pull the arguments from the process object into my own array disregarding the node.js and liri.js paths
var args = process.argv;
args.shift();
args.shift();

//main execution
if(args[0]=="do-what-it-says")
	resolveAction();
else
	mainExecute();

// mainExecute is a function that uses the global args that does the decision making
// that forwards the code to its repective function
function mainExecute(){
	// args should be in format {Command, [Search Term]}
	// so if the command is..
	switch (args[0]) {
		case "my-tweets":
			myTweets();	// get tweets
			break;
		case "spotify-this-song":
			if (args.length == 2)
				spotifyThisSong(args[1]);	// search for song
			else
				spotifyThisSong("Never Gonna Give You Up");	// retrieve Rickroll
			break;
		case "movie-this":
			if (args.length == 2)
				movieThis(args[1]);	// search for movie
			else
				movieThis("Mr. Nobody");	// why this movie? - Not a fan
			break;
	}
}
// myTweets function queries the Twitter API on my timeline and returns 20 tweets to the console
// This will show your last 20 tweets and when they were created at in your terminal/bash window
function myTweets() {
	// API Call
	var client = new Twitter(keys.twitter);
	var params = { screen_name: 'nodejs' };
	client.get('statuses/home_timeline.json', params, function (error, tweets, response) {
		// if there is NOT an error,
		if (!error) {
			// Parse the tweets
			tweets.forEach(function (element) {
				console.log("By @" + element.user.screen_name);
				console.log("On: " + element.created_at);
				console.log(element.text);
				console.log("--------------------------");
			}, this);
		}
	});
}

// spotifyThisSong function takes in a song title as a string, and displays information from the Spotify API

function spotifyThisSong(song) {
	//API Call
	var Spotify = require('node-spotify-api');
	var spotify = new Spotify(keys.spotify);
	spotify.search({ type: 'track', query: song }, function (err, data) {
		// if there is an error
		if (err) {
			// display error
			return console.log('Error occurred: ' + err);
		}
		// otherwise pull the tracks from the results
		var results = data.tracks.items;
		// iterate through the results looking for the exact match
		var i = 0;
		var found = false;
		// loop through the results, and stop either at the end, or if a match is found
		while (i < results.length && !found) {
			// if the name matches
			if (results[i].name.toUpperCase() == song.toUpperCase()) {	// to find a match, force the case
				// set found to escape loop
				found = true;
				// output!
				console.log("Artist Name: ", results[i].artists[0].name);
				console.log("Track Name: ", results[i].name);
				console.log("Preview: ", results[i].preview_url);
				console.log("Album: ", results[i].album.name);
			}
			else	// otherwise move to the next element in the array
				i++;
		}
		// if the array is exausted and no match found, 
		if (!found) {
			// Sorry!
			console.log("No song found with that name! Reprhrase?");
		}
	});
}

// movieThis takes a movie title as string and displays information about the movie from OMDB
function movieThis(movie) {
	// construct URL for API Call
	var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + keys.OMDB

	// API Call
	request(queryUrl, function (error, response, body) {
		// If the request is successful
		if (!error && response.statusCode === 200) {
			// pull the title and remove any spaces and special characters for assembly of Rotten Tomatoes URL
			var urlTitle = JSON.parse(body).Title.toLowerCase().replace(/ /g, "_").replace(/[^\w\s]/gi, '');
			// Display from response
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

// outputToLog is a function would have taken an object and wrote that to an logfile
function outputToLog(outputObject) {
	// fs to log.txt

}

// resolveAction is a function that reads the command from random.txt from the path of the liri.js and executes that command
function resolveAction() {
	// Reads from Random.txt and determines what to do
	fs.readFile(path + "random.txt", "utf8", function (error, data) {

		// If the code experiences any errors it will log the error to the console.
		if (error) {
			return console.log(error);
		}

		// Parse the data into what would have been the arguement array
		args = data.split(",");
		if (args.length == 2)
			args[1] = args[1].replace(/['"]+/g, '');	// Remove the "s from the string
		mainExecute();
	});
	// i wanted to return the arguments but due to async issues, decided against it
}

//KEYFILE SETUP - 
// module.exports = {
// 	twitter: {
// 	  consumer_key: <key>,
// 	  consumer_secret: <key>,
// 	  access_token_key: <key>,
// 	  access_token_secret: <key>
// 	},
// 	spotify: {
// 	  id: <key>,
// 		  secret: <key>
// 	},
// 	OMDB: <key>
//   }