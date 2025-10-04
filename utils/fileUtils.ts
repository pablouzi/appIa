
type InlineData = {
    mimeType: string;
    data: string;
};

export async function urlToInlineData(url: string): Promise<InlineData> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    const mimeType = blob.type;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = (reader.result as string).split(',')[1];
            resolve({ mimeType, data: base64data });
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
