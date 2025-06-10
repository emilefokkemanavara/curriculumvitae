export interface PageUrl {
    getCvId(): string | null
    setCvId(id: string): void
}

export function createPageUrl(): PageUrl {
    return {
        getCvId(): string | null {
            const url = new URL(location.href);
            return url.searchParams.get('id');
        },
        setCvId(id: string){
            const url = new URL(location.href);
            url.searchParams.set('id', id);
            history.replaceState({}, '', url);
        }
    }
}