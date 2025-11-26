

export async function POST(req: Request) {
    const { message } = await req.json();

    // Simple echo response for demonstration purposes
    const responseMessage = `You said: ${message}`;
    return new Response(JSON.stringify({ reply: responseMessage }), {
        headers: { 'Content-Type': 'application/json' },
    });
}