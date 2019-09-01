# LIRI_App

LIRI is supposed to act as a _**L**anguage **I**nterpretationm and **R**ecognition **I**nterface_

Meaning it takes what you type it, and does an action based on what you type.

So far, **LIRI** only process 4 commands.

1. concert-this
    1. Displays the following information using the Bandsintown API:
        1. Name of the venue
        1. Venue location
        1. Date of the Event ( In "MM/DD/YYYY")
1. spotify-this-song
    1. Displays the following information using the Spotify API:
        1. Artist(s)
        1. The song's name
        1. A preview link of the song from Spotify
        1. The album that the song is from
1. movie-this
    1. Displays the following information using the OMDB Api:
        1. Title of the movie.
        1. Year the movie came out.
        1. IMDB Rating of the movie.
        1. Rotten Tomatoes Rating of the movie.
        1. Country where the movie was produced.
        1. Language of the movie.
        1. Plot of the movie.
        1. Actors in the movie.

1. do-what-it-says
    1. Reads in the contents of the random.txt file and processes accordingly.
    1. This function is currently built to only handle 1 line of text in the following format:
        1. [command],[searchString]
![Example](/images/logo.png)
Format: ![random.txt input example](url)

Not only will these commands display the appropriate responses on the console log, it will also write each search result to a log.txt file. found in the same directory.


**IMPORTANT**

If you clone this to your machine, user must create and populate their own .env file (within local directory) and populate it with a spotifyID and SecretKey.

To use within terminal, user must call "node liri.js [command] [searchTerm]"

If you run other commands or forget to supply a searchTerm, the app will either give you a gentle reminder to do so, or default to a preset search term.


