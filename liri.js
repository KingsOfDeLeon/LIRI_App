require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var divider = "\n------------------------------------------------------------\n\n";

var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

spotify.search({
    type: 'track',
    query: 'All the Small Things',
    limit: 5
}, function (err, data) {
    if (err) {
        return console.log('Error occurred: ' + err);
    }

    var jsonData = data.tracks;
    var musicData = [];


    //for loop handles creates an array of arrays, each element contains spotify information
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

    console.log("Found " + musicData.length + " items." + "\n");
    for (var i = 0; i < musicData.length; i++) {
        console.log(musicData[i].join('\n\n') + divider);
        fs.appendFile("log.txt", musicData[i].join('\n\n') + divider, function (err) {
            if (err) throw err;
            console.log("Successfully wrote results to log.txt!");
        });
    }
});