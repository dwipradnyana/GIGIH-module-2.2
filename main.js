const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let playlist = [];

class Song {
  constructor(title, artists, url) {
    this.title = title;
    this.artists = artists;
    this.url = url;
    this.playCount = 0;
  }
}

class Playlist {
  static addSong(title, artists, url) {
    if (!title || !artists || !url) {
      throw new Error("Title, Artists, and URL are required fields.");
    }

    const newSong = new Song(title, artists, url);
    playlist.push(newSong);
  }

  static playSong(songIndex) {
    if (
      !songIndex ||
      isNaN(songIndex) ||
      songIndex < 0 ||
      songIndex >= playlist.length
    ) {
      throw new Error("Invalid song index.");
    }

    playlist[songIndex].playCount++;
    return playlist[songIndex];
  }

  static getPlaylist() {
    return playlist;
  }

  static getSortedPlaylistByPlayCount() {
    return playlist.slice().sort((a, b) => b.playCount - a.playCount);
  }
}

app.post("/add-song", (req, res) => {
  try {
    const { title, artists, url } = req.body;
    Playlist.addSong(title, artists, url);
    res.json({ message: "Song added to playlist successfully." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/play-song", (req, res) => {
  try {
    const songIndex = req.query.index;
    const songToPlay = Playlist.playSong(songIndex);
    res.json({ message: "Playing song:", song: songToPlay });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/get-playlist", (req, res) => {
  const playlist = Playlist.getPlaylist();
  res.json({ playlist: playlist });
});

app.get("/get-playlist/sorted-by-play-count", (req, res) => {
  const sortedPlaylist = Playlist.getSortedPlaylistByPlayCount();
  res.json({ playlist: sortedPlaylist });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
