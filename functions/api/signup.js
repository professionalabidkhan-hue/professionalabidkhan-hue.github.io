export async function onRequestPost(context) {
    const { request, env } = context;

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    };

    try {
        const data = await request.json();

        // 1. Basic Validation
        if (!data.email || !data.password || !data.role) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: "Missing required identity credentials." 
            }), { status: 400, headers: corsHeaders });
        }

        // 2. Role-Based Logic (Trainer vs Student)
        if (data.role === 'trainer') {
            console.log(`Processing Trainer Application for: ${data.name}`);
            // Logic for trainers (e.g., checking qualification/experience)
        }

        // 3. Database Interaction (Placeholder)
        // If you use Cloudflare D1:
        // await env.DB.prepare("INSERT INTO users (name, email, role) VALUES (?, ?, ?)")
        // .bind(data.name, data.email, data.role).run();

        return new Response(JSON.stringify({ 
            success: true, 
            message: `Identity initialized successfully as ${data.role}.` 
        }), { status: 200, headers: corsHeaders });

    } catch (err) {
        return new Response(JSON.stringify({ 
            success: false, 
            error: "Data Synchronization Failed: " + err.message 
        }), { status: 500, headers: corsHeaders });
    }
}

// Important: Handle preflight for browser security
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
