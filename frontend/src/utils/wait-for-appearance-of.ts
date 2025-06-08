function isThere({width, height}: DOMRectReadOnly): boolean {
    return width > 0 || height > 0;
}
export async function waitForAppearanceOf(el: HTMLElement): Promise<void> {
    if(isThere(el.getBoundingClientRect())){
        return;
    }
    await new Promise<void>((res) => {
        const observer = new ResizeObserver(([{contentRect}]) => {
            if(!isThere(contentRect)){
                return;
            }
            observer.disconnect();
            res();
        });
        observer.observe(el);
    })
}