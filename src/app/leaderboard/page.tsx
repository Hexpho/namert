'use client';

import { useState, useEffect } from 'react';
import { Candidate, INITIAL_CANDIDATES } from '@/lib/data';
import { subscribeToCandidates } from '@/lib/firebase';
import Link from 'next/link';

export default function LeaderboardPage() {
    const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Subscribe to real-time updates from Firebase
        const unsubscribe = subscribeToCandidates((data) => {
            setCandidates(data);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Sort by Elo descending
    const sorted = [...candidates].sort((a, b) => b.elo - a.elo);

    if (isLoading) {
        return (
            <div className="h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="text-gold text-4xl animate-pulse">📊</div>
                    <p className="text-gold font-serif text-xl">Loading Rankings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8 pb-20">
            <div className="max-w-4xl mx-auto space-y-12">
                <header className="flex justify-between items-end border-b border-white/10 pb-8">
                    <div>
                        <h1 className="font-serif text-5xl md:text-7xl text-gold mb-2">Leaderboard</h1>
                        <p className="text-gray-400 uppercase tracking-widest text-sm">Live Rankings • Updates in Real-Time</p>
                    </div>
                    <Link
                        href="/vote"
                        className="px-6 py-3 bg-white/5 hover:bg-gold hover:text-charcoal border border-gold/30 rounded-sm text-gold transition-all duration-300 font-serif"
                    >
                        VOTE MORE
                    </Link>
                </header>

                <div className="space-y-2">
                    <div className="grid grid-cols-12 text-xs uppercase tracking-widest text-gray-500 py-4 px-6">
                        <div className="col-span-1 md:col-span-1">Rank</div>
                        <div className="col-span-7 md:col-span-8">Name</div>
                        <div className="col-span-2 text-right">Rating</div>
                        <div className="col-span-2 text-right">Matches</div>
                    </div>

                    <div className="space-y-2">
                        {sorted.map((c, index) => (
                            <div
                                key={c.id}
                                className={`
                  grid grid-cols-12 items-center px-6 py-5 rounded-lg border transition-all duration-300
                  ${index === 0 ? 'bg-gradient-to-r from-gold/20 to-transparent border-gold/50' : 'bg-charcoal/40 border-white/5 hover:border-white/10'}
                `}
                            >
                                <div className="col-span-1 md:col-span-1 font-mono text-xl text-gray-400">
                                    {index === 0 ? <span className="text-2xl text-gold">👑</span> : `#${index + 1}`}
                                </div>
                                <div className={`col-span-7 md:col-span-8 font-serif text-xl md:text-2xl ${index === 0 ? 'text-gold' : 'text-foreground'}`}>
                                    {c.name}
                                </div>
                                <div className="col-span-2 text-right font-mono text-gold/80">
                                    {c.elo}
                                </div>
                                <div className="col-span-2 text-right font-mono text-gray-500 text-sm">
                                    {c.matches}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
