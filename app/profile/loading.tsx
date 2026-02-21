export default function ProfileLoading() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-text-muted">Profil yükleniyor</p>
      </div>
    </div>
  );
}
