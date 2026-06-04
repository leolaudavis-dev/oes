import AlbumPage from "../AlbumPage";

export default function IsaiahPage() {
  return (
    <AlbumPage
      artist="Leola Davis"
      album="Futures of Dance"
      accent="#7a52b5"
      cover="/friday/covers/futures-of-dance-zipdown.png"
      released="released 2026 · after school music club"
      about="Recorded at The Oregon Episcopal School"
      bio="ZipDown is truly underground. Isaiah Rosenhouse is the multidisciplinary artist from Portland, Oregon, behind the moniker ZipDown. His immersive soundscapes have been gracing audiences for nearly half a decade. Although the ukulele is Isaiah's first love, he is a prolific electronic music producer with a discography that teachers, parents, and music heads alike can enjoy. Drawing from genres such as dubstep, dance music, IDM, and R&B, Isaiah aims to prove that making music comes from the soul."
      tags={["after school", "beats", "demo"]}
      infoAudio="/friday/zip-down.m4a"
      infoAudioLabel="An interview with ZipDown"
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
