export async function onRequest(context) {
    const { request, env } = context;
    
    // Define headers once to use in all responses
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };

    // 1. Handle Preflight (OPTIONS)
    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    // 2. Only allow POST requests
    if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: `Method ${request.method} not allowed.` }), { 
            status: 405, 
            headers: corsHeaders 
        });
    }

    try {
        const data = await request.json();

        // 3. Robust Validation
        if (!data.email || !data.password || !data.name) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: "Identity incomplete. Name, Email, and Access Key are required." 
            }), { status: 400, headers: corsHeaders });
        }

        // 4. Database Interaction
        if (!env.DB) {
            console.error("D1 Binding 'DB' missing in Cloudflare Settings.");
            return new Response(JSON.stringify({ 
                success: false, 
                error: "Hub Database Connection Lost. Please contact Admin." 
            }), { status: 500, headers: corsHeaders });
        }

        // Attempt to insert into the D1 'users' table
        await env.DB.prepare(`
            INSERT INTO users (name, email, whatsapp, password, role, department, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
            data.name, 
            data.email, 
            data.whatsapp || null, 
            data.password, // In production, use a hash like bcrypt
            data.role || 'student', 
            data.department || 'general', 
            new Date().toISOString()
        ).run();

        return new Response(JSON.stringify({ 
            success: true, 
            message: "Identity Synchronized with Abid Khan Hub." 
        }), { status: 200, headers: corsHeaders });

    } catch (err) {
        // Handle duplicate email error specifically
        let errorMessage = err.message;
        if (errorMessage.includes("UNIQUE constraint failed")) {
            errorMessage = "This email is already registered in the Hub.";
        }

        return new Response(JSON.stringify({ 
            success: false, 
            error: "Critical Hub Error: " + errorMessage 
        }), { status: 500, headers: corsHeaders });
    }
}