import RNG from "@gouvernathor/rng";

export function generateRandomSeed(rng = new RNG()): string {
    return Array.from({ length: 16 },
        () => rng.randRange(36).toString(36))
        .join('');
}
