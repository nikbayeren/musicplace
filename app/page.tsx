import Feed from "@/components/Feed";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 flex justify-center">
        <Feed />
      </main>
    </div>
  );
}
