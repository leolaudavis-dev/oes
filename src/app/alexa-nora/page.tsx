import AlbumPage from "../AlbumPage";

export default function AlexaNoraPage() {
  return (
    <AlbumPage
      artist="Nora & Alexa"
      album="See My Vision"
      accent="#1aa83a"
      cover="/friday/covers/see-my-vision.png"
      released="released 2026 · after school music club"
      about="Recorded at The Oregon Episcopal School"
      tags={["after school", "beats", "demo"]}
      tracks={[
        { title: "dark times", file: "dark times.m4a" },
        { title: "heat wave", file: "heat wave .m4a" },
      ]}
    />
  );
}
