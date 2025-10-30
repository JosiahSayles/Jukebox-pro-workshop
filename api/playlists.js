import express from "express";
const router = express.Router();
export default router;

import requireUser from "#middleware/requireUser";
import {
  createPlaylist,
  getPlaylistById,
  getPlaylistByUserId,
} from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";

router.use(requireUser);

router.get("/", async (req, res) => {
  const playlists = await getPlaylistByUserId(req.user.id);
  res.send(playlists);
});

router.post("/", async (req, res) => {
  const { name, description } = req.body || {};
  if (!req.body) return res.status(400).send("Request body is required.");
  if (!name || !description)
    return res.status(400).send("Request body requires: name, description");
  const playlist = await createPlaylist(name, description, req.user.id);
  res.status(201).send(playlist);
});

router.param("id", async (req, res, next, id) => {
  const playlist = await getPlaylistById(id);
  if (!playlist) return res.status(404).send("Playlist not found.");
  req.playlist = playlist;
  next();
});

router.get("/:id", (req, res) => {
  if (req.user.id !== req.playlist.user_id) {
    return res.status(403).send("You are not authorized to view this playlist");
  }
  res.send(req.playlist);
});

router.get("/:id/tracks", async (req, res) => {
  if (req.user.id !== req.playlist.user_id) {
    return res.status(403).send("You are not authorized to view this track");
  }
  const tracks = await getTracksByPlaylistId(req.playlist.id);
  res.send(tracks);
});

router.post("/:id/tracks", async (req, res) => {
  if (!req.body) return res.status(400).send("Request body is required.");
  if (req.user.id !== req.playlist.user_id) {
    return res.status(403).send("You are not authorized to view this track");
  }
  const { trackId } = req.body;
  if (!trackId) return res.status(400).send("Request body requires: trackId");

  const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
  res.status(201).send(playlistTrack);
});
