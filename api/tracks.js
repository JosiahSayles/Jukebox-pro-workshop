import express from "express";
const router = express.Router();
export default router;
import requireUser from "#middleware/requireUser";

import {
  getTracks,
  getTrackById,
  getPlaylistsByTrackId,
} from "#db/queries/tracks";

router.get("/", async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.get("/:id", async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");
  res.send(track);
});

router.get("/:id/playlists", requireUser, async (req, res) => {
  const trackId = req.params.id;
  // Ensure the track exists before returning playlists
  const track = await getTrackById(trackId);
  if (!track) return res.status(404).send("Track not found.");

  const playlist = await getPlaylistsByTrackId(trackId, req.user.id);
  res.status(200).send(playlist);
});
