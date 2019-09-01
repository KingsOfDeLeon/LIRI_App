require("dotenv").config();
let axios = require("axios");
let keys = require("./keys.js");
let fs = require("fs");
let Spotify = require('node-spotify-api');
let divider = "\n------------------------------------------------------------\n\n";
let search = process.argv[2];
let term = process.argv.slice(3).join(" ");
let searchType;
//================================ Main function ==================================================
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
} else if (search === 'concert-this') {
    console.log("Searching BandsInTown");
    if (term) {
        concert(term);
    } else {
        console.log("Please enter a band or event for this command.")
        return;
    }
} else if (search === 'do-what-it-says') {
    readFromFile();
} else {
    console.log("Please input one of the following commands: \n");
    console.log("concert-this" + "\n \t or");
    console.log("spotify-this-song" + "\n \t or");
    console.log("movie-this" + "\n \t or");
    console.log("do-what-it-says" + "\n");
    return;
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
        // This will allow up to a maximum of 3 results to return
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
//================================ End Movie search ==================================================

//================================ Concert search ==================================================
function concert(searchQuery) {
    var URL = "https://rest.bandsintown.com/artists/" + searchQuery + "/events?app_id=codingbootcamp"
    axios.get(URL)
        .then(function (response) {
            searchType = "Concert results: \n";

            var jsonResults = response.data;
            var concertResults = [];
            var venueName = '';
            var venueCityStateCountry = '';
            var date = '';

            //Only grabs a max of 4 instances events 
            var searchLimit;
            if (jsonResults.length > 4) {
                searchLimit = 4
            } else {
                searchLimit = jsonResults.length
            }


            for (var i = 0; i < searchLimit; i++) {
                var elementResults = [];
                venueName = jsonResults[i].venue.name;
                venueCityStateCountry = jsonResults[i].venue.city + ', ' + jsonResults[i].venue.region + ', ' + jsonResults[i].venue.country;
                date = jsonResults[i].datetime;
                elementResults.push(venueName);
                elementResults.push(venueCityStateCountry);
                elementResults.push(date);
                concertResults.push(elementResults);
            }
            for (var i = 0; i < concertResults.length; i++) {
                console.log(concertResults[i].join('\n\n') + divider);
                fs.appendFile("log.txt", searchType + concertResults[i].join('\n\n') + divider, function (err) {
                    if (err) throw err;
                    console.log("Successfully wrote results to log.txt!");
                });
            }
        });
}

//================================ End Concert search ==================================================

//================================ Read file search ==================================================
function readFromFile() {
    var data = '';
    var search = ''
    var term = ''
    var parseToken;

    var readStream = fs.createReadStream('random.txt', 'utf8');

    readStream.on('data', function (chunk) {
        data += chunk;
        console.log(data);
    }).on('end', function () {
        parseToken = data.indexOf(',');
        search = data.substring(0, parseToken);
        term = data.substring(parseToken + 1, data.length);


        //this should really be in a function and/or a switch statement but THE TIME CRUNCH IS REAL
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
        } else if (search === 'concert-this') {
            console.log("Searching BandsInTown");
            if (term) {
                concert(term);
            } else {
                console.log("Please enter a band or event for this command.")
                return;
            }
        } else if (search === 'do-what-it-says') {
            readFromFile();
        } else {
            console.log("Please input one of the following commands: \n");
            console.log("concert-this" + "\n \t or");
            console.log("spotify-this-song" + "\n \t or");
            console.log("movie-this" + "\n \t or");
            console.log("do-what-it-says" + "\n");
            return;
        }
    });
}
//================================ End Read file search ==================================================