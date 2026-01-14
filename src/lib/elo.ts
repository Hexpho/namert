
export const K_FACTOR = 32;

export function calculateNewRatings(winnerElo: number, loserElo: number): { winnerNew: number; loserNew: number } {
    // Calculate expected score for winner
    const expectedScoreWinner = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));

    // Calculate new ratings
    const winnerNew = Math.round(winnerElo + K_FACTOR * (1 - expectedScoreWinner));
    const loserNew = Math.round(loserElo + K_FACTOR * (0 - (1 - expectedScoreWinner)));

    return { winnerNew, loserNew };
}

export function getExpectedScore(ratingA: number, ratingB: number): number {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}
