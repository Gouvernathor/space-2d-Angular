export function generateTexture(
    width: number, height: number,
    density: number, brightness: number,
    prng: {random: () => number, randRange: (min: number, max: number) => number},
): Uint8Array {
    // Determine the number of stars to be rendered
    const count = Math.round(width * height * density);
    // Create a byte array
    const data = new Uint8Array(width * height * 3);

    // For each star
    for (let s = 0; s < count; s++) {
        // Select a random position
        const p = prng.randRange(0, width * height);
        // Select an intensity from an exponential distribution
        const c = Math.round(255 * Math.log(1 - prng.random()) * -brightness);
        // Set a grey color of this whiteness at this position
        data[p * 3] = data[p * 3 + 1] = data[p * 3 + 2] = c;
    }
    return data;
}
