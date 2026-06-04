import AlbumPage from "../AlbumPage";

export default function MilesPage() {
  return (
    <AlbumPage
      artist="Miles"
      album="The Even Funner Tracks"
      accent="#4a9a3f"
      cover="/friday/covers/miles-grieser.png"
      released="released 2026 · after school music club"
      about="Recorded at The Oregon Episcopal School"
      tags={["after school", "beats", "demo"]}
      tracks={[
        { title: "canyons", file: "Canyons.m4a" },
        { title: "awesomeness", file: "AWESOMENESS.m4a" },
        { title: "boop", file: "Boop.m4a" },
        { title: "waves", file: "waves - Original.m4a" },
      ]}
    />
  );
}
