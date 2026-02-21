import Header from "@/components/Header";
import DiscoverView from "@/components/DiscoverView";

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <DiscoverView />
      </main>
    </div>
  );
}
