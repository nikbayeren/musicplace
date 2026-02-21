import SongView from "@/components/SongView";

export default function SongPage({ params }: { params: { slug: string } }) {
  return <SongView slug={params.slug} />;
}
