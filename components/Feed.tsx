"use client";

import { useState, useMemo } from "react";
import Post from "./Post";
import CreatePost from "./CreatePost";
import { mockPosts, mockFollowing } from "@/lib/mockData";

export default function Feed() {
  const [posts, setPosts] = useState(mockPosts);

  const displayPosts = useMemo(
    () => posts.filter((p) => mockFollowing.has(p.user.username)),
    [posts]
  );

  const handleNewPost = (newPost: any) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-5">
        <CreatePost onPostCreated={handleNewPost} />
      </div>

      {displayPosts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-muted text-sm">Takip ettiğin kişiler henüz paylaşım yapmadı.</p>
          <p className="text-text-faint text-xs mt-1">Keşfet'ten yeni insanlar bul.</p>
        </div>
      ) : (
        <div className="space-y-0">
          {displayPosts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
