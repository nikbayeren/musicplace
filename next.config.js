/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src 'self' https://open.spotify.com https://www.youtube.com https://embed.music.apple.com https://w.soundcloud.com https://widget.deezer.com https://embed.tidal.com https://bandcamp.com;",
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
