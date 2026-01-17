export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const timestamp = new Date().toISOString();

    // 1. Handle Signup Requests
    if (url.pathname === "/api/signup" && request.method === "POST") {
      try {
        const data = await request.json();
        
        // [LOG SENTINEL] - Visible in Cloudflare Real-time Logs
        console.log(`[${timestamp}] SIGNUP ATTEMPT: ${data.email} | Role: ${data.role}`);

        const info = await env.DB.prepare(`
          INSERT INTO users (full_name, email, whatsapp, password, role, department, timing, qualification, experience, expected_revenue, proposed_fee)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          data.name, data.email, data.whatsapp, data.password, 
          data.role, data.department, data.timing, 
          data.qc || null, data.ex || null, data.expected_revenue || null, data.fee || null
        ).run();

        // [SUCCESS FEEDBACK] - Returns the actual Database ID
        console.log(`[${timestamp}] SUCCESS: Identity Created with ID ${info.meta.last_row_id}`);
        
        return new Response(JSON.stringify({ 
          success: true, 
          identity_id: info.meta.last_row_id,
          message: "Master Core Notified" 
        }), {
          headers: { "Content-Type": "application/json" },
        });

      } catch (err) {
        console.error(`[${timestamp}] ERROR: ${err.message}`);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    // 2. Handle Signin Requests
    if (url.pathname === "/api/signin" && request.method === "POST") {
      const { email, password } = await request.json();
      console.log(`[${timestamp}] SIGNIN ATTEMPT: ${email}`);
      
      const user = await env.DB.prepare("SELECT * FROM users WHERE email = ? AND password = ?")
        .bind(email, password)
        .first();

      if (user) {
        console.log(`[${timestamp}] ACCESS GRANTED: ${email}`);
        return new Response(JSON.stringify({ 
          name: user.full_name, 
          email: user.email,
          role: user.role 
        }), {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        console.warn(`[${timestamp}] ACCESS DENIED: Invalid credentials for ${email}`);
        return new Response("Unauthorized", { status: 401 });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
