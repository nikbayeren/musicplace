import dynamic from "next/dynamic";
import Header from "@/components/Header";

const ProfileView = dynamic(() => import("@/components/ProfileView"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 relative z-0">
        <ProfileView />
      </main>
    </div>
  );
}
