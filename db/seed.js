import db from "#db/client";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user1 = await createUser("userNumberOne", "cupid123");
  const user2 = await createUser("userNumberTwo", "bear!");

  for (let i = 1; i <= 20; i++) {
    await createPlaylist(
      "Playlist " + i,
      "lorem ipsum playlist description",
      user1.id
    );
    await createTrack("Track " + i, i * 50000);
  }
  for (let i = 1; i <= 15; i++) {
    const playlistId = 1 + Math.floor(i / 2);
    await createPlaylistTrack(playlistId, i);
  }

  for (let i = 1; i <= 5; i++) {
    await createPlaylist(user1, "lorem lorem lorem", user1.id);
  }

  for (let i = 3; i <= 8; i++) {
    await createPlaylist(
      user2,
      "lorem lorem lorem more lorem more lorem",
      user2.id
    );
  }
}
