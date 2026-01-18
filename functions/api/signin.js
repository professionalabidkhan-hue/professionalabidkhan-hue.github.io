export async function onRequest(context) {
    const { request, env } = context;
    
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };

    // Handle Browser Security Checks (CORS)
    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });
    }

    try {
        const { email, password } = await request.json();

        if (!env.DB) {
            return new Response(JSON.stringify({ success: false, error: "Database link missing in Cloudflare." }), { status: 500, headers: corsHeaders });
        }

        // Search for user in your D1 'users' table
        const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();

        if (!user) {
            return new Response(JSON.stringify({ success: false, error: "Access Denied: Email not registered." }), { status: 401, headers: corsHeaders });
        }

        // Verify Password
        if (user.password !== password) {
            return new Response(JSON.stringify({ success: false, error: "Access Denied: Incorrect Password." }), { status: 401, headers: corsHeaders });
        }

        // Return user data (security: remove password before sending)
        const { password: _, ...safeUser } = user;
        return new Response(JSON.stringify({ 
            success: true, 
            message: "Welcome to Abid Khan Hub", 
            user: safeUser 
        }), { status: 200, headers: corsHeaders });

    } catch (err) {
        return new Response(JSON.stringify({ success: false, error: "Hub Error: " + err.message }), { status: 500, headers: corsHeaders });
    }
}