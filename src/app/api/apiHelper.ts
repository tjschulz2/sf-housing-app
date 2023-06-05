export const BEARER_TOKEN = process.env.NEXT_PUBLIC_TWITTER_API_KEY as string;

export async function fetchWithToken(url: string, options: RequestInit = {}): Promise<Response> {
    const defaultHeaders: Record<string, string> = {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
    };

    options.headers = options.headers ? {...options.headers as Record<string, string>, ...defaultHeaders} : defaultHeaders;

    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response;
}