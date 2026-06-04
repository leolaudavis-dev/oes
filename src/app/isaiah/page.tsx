import AlbumPage from "../AlbumPage";

export default function IsaiahPage() {
  return (
    <AlbumPage
      artist="Isaiah Rosenhouse"
      album="Futures of Dance"
      accent="#7a52b5"
      cover="/friday/covers/futures-of-dance.png"
      released="released 2026 · after school music club"
      about="Recorded at The Oregon Episcopal School"
      tags={["after school", "beats", "demo"]}
      tracks={[
        { title: "best thing ever", file: "Bestthingever.m4a" },
        { title: "sunrise beat", file: "sunrise beat.m4a" },
        { title: "7#", file: "7#.m4a" },
        { title: "reserved for dan", file: "reserved for dan.m4a" },
        { title: "merry christmas", file: "merry christmas.m4a" },
      ]}
    />
  );
}
