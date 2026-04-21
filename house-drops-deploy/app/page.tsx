import DropsGrid from "./components/DropsGrid";
import StudioLink from "./components/StudioLink";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-24">

        {/* Hero */}
        <section className="mb-14 sm:mb-20">
          <p className="font-mono text-xs text-[#0ea5e9] tracking-[0.3em] uppercase mb-6 sm:mb-8">
            5 tracks. No misses.
          </p>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-none mb-5">
            House Drops
          </h1>
          <p className="text-zinc-400 text-lg sm:text-xl tracking-wide">
            My House Is Your House.
          </p>
          <p className="text-zinc-500 text-base sm:text-lg mt-3 tracking-wide">
            No algorithms. Just taste.
          </p>
        </section>

        {/* All drops */}
        <DropsGrid />

        {/* Navigation */}
        <section className="mt-24">
          <div className="flex flex-wrap gap-4">
            <StudioLink />
          </div>
          <p className="mt-6 font-mono text-xs text-zinc-700">
            we don&apos;t miss. Check back soon.
          </p>
        </section>

      </div>
    </main>
  );
}
