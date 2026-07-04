export function WorkspacePageState({
  message,
  tone = "default",
}: {
  message: string;
  tone?: "default" | "error";
}) {
  const isError = tone === "error";

  return (
    <main className="grid min-h-screen place-items-center bg-[#eef3ef] px-4 text-[#16211b]">
      <div
        className={`w-full max-w-md rounded-lg border p-5 text-sm shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl ${
          isError
            ? "border-[#e2c6bd] bg-[#fff7f3] text-[#8a3f2a]"
            : "border-white/70 bg-white/60 text-[#243128]"
        }`}
      >
        <p className="font-semibold">{message}</p>
        {isError ? (
          <button
            className="mt-4 inline-flex h-10 items-center justify-center rounded-md border border-[#d7c6c1] bg-white/70 px-4 text-sm font-semibold text-[#713c34] transition hover:border-[#c99990] hover:bg-white focus:ring-3 focus:ring-[#9b3a32]/15 focus:outline-none"
            type="button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        ) : (
          <p className="mt-2 text-xs text-[#65716a]">Preparing your workspace view...</p>
        )}
      </div>
    </main>
  );
}
