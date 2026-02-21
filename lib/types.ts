export interface User {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
}

export interface Song {
  title: string;
  artist: string;
  album?: string;
  cover?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
}

export interface Post {
  id: string;
  user: User;
  song: Song;
  context: string;
  vibe: string[];
  resonance: number;
  createdAt: Date;
  sceneId?: string;
}

export interface MicroScene {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  postCount: number;
}

export interface Profile {
  user: User;
  bio: string;
  vibeDistribution: { vibe: string; percentage: number }[];
  representations: string[];
  totalResonance: number;
  followers: number;
}
