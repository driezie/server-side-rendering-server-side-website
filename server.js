import express from "express";
import fetchJson from "./helpers/fetch-json.js";
import bodyParser from 'body-parser'; // Importing bodyParser using ES module syntax

const apiUrl = "https://fdnd-agency.directus.app/items";
const app = express();

// Using bodyParser middleware to parse urlencoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Sets the view engine to ejs
app.set("view engine", "ejs");

// Sets the views directory to the /views folder [css, js, images]
app.set("views", "./views");

// Serve static files from the /public folder [ejs]
app.use(express.static("public"));



// Makes a GET route for the index page
app.get("/", function (request, response) {
  // Gets all the storys from the API
  fetchJson(apiUrl + "/tm_story").then((data) => {
    // Renders the index.ejs file from the views folder and passes the data from the FDND API
    response.render("index", { playlists: data.data });
  });
});


// Makes a GET route for the story page
app.get("/playlist/:slug", function (request, response) {
    // Gets the story with the id from the API
    fetchJson(apiUrl + '/tm_story?filter={"slug":"' + request.params.slug + '"}').then((data) => {
        // Renders the story.ejs file from the views folder and passes the data from the FDND API
        response.render("playlist", { playlist: data.data[0] });
        console.log(data.data[0]);
    });
});



// Stel het poortnummer in waar express op moet gaan luisteren
app.set("port", process.env.PORT || 8080);

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get("port"), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get("port")}`);
});