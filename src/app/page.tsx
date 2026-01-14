
import Link from "next/link";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-charcoal/30 via-background to-background pointer-events-none" />

      <div className="z-10 text-center space-y-8 animate-in fade-in zoom-in duration-1000">
        <div className="space-y-2">
          <p className="text-gold tracking-[0.3em] text-sm uppercase font-semibold">
            VOTE · RANK · DECIDE
          </p>
          <h1
            className={`${playfair.className} text-6xl md:text-8xl font-bold tracking-tight drop-shadow-2xl`}
          >
            <span className="text-foreground">name</span><span className="text-gold italic">it.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto font-light leading-relaxed">
            The ultimate showdown. Pick your favorite.
            20 votes. One winner.
          </p>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            href="/vote"
            className="group relative px-8 py-4 bg-transparent border border-gold/30 text-gold hover:bg-gold hover:text-charcoal transition-all duration-500 ease-out overflow-hidden rounded-sm"
          >
            <span className="relative z-10 font-serif text-xl tracking-widest group-hover:font-bold">
              START VOTING
            </span>
            <div className="absolute inset-0 h-full w-full scale-0 rounded-sm transition-all duration-300 group-hover:scale-100 group-hover:bg-gold/100" />
          </Link>

          <Link
            href="/leaderboard"
            className="text-gray-500 hover:text-gold transition-colors text-sm tracking-widest uppercase border-b border-transparent hover:border-gold pb-1"
          >
            View Leaderboard
          </Link>
        </div>
      </div>
    </main>
  );
}
