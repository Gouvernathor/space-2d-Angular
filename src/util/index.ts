export function reflow(
    canvas: HTMLCanvasElement,
    {
        guiWidth, marginWidth, marginHeight,
        wInnerWidth, wInnerHeight,
    }: {
        guiWidth: number, marginWidth: number, marginHeight: number,
        wInnerWidth: number, wInnerHeight: number,
    },
): void {
    const width = canvas.width;
    const height = canvas.height;
    const wAvailable = wInnerWidth - (guiWidth + 3*marginWidth);
    const hAvailable = wInnerHeight - 2*marginHeight;

    if (width/height > wAvailable/hAvailable) {
        canvas.style.left = `${guiWidth+2*marginWidth}px`;
        canvas.style.width = `${wAvailable}px`;
        const hComputed = wAvailable * height / width;
        canvas.style.height = `${hComputed}px`;
    } else {
        canvas.style.height = `${hAvailable}px`;
        const wComputed = hAvailable * width / height;
        const wCenter = guiWidth + 2*marginWidth + wAvailable/2;
        canvas.style.left = `${wCenter - wComputed/2}px`;
        canvas.style.width = `${wComputed}px`;
    }
    canvas.style.top = `${marginHeight}px`;
}
