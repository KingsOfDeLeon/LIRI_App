require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var divider = "\n------------------------------------------------------------\n\n";
var search = process.argv[2];
var term = process.argv.slice(3).join(" ");
var searchType;
//================================ Main function ==================================================

if (!search) {
    console.log("Please input one of the following commands: \n");
    console.log("concert-this" + "\n \t or");
    console.log("spotify-this-song" + "\n \t or");
    console.log("movie-this" + "\n \t or");
    console.log("do-what-it-says" + "\n");
    return;
}

if (search === "spotify-this-song") {
    console.log("Searching Spotify");
    if (term) {
        music(term);
    } else {
        console.log("No song was provided");
        console.log("Searching 'All The Small Things'");
        music('All The Small Things');
    }
} else if (search === 'movie-this') {
    console.log("Searching IMDB");
    if (term) {
        movie(term);
    } else {
        console.log("No movie was provided");
        console.log("Searching 'Mr. Nobody'");
        movie('Mr. Nobody');
    }
}
//================================  End Main function ==================================================

//================================ Spotify search ==================================================
function music(searchQuery) {


    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });

    spotify.search({
        type: 'track',
        query: searchQuery,
        // This will allow up to 3 results to return
        limit: 3 
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var jsonData = data.tracks;
        var musicData = [];
        searchType = "Spotify result: \n";


        //for loop handles creates an array of arrays, each element contains spotify information for a search result
        for (var i = 0; i < jsonData.items.length; i++) {

            //This loop grabs all the artists involved with the song and sticks them in one string
            var artistList = '';
            for (var j = 0; j < jsonData.items[i].artists.length; j++) {
                artistList += jsonData.items[i].artists[j].name;
                // If element isn't last/only element in the list, add a comma 
                if ((j + 1) < jsonData.items[i].artists.length) {
                    artistList += ', ';
                }
            }
            //Pushes all song information
            musicData.push(["Artists: " + artistList, "Song: " + jsonData.items[i].name, "Preview: " + jsonData.items[i].preview_url, "Album: " + jsonData.items[i].album.name]);
        }

        console.log("======= Found " + musicData.length + " items =======" + "\n");
        for (var i = 0; i < musicData.length; i++) {
            console.log(musicData[i].join('\n\n') + divider);
            fs.appendFile("log.txt", searchType + musicData[i].join('\n\n') + divider, function (err) {
                if (err) throw err;
                console.log("Successfully wrote results to log.txt!");
            });
        }
    });
}
//================================ End Spotify search ==================================================

//================================ Movie search ==================================================
function movie(searchQuery) {
    var URL = 'http://www.omdbapi.com/?apikey=trilogy&t=' + searchQuery
    axios.get(URL)
        .then(function (response) {
            searchType = "Movie result: \n";

            var jsonResults = response.data;
            //console.log(jsonResults);
            var movieResults = [];

            var title = jsonResults.Title;
            var release = jsonResults.Released
            var IMDBRating = jsonResults.Ratings[0];
            var RTRating = jsonResults.Ratings[1];
            var country = jsonResults.Country;
            var language = jsonResults.Language;
            var plot = jsonResults.Plot;
            var actors = jsonResults.Actors;

            movieResults.push("Title: " + title);
            movieResults.push("Release: " + release);
            movieResults.push("IMDB Rating: " + IMDBRating);
            movieResults.push("Rotten Tomatoes Rating: " + RTRating);
            movieResults.push("Country: " + country);
            movieResults.push("Languages " + language);
            movieResults.push("Plot: " + plot);
            movieResults.push("Actors: " + actors);
            console.log(movieResults.join('\n\n'));
            fs.appendFile("log.txt", searchType + movieResults.join('\n\n') + divider, function (err) {
                if (err) throw err;
                console.log("Successfully wrote results to log.txt!");
            });
        });
}
//================================ Movie search ==================================================