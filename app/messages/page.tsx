import Header from "@/components/Header";
import MessagesView from "@/components/MessagesView";

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Header />
      <main className="flex-1 flex min-h-0">
        <MessagesView />
      </main>
    </div>
  );
}
