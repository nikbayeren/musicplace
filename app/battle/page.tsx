import BattleView from "@/components/BattleView";
import Header from "@/components/Header";

export default function BattlePage() {
  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <BattleView />
      </main>
    </div>
  );
}
