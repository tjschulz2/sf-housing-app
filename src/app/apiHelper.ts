export const BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAANOmngEAAAAAnH7dj8gddM7YcfguJtmIeqI90cQ%3DkutZzebBwfwwgUePPet9FAOH2qA3BG3iEoojTmAQ5Pfmgt2OUL";

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