import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const reqBody = await request.json();
    const { email, confirmationCode } = reqBody;

    const zapierResponse = await fetch('https://hooks.zapier.com/hooks/catch/6615420/3hovv3c/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, confirmationCode }),
    });

    if (!zapierResponse.ok) {
        const errorMessage: string = 'Error calling Zapier webhook: ' + await zapierResponse.text();
        console.error(errorMessage);
        return new Response(errorMessage, { status: 500 });
    }

    return new Response('Successfully sent confirmation code', { status: 200 });
}