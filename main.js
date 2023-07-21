const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let playlist = [];

app.post("/add-song", (req, res) => {
  const { title, artists, url } = req.body;
  if (!title || !artists || !url) {
    return res
      .status(400)
      .json({ error: "Title, Artists, and URL are required fields." });
  }

  const newSong = {
    title: title,
    artists: artists,
    url: url,
  };

  playlist.push(newSong);
  res.json({ message: "Song added to playlist successfully." });
});

app.get("/play-song", (req, res) => {
  const songIndex = req.query.index;
  if (
    !songIndex ||
    isNaN(songIndex) ||
    songIndex < 0 ||
    songIndex >= playlist.length
  ) {
    return res.status(400).json({ error: "Invalid song index." });
  }

  const songToPlay = playlist[songIndex];
  res.json({ message: "Playing song:", song: songToPlay });
});

app.get("/get-playlist", (req, res) => {
  res.json({ playlist: playlist });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
