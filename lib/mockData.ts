function pastDate(hoursAgo: number): string {
  return new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();
}

export type MediaType = "image" | "video";

export const mockUsers = [
  {
    name: "Ayşe", username: "ayse_music", bio: "Gece müziği. Şehir sesleri.",
    followers: 284, following: 61,
    profileBackground: "linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 40%, #16213e 70%, #0d2818 100%)" as string,
    musicWill: {
      title: "Street Spirit (Fade Out)", artist: "Radiohead",
      cover: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=4pSzhZ76GdM",
      note: "Gözlerimi kapatırken bu şarkı çalsın.",
    },
  },
  { name: "Zeynep", username: "zeynep_vibes",   bio: "Pop seviyorum, utanmıyorum.",          followers: 198, following: 44, profileBackground: "linear-gradient(135deg, #1a0a0a 0%, #2d1b1b 50%, #1a1a2e 100%)" as string },
  { name: "Deniz",  username: "deniz_ocean",    bio: "R&B ve soul. Duygusal playlist uzmanı.", followers: 377, following: 89, profileBackground: "linear-gradient(180deg, #0a1628 0%, #0d2137 40%, #132a42 100%)" as string },
  { name: "Emre",   username: "emre_bass",      bio: "Funk & groove. Bass her şeydir.",        followers: 143, following: 57, profileBackground: "linear-gradient(135deg, #1a0a14 0%, #2d1b26 50%, #1a1a2e 100%)" as string },
  {
    name: "Can", username: "can_indie", bio: "Alternatif & indie. Konser bağımlısı.",
    followers: 512, following: 130,
    profileBackground: "linear-gradient(180deg, #0a1628 0%, #0d2137 50%, #132a42 100%)" as string,
    musicWill: {
      title: "I Will Follow You into the Dark", artist: "Death Cab for Cutie",
      cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=NDHY1D0tKRA",
      note: "Başka bir şey seçemezdim.",
    },
  },
  {
    name: "Selin", username: "selin_nocturne", bio: "Dream pop ve shoegaze. Sis ve reverb.",
    followers: 631, following: 112,
    profileBackground: "linear-gradient(180deg, #1e1e2e 0%, #2a2a3e 50%, #1a1a2e 100%)" as string,
    musicWill: {
      title: "How Soon Is Now?", artist: "The Smiths",
      cover: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=sKFNFalPFgs",
      note: "Bu şarkı her şeyi özetliyor.",
    },
  },
];

// Benim takip ettiklerim (ayse_music'in followings)
export const mockFollowing = new Set(["can_indie", "selin_nocturne"]);

export const mockPosts = [
  // ── ZEYNEP ──
  {
    id: "1",
    user: mockUsers[2],
    song: {
      title: "Blinding Lights",
      artist: "The Weeknd",
      cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=4NRXx6U8ABQ",
    },
    media: undefined,
    note: "Bu şarkı bitmez. Bir yerde her zaman çalıyor.",
    clip: { start: 65, end: 125 },
    vibe: ["Synth-pop", "R&B"],
    resonance: 41,
    createdAt: pastDate(1),
  },
  {
    id: "2",
    user: mockUsers[2],
    song: {
      title: "Anti-Hero",
      artist: "Taylor Swift",
      cover: "https://images.unsplash.com/photo-1484876065-d986f12610ef?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=b1kbLwvqugk",
    },
    media: {
      type: "image" as MediaType,
      url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=800&fit=crop",
    },
    vibe: ["Pop", "Indie Pop"],
    resonance: 58,
    createdAt: pastDate(6),
  },
  {
    id: "3",
    user: mockUsers[2],
    song: {
      title: "Levitating",
      artist: "Dua Lipa",
      cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=TUVcZfQe-Kw",
    },
    media: undefined,
    vibe: ["Pop", "Dance"],
    resonance: 34,
    createdAt: pastDate(40),
  },

  // ── CAN ──
  {
    id: "4",
    user: mockUsers[1],
    song: {
      title: "Do I Wanna Know?",
      artist: "Arctic Monkeys",
      cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=bpOSxM0rNPM",
    },
    media: {
      type: "image" as MediaType,
      url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=800&fit=crop",
    },
    note: "Konser beklentisiyle dinliyorum. 3 ay kaldı.",
    clip: { start: 30, end: 90 },
    vibe: ["Indie Rock", "Alternative"],
    resonance: 62,
    createdAt: pastDate(2),
  },
  {
    id: "5",
    user: mockUsers[1],
    song: {
      title: "The Less I Know The Better",
      artist: "Tame Impala",
      cover: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=2SUwOgTvvs4",
    },
    media: {
      type: "video" as MediaType,
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    },
    vibe: ["Psychedelic", "Indie"],
    resonance: 77,
    createdAt: pastDate(18),
  },
  {
    id: "6",
    user: mockUsers[1],
    song: {
      title: "Heat Waves",
      artist: "Glass Animals",
      cover: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=mRD0-GxqHVo",
    },
    media: undefined,
    vibe: ["Indie Pop", "Dream Pop"],
    resonance: 49,
    createdAt: pastDate(30),
  },

  // ── AYŞE ──
  {
    id: "7",
    user: mockUsers[0],
    song: {
      title: "As It Was",
      artist: "Harry Styles",
      cover: "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=H5v3kku4y6Q",
    },
    media: {
      type: "image" as MediaType,
      url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&h=800&fit=crop",
    },
    vibe: ["Pop", "Indie Pop"],
    resonance: 23,
    createdAt: pastDate(5),
  },
  {
    id: "8",
    user: mockUsers[0],
    song: {
      title: "bad guy",
      artist: "Billie Eilish",
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=DyDfgMOUjCI",
    },
    media: undefined,
    vibe: ["Pop", "Alternative"],
    resonance: 31,
    createdAt: pastDate(10),
  },
  {
    id: "9",
    user: mockUsers[0],
    song: {
      title: "Electric Feel",
      artist: "MGMT",
      cover: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=MmZexg8sxyk",
    },
    media: {
      type: "video" as MediaType,
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    },
    vibe: ["Psychedelic", "Electronic"],
    resonance: 19,
    createdAt: pastDate(28),
  },

  // ── DENİZ ──
  {
    id: "10",
    user: mockUsers[3],
    song: {
      title: "Kill Bill",
      artist: "SZA",
      cover: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=FNng9kuNDfY",
    },
    media: {
      type: "image" as MediaType,
      url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop",
    },
    clip: { start: 50, end: 110 },
    vibe: ["R&B", "Alternative R&B"],
    resonance: 44,
    createdAt: pastDate(3),
  },
  {
    id: "11",
    user: mockUsers[3],
    song: {
      title: "Redbone",
      artist: "Childish Gambino",
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=Kp7eSUU9oy8",
    },
    media: undefined,
    vibe: ["R&B", "Neo Soul"],
    resonance: 67,
    createdAt: pastDate(14),
  },
  {
    id: "12",
    user: mockUsers[3],
    song: {
      title: "drivers license",
      artist: "Olivia Rodrigo",
      cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=ZmDBbnmKpqQ",
    },
    media: undefined,
    vibe: ["Pop", "Indie Pop"],
    resonance: 29,
    createdAt: pastDate(22),
  },

  // ── EMRE ──
  {
    id: "13",
    user: mockUsers[4],
    song: {
      title: "HUMBLE.",
      artist: "Kendrick Lamar",
      cover: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=tvTRZJ-4EyI",
    },
    media: {
      type: "image" as MediaType,
      url: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=800&fit=crop",
    },
    clip: { start: 20, end: 80 },
    vibe: ["Hip-Hop", "Rap"],
    resonance: 88,
    createdAt: pastDate(4),
  },
  {
    id: "14",
    user: mockUsers[4],
    song: {
      title: "This Is America",
      artist: "Childish Gambino",
      cover: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=kGCuaFlBFPw",
    },
    media: undefined,
    vibe: ["Hip-Hop", "R&B"],
    resonance: 72,
    createdAt: pastDate(36),
  },
  {
    id: "15",
    user: mockUsers[4],
    song: {
      title: "God's Plan",
      artist: "Drake",
      cover: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=xpVfcZ0ZcFM",
    },
    media: undefined,
    vibe: ["Hip-Hop", "Rap"],
    resonance: 53,
    createdAt: pastDate(44),
  },

  // ── SELİN ──
  {
    id: "16",
    user: mockUsers[5],
    song: {
      title: "Lucid Dreams",
      artist: "Juice WRLD",
      cover: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=mzB1VGEGcSU",
    },
    media: {
      type: "image" as MediaType,
      url: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800&h=800&fit=crop",
    },
    vibe: ["Hip-Hop", "Emo Rap"],
    resonance: 36,
    createdAt: pastDate(8),
  },
  {
    id: "17",
    user: mockUsers[5],
    song: {
      title: "Circles",
      artist: "Post Malone",
      cover: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=wXhTHyIgQ_U",
    },
    media: undefined,
    vibe: ["Pop", "Alternative"],
    resonance: 25,
    createdAt: pastDate(20),
  },

  // ── Spotify örnekleri ──
  {
    id: "18",
    user: mockUsers[0],
    song: {
      title: "Watermelon Sugar",
      artist: "Harry Styles",
      cover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
      spotifyUrl: "https://open.spotify.com/track/6UelLqGlWMcVH1E5c4H7lY",
    },
    media: {
      type: "image" as MediaType,
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=800&fit=crop",
    },
    vibe: ["Pop", "Indie Pop"],
    resonance: 37,
    createdAt: pastDate(7),
  },

  // ── SoundCloud örneği ──
  {
    id: "20",
    user: mockUsers[4],
    song: {
      title: "Pursuit of Happiness",
      artist: "Kid Cudi",
      cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&h=600&fit=crop",
      spotifyUrl: "https://soundcloud.com/kidcudi/pursuit-of-happiness",
    },
    media: {
      type: "image" as MediaType,
      url: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&h=800&fit=crop",
    },
    vibe: ["Hip-Hop"],
    resonance: 18,
    createdAt: pastDate(26),
  },

  // ── Deezer örneği ──
  {
    id: "21",
    user: mockUsers[1],
    song: {
      title: "Get Lucky",
      artist: "Daft Punk ft. Pharrell Williams",
      cover: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.deezer.com/track/67238732",
    },
    media: {
      type: "image" as MediaType,
      url: "https://images.unsplash.com/photo-1540039155733-5bb30b4f40f8?w=800&h=800&fit=crop",
    },
    vibe: ["Electronic", "Funk"],
    resonance: 33,
    createdAt: pastDate(48),
  },

  // ── Çok kişi paylaşan şarkılar ──────────────────────────────

  // Blinding Lights → Zeynep (id:1) + Can + Selin
  {
    id: "22",
    user: mockUsers[1], // Can
    song: {
      title: "Blinding Lights",
      artist: "The Weeknd",
      cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=4NRXx6U8ABQ",
    },
    media: {
      type: "image" as MediaType,
      url: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&h=800&fit=crop",
    },
    note: "Gece arabasında sürücüden önce bu çalar. Hep.",
    vibe: ["Synth-pop", "R&B"],
    resonance: 55,
    createdAt: pastDate(3),
  },
  {
    id: "23",
    user: mockUsers[5], // Selin
    song: {
      title: "Blinding Lights",
      artist: "The Weeknd",
      cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=4NRXx6U8ABQ",
    },
    media: undefined,
    note: "80'ler retrosu bu kadar iyi yapılır işte.",
    vibe: ["Synth-pop", "R&B"],
    resonance: 28,
    createdAt: pastDate(9),
  },

  // Redbone → Deniz (id:11) + Selin
  {
    id: "24",
    user: mockUsers[5], // Selin
    song: {
      title: "Redbone",
      artist: "Childish Gambino",
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=600&fit=crop",
      spotifyUrl: "https://open.spotify.com/track/0wXuerDYiBnERgIpbb3JBR",
    },
    media: {
      type: "image" as MediaType,
      url: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800&h=800&fit=crop",
    },
    note: "Donald Glover ne kadar çok şeyi aynı anda yapabiliyor.",
    vibe: ["R&B", "Neo Soul"],
    resonance: 45,
    createdAt: pastDate(12),
  },

  // Do I Wanna Know? → Can (id:4) + Zeynep
  {
    id: "25",
    user: mockUsers[2], // Zeynep
    song: {
      title: "Do I Wanna Know?",
      artist: "Arctic Monkeys",
      cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=bpOSxM0rNPM",
    },
    media: undefined,
    note: "Pop dinliyorum ama bu şarkıya dayanamıyorum.",
    vibe: ["Indie Rock", "Alternative"],
    resonance: 39,
    createdAt: pastDate(6),
  },

  // As It Was → Ayşe (id:7) + Deniz + Emre
  {
    id: "26",
    user: mockUsers[3], // Deniz
    song: {
      title: "As It Was",
      artist: "Harry Styles",
      cover: "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=H5v3kku4y6Q",
    },
    media: {
      type: "image" as MediaType,
      url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop",
    },
    note: "Melankolik ama dans ettirio. Çelişki bu.",
    vibe: ["Pop", "Indie Pop"],
    resonance: 42,
    createdAt: pastDate(4),
  },
  {
    id: "27",
    user: mockUsers[4], // Emre
    song: {
      title: "As It Was",
      artist: "Harry Styles",
      cover: "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=H5v3kku4y6Q",
    },
    media: undefined,
    note: "Harry Styles'ı seveceğimi düşünmezdim ama işte.",
    vibe: ["Pop", "Indie Pop"],
    resonance: 17,
    createdAt: pastDate(15),
  },

  // Heat Waves → Can (id:6) + Ayşe
  {
    id: "28",
    user: mockUsers[0], // Ayşe
    song: {
      title: "Heat Waves",
      artist: "Glass Animals",
      cover: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=mRD0-GxqHVo",
    },
    media: {
      type: "image" as MediaType,
      url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&h=800&fit=crop",
    },
    note: "Yaz sonu hissi. Tam bu.",
    vibe: ["Indie Pop", "Dream Pop"],
    resonance: 31,
    createdAt: pastDate(20),
  },
];

// ── Yorumlar ──────────────────────────────────────────────────
export interface MockComment {
  id: string;
  postId: string;
  user: typeof mockUsers[0];
  text: string;
  createdAt: string;
}

export const mockComments: MockComment[] = [
  { id: "c1",  postId: "1",  user: mockUsers[1], text: "Bu şarkı başka ya, nasıl bu kadar iyi olur",       createdAt: pastDate(0.3) },
  { id: "c2",  postId: "1",  user: mockUsers[3], text: "Klasik Weeknd. Geçmez.",                            createdAt: pastDate(0.5) },
  { id: "c3",  postId: "2",  user: mockUsers[0], text: "Anti-Hero bu hafta aklımdan çıkmıyor",              createdAt: pastDate(1.0) },
  { id: "c4",  postId: "2",  user: mockUsers[4], text: "Taylor'ın en iyi şarkısı bence",                   createdAt: pastDate(0.8) },
  { id: "c5",  postId: "4",  user: mockUsers[0], text: "Do I Wanna Know canlıda daha iyi ama yine de ❤️",  createdAt: pastDate(0.2) },
  { id: "c6",  postId: "4",  user: mockUsers[4], text: "Arctic Monkeys zirve",                              createdAt: pastDate(0.4) },
  { id: "c7",  postId: "7",  user: mockUsers[2], text: "Harry Styles şu an zirve benim için",               createdAt: pastDate(2.0) },
  { id: "c8",  postId: "10", user: mockUsers[5], text: "SZA her şeydir",                                    createdAt: pastDate(0.1) },
  { id: "c9",  postId: "13", user: mockUsers[2], text: "HUMBLE. hâlâ tavan, geçmiyor",                     createdAt: pastDate(3.0) },
  { id: "c10", postId: "13", user: mockUsers[3], text: "Kendrick dönem tanımlar",                           createdAt: pastDate(2.5) },
  { id: "c11", postId: "5",  user: mockUsers[2], text: "Tame Impala'yı ilk dinleyişte anlamak mümkün değil", createdAt: pastDate(10) },
  { id: "c12", postId: "11", user: mockUsers[1], text: "Redbone yavaş dinlenilir, sabah sabah değil",       createdAt: pastDate(5.0) },
  { id: "c13", postId: "22", user: mockUsers[3], text: "Gece arabası + Blinding Lights = sinema sahnesi",   createdAt: pastDate(1.0) },
  { id: "c14", postId: "22", user: mockUsers[5], text: "Bu şarkıyı ben de paylaştım zaten haha",            createdAt: pastDate(0.5) },
  { id: "c15", postId: "25", user: mockUsers[1], text: "Zeynep AM dinliyor, dünya bitti 😄",                createdAt: pastDate(0.3) },
  { id: "c16", postId: "26", user: mockUsers[0], text: "Harry Styles böyle şarkılar yazıyor ya, inanılmaz", createdAt: pastDate(1.5) },
  { id: "c17", postId: "26", user: mockUsers[2], text: "Melankolik dans, tam tarif",                        createdAt: pastDate(0.8) },
  { id: "c18", postId: "24", user: mockUsers[3], text: "Bu albümde ne var ne yok, her şey var",             createdAt: pastDate(4.0) },
];

// ── DM Konuşmaları ────────────────────────────────────────────
export interface DmMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  withUser: typeof mockUsers[0];
  messages: DmMessage[];
}

const ME = mockUsers[0]; // Giriş yapan kullanıcı: Ayşe

export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    withUser: mockUsers[1], // Can
    messages: [
      { id: "m1", senderId: mockUsers[1].username, text: "Electric Feel'i az önce gördüm profilinde 🔥",  createdAt: pastDate(2.0) },
      { id: "m2", senderId: ME.username,            text: "MGMT klasik, paylaşmadan duramadım 😄",         createdAt: pastDate(1.9) },
      { id: "m3", senderId: mockUsers[1].username, text: "Do I Wanna Know da çok iyi btw",                createdAt: pastDate(1.5) },
      { id: "m4", senderId: ME.username,            text: "Arctic Monkeys canlıda başka bir şey oluyor",  createdAt: pastDate(1.2) },
    ],
  },
  {
    id: "conv2",
    withUser: mockUsers[2], // Zeynep
    messages: [
      { id: "m5", senderId: mockUsers[2].username, text: "Anti-Hero paylaşımını gördüm",                  createdAt: pastDate(5.0) },
      { id: "m6", senderId: ME.username,           text: "Taylor'ı sevmesen de bu şarkı farklı 😄",       createdAt: pastDate(4.9) },
      { id: "m7", senderId: mockUsers[2].username, text: "Haklısın sanırım haha",                         createdAt: pastDate(4.5) },
    ],
  },
  {
    id: "conv3",
    withUser: mockUsers[3], // Deniz
    messages: [
      { id: "m8",  senderId: mockUsers[3].username, text: "Redbone'u sen de seviyorsun demek",            createdAt: pastDate(10) },
      { id: "m9",  senderId: ME.username,           text: "Childish Gambino her şeydir",                  createdAt: pastDate(9.8) },
      { id: "m10", senderId: mockUsers[3].username, text: "Kill Bill'i dinledin mi?",                     createdAt: pastDate(9.5) },
      { id: "m11", senderId: ME.username,           text: "SZA'yı yeni keşfettim sanki 😍",               createdAt: pastDate(9.0) },
    ],
  },
];

export { ME };

// ── Koleksiyonlar ─────────────────────────────────────────────
export interface ImportedSong {
  title: string;
  artist: string;
  cover?: string;
  url?: string;
}

export interface Collection {
  id: string;
  userId: string;
  title: string;
  description?: string;
  postIds: string[];
  importedSongs?: ImportedSong[];
  createdAt: string;
  sourceUrl?: string;
  sourcePlatform?: string;
  cover?: string;
}

export const mockCollections: Collection[] = [
  { id: "col1", userId: "ayse_music",   title: "Gece Playlistim",   description: "Geç saatlerde, sessiz odada", postIds: ["1", "8", "9"],   createdAt: pastDate(24), sourceUrl: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd", sourcePlatform: "spotify" },
  { id: "col2", userId: "ayse_music",   title: "Psychedelic Moods", description: "Zihin açıcı",                postIds: ["9", "18"],        createdAt: pastDate(72), sourceUrl: "https://music.apple.com/tr/playlist/a-list-alternative/pl.5ee8333dbe944d9f9151e97d92d3ebe0", sourcePlatform: "appleMusic" },
  { id: "col3", userId: "can_indie",    title: "Konser Öncesi",     description: "Hazırlanırken çalanlar",     postIds: ["4", "5", "6"],  createdAt: pastDate(10) },
  { id: "col4", userId: "zeynep_vibes", title: "Pop Favorilerim",   description: undefined,                    postIds: ["1", "2", "3"],  createdAt: pastDate(48), sourceUrl: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M", sourcePlatform: "spotify" },
  { id: "col5", userId: "deniz_ocean",  title: "Soul & R&B",        description: "Duygusal anların sesi",      postIds: ["10", "11", "12"], createdAt: pastDate(30) },
];

// ── Müzik uyumu hesaplama ─────────────────────────────────────
type PostItem = { song: { title: string; artist: string }; vibe: string[] };

export function calcCompatibility(posts1: PostItem[], posts2: PostItem[]): number {
  if (!posts1.length || !posts2.length) return 0;

  const genres1 = new Set(posts1.flatMap((p) => p.vibe));
  const genres2 = new Set(posts2.flatMap((p) => p.vibe));
  const songs1  = new Set(posts1.map((p) => `${p.song.title}||${p.song.artist}`));
  const songs2  = new Set(posts2.map((p) => `${p.song.title}||${p.song.artist}`));

  const genreIntersect = [...genres1].filter((g) => genres2.has(g)).length;
  const genreUnion     = new Set([...genres1, ...genres2]).size;
  const genreScore     = genreUnion > 0 ? genreIntersect / genreUnion : 0;

  const songIntersect  = [...songs1].filter((s) => songs2.has(s)).length;
  const songUnion      = new Set([...songs1, ...songs2]).size;
  const songScore      = songUnion > 0 ? songIntersect / songUnion : 0;

  return Math.round((genreScore * 0.65 + songScore * 0.35) * 100);
}

// ── Anonim şarkı bırakma ──────────────────────────────────────
export interface AnonymousDrop {
  id: string;
  toUsername: string;
  song: { title: string; artist: string; cover?: string; spotifyUrl?: string };
  createdAt: string;
}

export const mockAnonymousDrops: AnonymousDrop[] = [
  {
    id: "drop1", toUsername: "ayse_music",
    song: { title: "Creep", artist: "Radiohead",
      cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=XFkzRNyygfk" },
    createdAt: pastDate(3),
  },
  {
    id: "drop2", toUsername: "ayse_music",
    song: { title: "Breathe (2 AM)", artist: "Anna Nalick",
      cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=QzLKa76Ii8E" },
    createdAt: pastDate(4),
  },
  {
    id: "drop3", toUsername: "ayse_music",
    song: { title: "Hurt", artist: "Nine Inch Nails",
      cover: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=600&h=600&fit=crop",
      spotifyUrl: "https://www.youtube.com/watch?v=u1xrNaTO1bI" },
    createdAt: pastDate(5),
  },
];

// ── Bildirimler ───────────────────────────────────────────────
export type NotifType = "follow" | "reshare" | "comment" | "drop" | "like";

export interface Notification {
  id: string;
  type: NotifType;
  fromUser: { name: string; username: string };
  postTitle?: string;
  read: boolean;
  createdAt: string;
}

export const mockNotifications: Notification[] = [
  { id: "ntf1", type: "follow",  fromUser: mockUsers[1], message: "", read: false, createdAt: pastDate(1) },
  { id: "ntf2", type: "reshare", fromUser: mockUsers[3], postTitle: "Blinding Lights",    read: false, createdAt: pastDate(2) },
  { id: "ntf3", type: "comment", fromUser: mockUsers[4], postTitle: "Anti-Hero",           read: false, createdAt: pastDate(3) },
  { id: "ntf4", type: "drop",    fromUser: { name: "Anonim", username: "?" },              read: false, createdAt: pastDate(4) },
  { id: "ntf5", type: "like",    fromUser: mockUsers[5], postTitle: "Levitating",          read: true,  createdAt: pastDate(6) },
  { id: "ntf6", type: "follow",  fromUser: mockUsers[2],                                   read: true,  createdAt: pastDate(10) },
  { id: "ntf7", type: "reshare", fromUser: mockUsers[1], postTitle: "Street Spirit",       read: true,  createdAt: pastDate(20) },
] as any;

// ── Yasaklılar mock (profil Yasaklılar sekmesi) ─────────────────
export interface BannedEntryMock {
  id: string;
  title: string;
  artist: string;
  cover?: string;
  link?: string;
  createdAt: string;
}

export const mockBannedSongs: BannedEntryMock[] = [
  {
    id: "ban_mock_1",
    title: "Shape of You",
    artist: "Ed Sheeran",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop",
    link: "https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3",
    createdAt: pastDate(48),
  },
  {
    id: "ban_mock_2",
    title: "Despacito",
    artist: "Luis Fonsi",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
    link: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    createdAt: pastDate(72),
  },
  {
    id: "ban_mock_3",
    title: "Someone Like You",
    artist: "Adele",
    cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop",
    link: "https://open.spotify.com/track/1zwMYTA5nlNjZxYrvBB2pV",
    createdAt: pastDate(120),
  },
];

// Yasaklı isimler (dinlemek istemediğin isimler — "sanatçı" demiyoruz)
export interface BannedNameMock {
  id: string;
  name: string;
  createdAt: string;
}

export const mockBannedNames: BannedNameMock[] = [
  { id: "name_mock_1", name: "Justin Bieber", createdAt: pastDate(24) },
  { id: "name_mock_2", name: "DJ Khaled", createdAt: pastDate(96) },
  { id: "name_mock_3", name: "İbrahim Tatlıses", createdAt: pastDate(168) },
];

// ── Şarkı slug yardımcısı ─────────────────────────────────────
export function songSlug(title: string, artist: string): string {
  return encodeURIComponent(`${title}__${artist}`);
}

export function parseSongSlug(slug: string): { title: string; artist: string } {
  const decoded = decodeURIComponent(slug);
  const idx = decoded.indexOf("__");
  if (idx === -1) return { title: decoded, artist: "" };
  return { title: decoded.slice(0, idx), artist: decoded.slice(idx + 2) };
}

// ── Şarkı kavgası (24 saat, topluluk oyu) ───────────────────────
export interface SongBattle {
  id: string;
  songA: { title: string; artist: string; cover?: string };
  songB: { title: string; artist: string; cover?: string };
  startAt: string; // ISO
  endAt: string;   // ISO, 24 saat sonra
  votesA: number;
  votesB: number;
}

export const mockBattles: SongBattle[] = [
  {
    id: "b1",
    songA: { title: "Blinding Lights", artist: "The Weeknd", cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop" },
    songB: { title: "Thinkin Bout You", artist: "Frank Ocean", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop" },
    startAt: pastDate(2),
    endAt:   new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 saat sonra biter (aktif)
    votesA: 42,
    votesB: 38,
  },
  {
    id: "b2",
    songA: { title: "Anti-Hero", artist: "Taylor Swift", cover: "https://images.unsplash.com/photo-1484876065-d986f12610ef?w=400&h=400&fit=crop" },
    songB: { title: "Levitating", artist: "Dua Lipa", cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop" },
    startAt: pastDate(48),
    endAt:   pastDate(24), // bitmiş
    votesA: 61,
    votesB: 89,
  },
  {
    id: "b3",
    songA: { title: "Creep", artist: "Radiohead", cover: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=400&fit=crop" },
    songB: { title: "Breathe (2 AM)", artist: "Anna Nalick", cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=400&fit=crop" },
    startAt: pastDate(1),
    endAt:   new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
    votesA: 28,
    votesB: 31,
  },
];
