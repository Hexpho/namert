'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Candidate, INITIAL_CANDIDATES } from '@/lib/data';
import { calculateNewRatings } from '@/lib/elo';
import { getCandidates, updateCandidates } from '@/lib/firebase';
import Link from 'next/link';

const MAX_VOTES = 20;

type JokeStage = 'payment' | 'reveal' | 'none';

export default function VotePage() {
    const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
    const [pair, setPair] = useState<[Candidate, Candidate] | null>(null);
    const [voteCount, setVoteCount] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [jokeStage, setJokeStage] = useState<JokeStage>('payment');
    const [isLoading, setIsLoading] = useState(true);

    // Pick two random candidates
    const pickNewPair = (currentCandidates: Candidate[]) => {
        const idx1 = Math.floor(Math.random() * currentCandidates.length);
        let idx2 = Math.floor(Math.random() * currentCandidates.length);
        while (idx1 === idx2) {
            idx2 = Math.floor(Math.random() * currentCandidates.length);
        }
        setPair([currentCandidates[idx1], currentCandidates[idx2]]);
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                // Load candidates from Firebase
                const loaded = await getCandidates();
                setCandidates(loaded);

                // Check if this user already voted (stored locally per user)
                const userVoteCount = localStorage.getItem('voting_app_user_votes');
                const count = userVoteCount ? parseInt(userVoteCount, 10) : 0;
                setVoteCount(count);

                // Check if joke was already shown
                const jokeShown = localStorage.getItem('voting_app_joke_shown');

                if (count >= MAX_VOTES) {
                    setIsComplete(true);
                    setJokeStage('none');
                } else if (jokeShown) {
                    setJokeStage('none');
                }

                pickNewPair(loaded);
            } catch (error) {
                console.error('Error loading candidates:', error);
                // Fallback to initial candidates
                setCandidates(INITIAL_CANDIDATES);
                pickNewPair(INITIAL_CANDIDATES);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const handlePaymentClick = () => {
        setJokeStage('reveal');
    };

    const handleStartForReal = () => {
        setJokeStage('none');
        localStorage.setItem('voting_app_joke_shown', 'true');
    };

    const handleVote = async (winner: Candidate, loser: Candidate) => {
        const { winnerNew, loserNew } = calculateNewRatings(winner.elo, loser.elo);

        const updatedCandidates = candidates.map(c => {
            if (c.id === winner.id) return { ...c, elo: winnerNew, matches: c.matches + 1 };
            if (c.id === loser.id) return { ...c, elo: loserNew, matches: c.matches + 1 };
            return c;
        });

        setCandidates(updatedCandidates);

        // Save to Firebase (shared across all users)
        try {
            await updateCandidates(updatedCandidates);
        } catch (error) {
            console.error('Error updating candidates:', error);
        }

        // Track user's vote count locally
        const newVoteCount = voteCount + 1;
        setVoteCount(newVoteCount);
        localStorage.setItem('voting_app_user_votes', newVoteCount.toString());

        if (newVoteCount >= MAX_VOTES) {
            setIsComplete(true);
            return;
        }

        setTimeout(() => {
            pickNewPair(updatedCandidates);
        }, 400);
    };

    // Loading Screen
    if (isLoading) {
        return (
            <div className="h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="text-gold text-4xl animate-pulse">⏳</div>
                    <p className="text-gold font-serif text-xl">Loading...</p>
                </div>
            </div>
        );
    }

    // Fake Payment Screen
    if (jokeStage === 'payment') {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-lg space-y-8"
                >
                    <div className="text-gold text-xs tracking-widest uppercase">Premium Access Required</div>
                    <h1 className="font-serif text-4xl md:text-5xl text-foreground">
                        Security Deposit
                    </h1>
                    <p className="text-gray-400 leading-relaxed">
                        To ensure the integrity of our exclusive voting experience and prevent fraudulent participation,
                        a <span className="text-gold font-semibold">refundable deposit of $20.00 USD</span> is required.
                    </p>
                    <p className="text-gray-500 text-sm">
                        Your deposit will be returned within 3-5 business days upon completion of voting.
                    </p>

                    <div className="border border-gold/20 rounded-lg p-6 bg-charcoal/30 space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Voting Access Fee</span>
                            <span className="text-foreground">$0.00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Security Deposit</span>
                            <span className="text-foreground">$20.00</span>
                        </div>
                        <hr className="border-white/10" />
                        <div className="flex justify-between font-semibold">
                            <span className="text-foreground">Total Due Now</span>
                            <span className="text-gold">$20.00</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={handlePaymentClick}
                            className="flex-1 px-6 py-4 bg-gold text-charcoal font-serif tracking-widest rounded-sm hover:bg-gold/90 transition-all"
                        >
                            PROCEED TO PAYMENT
                        </button>
                        <button
                            onClick={handlePaymentClick}
                            className="flex-1 px-6 py-4 border border-white/10 text-gray-400 font-serif tracking-widest rounded-sm hover:border-white/30 transition-all"
                        >
                            CANCEL
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Joke Reveal Screen
    if (jokeStage === 'reveal') {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-lg space-y-8"
                >
                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-6xl"
                    >
                        😂
                    </motion.div>
                    <h1 className="font-serif text-4xl md:text-5xl text-gold">
                        We Jest, Dear Friend
                    </h1>
                    <p className="text-gray-400 leading-relaxed text-lg">
                        Your presence here requires no tribute of coin.
                        The art of naming is, and shall forever remain, <span className="text-foreground font-semibold">complimentary</span>.
                    </p>
                    <p className="text-gray-500 text-sm italic">
                        We appreciate your good humor. Now, let the games begin.
                    </p>

                    <button
                        onClick={handleStartForReal}
                        className="mt-8 px-10 py-5 bg-gold text-charcoal font-serif text-xl tracking-widest rounded-sm hover:bg-gold/90 transition-all shadow-lg shadow-gold/20"
                    >
                        BEGIN THE VOTE
                    </button>
                </motion.div>
            </div>
        );
    }

    // Completion Screen
    if (isComplete) {
        const sorted = [...candidates].sort((a, b) => b.elo - a.elo);
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                >
                    <p className="text-gold text-sm tracking-widest uppercase">VOTING COMPLETE</p>
                    <h1 className="font-serif text-5xl md:text-7xl text-foreground">
                        Thank you!
                    </h1>
                    <p className="text-gray-400 max-w-md mx-auto">
                        You have cast all {MAX_VOTES} votes. Here is the current leader:
                    </p>
                    <div className="mt-8 p-8 border border-gold/30 rounded-lg bg-charcoal/30">
                        <p className="text-gold text-xs tracking-widest mb-2">CURRENT #1</p>
                        <h2 className="font-serif text-4xl md:text-6xl text-gold">{sorted[0]?.name}</h2>
                        <p className="text-gray-500 mt-2">Rating: {sorted[0]?.elo}</p>
                    </div>
                    <Link
                        href="/leaderboard"
                        className="inline-block mt-8 px-8 py-4 border border-gold/30 text-gold hover:bg-gold hover:text-charcoal transition-all rounded-sm font-serif tracking-widest"
                    >
                        VIEW FULL RANKINGS
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (!pair) return <div className="h-screen bg-background flex items-center justify-center text-gold">Summoning Challengers...</div>;

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden p-4">
            {/* HUD */}
            <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
                <Link href="/" className="text-foreground/50 font-serif text-xl hover:text-foreground transition-colors">
                    <span className="text-foreground">name</span><span className="text-gold">it.</span>
                </Link>
                <Link href="/leaderboard" className="text-gold/50 text-sm tracking-widest hover:text-gold transition-colors">LEADERBOARD</Link>
            </nav>

            {/* Vote Counter */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center">
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Vote</p>
                <p className="text-gold font-mono text-2xl">{voteCount + 1} <span className="text-gray-600">/ {MAX_VOTES}</span></p>
            </div>

            {/* VS Badge */}
            <div className="absolute z-10 text-gold font-bold text-4xl md:text-6xl font-serif opacity-20 pointer-events-none">
                VS
            </div>

            <div className="flex flex-col md:flex-row w-full max-w-6xl h-[80vh] gap-8 md:gap-16 items-center justify-center relative">
                <AnimatePresence mode="wait">
                    <CandidateCard
                        key={pair[0].id}
                        candidate={pair[0]}
                        onClick={() => handleVote(pair[0], pair[1])}
                    />
                    <CandidateCard
                        key={pair[1].id}
                        candidate={pair[1]}
                        onClick={() => handleVote(pair[1], pair[0])}
                    />
                </AnimatePresence>
            </div>
        </div>
    );
}

function CandidateCard({ candidate, onClick }: { candidate: Candidate; onClick: () => void }) {
    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="group w-full max-w-md aspect-square md:aspect-[3/4] bg-charcoal/50 border border-white/5 hover:border-gold/50 rounded-lg flex flex-col items-center justify-center relative transition-all duration-300 shadow-2xl overflow-hidden cursor-pointer"
        >
            {/* Spotlight Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <h2 className="relative z-10 font-serif text-3xl md:text-5xl text-foreground group-hover:text-gold transition-colors duration-300 text-center px-4">
                {candidate.name}
            </h2>

            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 text-gold/60 text-sm tracking-widest">
                SELECT
            </div>
        </motion.button>
    );
}
