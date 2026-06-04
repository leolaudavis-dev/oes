import AlbumPage from "../AlbumPage";

export default function BlueShadesPage() {
  return (
    <AlbumPage
      artist="Blue Shades"
      album="squished rainbows!!!!"
      accent="#2f6fb5"
      cover="/friday/covers/blue-shades.png"
      released="released 2026 · after school music club"
      about="Recorded at The Oregon Episcopal School"
      tags={["after school", "beats", "demo"]}
      tracks={[
        { title: "squished rainbows!!!!", file: "squished rainbows!!!!.m4a" },
      ]}
    />
  );
}
