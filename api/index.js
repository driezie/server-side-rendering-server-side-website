// Import required modules
const path = require('path');
const express = require('express');
const fetch = require('node-fetch');

// Create Express app
const app = express();

// Configure view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Define API base URL
const apiUrl = "https://fdnd-agency.directus.app/items";

// Function to convert API response data
function dataConverter(request) {
  return request.data;
}

/*
  Define route for favicon.ico to prevent the browser from making an additional request for the favicon
*/
app.get('/favicon.ico', (req, res) => {
  res.status(204); // No content response
});

app.get('/', async (request, response) => {
  try {
    // Fetch story data and playlist data concurrently
    const [playlistData, StoriesData] = await Promise.all([
      fetch(apiUrl + '/tm_playlist').then(res => res.json()),
      fetch(apiUrl + '/tm_story').then(res => res.json()),
    ]);

    console.log(dataConverter(playlistData));
    console.log(dataConverter(StoriesData));

    // Render index page with fetched data
    response.render('index', {
      // playlist: dataConverter(playlistData),
      // stories: dataConverter(StoriesData),
    });

    
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
}
);

// Define route for homepage
app.get('/playlists', async (request, response) => {
  try {
    // Fetch story data and playlist data concurrently
    const [Data] = await Promise.all([
      fetch(apiUrl + '/tm_playlist').then(res => res.json()),
    ]);

    console.log(dataConverter(Data));

    // Render index page with fetched data
    response.render('playlists', {
      playlist: dataConverter(Data),
    });

    
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
});

// app.get('/stories', async (request, response) => {
//   try {
//     // Fetch story data and playlist data concurrently
//     const [StoriesData] = await Promise.all([
//       fetch(apiUrl + '/tm_story').then(res => res.json()),
//     ]);

//     console.log(dataConverter(StoriesData));

//     // Render index page with fetched data
//     response.render('stories', {
//       stories: dataConverter(StoriesData),
//     });

    
//   } catch (error) {
//     console.error(error);
//     response.status(500).send("Internal Server Error");
//   }
// });




// Define route for playlist page using the :slug
app.get('/:slug', async (request, response) => {
  try {
    const API = `${apiUrl}/tm_playlist?filter={"slug":"${request.params.slug}"}&fields=
    title,
    description,
    slug,
    
    stories.tm_story_id.title,
    stories.tm_story_id.summary,
    stories.tm_story_id.image,
    stories.tm_story_id.slug,

    language_id.language, 
    language_id.flag.id`;
    // Fetch playlist data and story data concurrently
    const [data] = await Promise.all([
      fetch(API).then(res => res.json()),
    ]);

    const dataFinal = dataConverter(data)




    console.log(dataFinal[0].stories);

    response.render('playlist', {
      playlist: dataFinal[0],
      stories: dataFinal[0].stories || [], // Handle the case when 'stories' is undefined
      language: dataFinal[0].language_id || [], // Handle the case when 'language' is undefined
    });
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
  
});

// Define route for story page using the :slug from the story and the slug from the playlist

app.get('/:playlistSlug/:storySlug', async (request, response) => {
  try {
    const API = `${apiUrl}/tm_story?filter={"slug":"${request.params.storySlug}"}&fields=title,description,slug,image,video,playlist.tm_playlist_id.title,playlist.tm_playlist_id.slug, playlist.tm_playlist_id.description,`;
    // Fetch story data and playlist data concurrently
    const [data] = await Promise.all([
      fetch(API).then(res => res.json()),
    ]);

    console.log(API);

    const dataFinal = dataConverter(data)

    console.log(dataFinal[0]);

    response.render('story', {
      story: dataFinal[0],
    });
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }

  
}

);


// Set port for the server
app.set("port", process.env.PORT || 8080);

// Start the server
app.listen(app.get("port"), () => {
  console.log(`Application started on http://localhost:${app.get("port")}`);
});

// Export the Express app
module.exports = app;
