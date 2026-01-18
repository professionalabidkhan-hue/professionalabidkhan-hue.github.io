export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (url.pathname === "/api/signup" && request.method === "POST") {
      try {
        const data = await request.json();

        // Execution of the SQL statement
        const result = await env.DB.prepare(`
          INSERT INTO users (full_name, email, whatsapp, password, role, department, timing, qualification, experience, proposed_fee)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          data.name, 
          data.email, 
          data.whatsapp, 
          data.password, 
          data.role, 
          data.department, 
          data.timing, 
          data.qc || null, 
          data.ex || null, 
          data.fee || null
        ).run();

        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });

      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
    }

    // Fallback for other routes
    return new Response("Not Found", { status: 404 });
  }
};
