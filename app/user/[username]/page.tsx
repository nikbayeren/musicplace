import Header from "@/components/Header";
import UserProfileView from "@/components/UserProfileView";

export default function UserPage({ params }: { params: { username: string } }) {
  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <main className="min-h-screen bg-transparent px-4 py-8 sm:px-6 max-w-2xl mx-auto relative z-0">
        <UserProfileView username={params.username} />
      </main>
    </div>
  );
}
