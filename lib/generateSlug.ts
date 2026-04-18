export const generatePersianSlug = (text: string): string => {
    if (!text) return "";
    return text
        .trim()
        .replace(/\s+/g, '-') 
        .replace(/[^\w\u0600-\u06FF\-]+/g, '') 
        .replace(/^-+|-+$/g, ''); 
};