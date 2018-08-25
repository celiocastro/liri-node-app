require("dotenv").config();
var keys = require("./keys");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require("request");
var fs = require("fs");



var client = new Twitter(keys.twitter);
var search = process.argv[2];

var spotify = new Spotify({
    id:keys.spotify.id,
    secret: keys.spotify.secret
});
var spotifySearch = process.argv[3] || "The Sign Ace of Base";

var movie = process.argv.slice(3).join(" ");

var command = function() {
if (search === "my-tweets") {
    console.log("showing latest tweets.");
    client.get('statuses/home_timeline', function (error, tweets, response) {
        if (error) throw error;
        var data = [];
        tweets.forEach((tweet) => {
            data = data.concat([
                "Author: " + tweet.user.name,
                "Created: " + tweet.created_at,
                "Text: " + tweet.text + "\r\n"]);
        });
        console.log(data.join("\r\n"));

    });
} else if (search === "spotify-this-song") {
    spotify
  .search({ type: 'track', query: spotifySearch })
  .then(function(res) {
    var artist =  "\nArtist: "+res.tracks.items[0].artists[0].name;
    var name =  "\nName: "+res.tracks.items[0].name;
    var album = "\nAlbum: "+res.tracks.items[0].album.name;
    var date = "\nDate: "+ res.tracks.items[0].album.release_date;
              console.log(artist,name,album,date);
    })
  .catch(function(err) {
    console.log(err.message);
  });
  
 
} else if (search === "movie-this") {
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    console.log(queryUrl);
     request(queryUrl, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var movieDb = JSON.parse(response.body);
        console.log("\nName: "+movieDb.Title+"\nRelease Year: " + movieDb.Year + "\nGenre: "+ movieDb.Genre);
      }
    });

} else if (search === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", (err, data) => {
        if (err) throw err;
        console.log(data);
      
    var res= data.split(",");
    search=res[0];
    spotifySearch=res[1];
    command();
});
} else {
    console.log("Sorry, I did not recognize that command.");
}
}

command();