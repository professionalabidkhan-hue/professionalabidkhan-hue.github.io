export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const timestamp = new Date().toISOString();

    if (url.pathname === "/api/signup" && request.method === "POST") {
      try {
        const data = await request.json();
        
        // [DEBUG LOG] This tells us exactly what the form is sending
        console.log(`[${timestamp}] DATA RECEIVED:`, JSON.stringify(data));

        // Use the correct mapping based on your database columns
        const info = await env.DB.prepare(`
          INSERT INTO users (
            full_name, email, whatsapp, password, role, department, 
            timing, qualification, experience, expected_revenue, proposed_fee
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          data.full_name || data.name || null, 
          data.email || null, 
          data.whatsapp || null, 
          data.password || null, 
          data.role || null, 
          data.department || null, 
          data.timing || null, 
          data.qualification || data.qc || null, 
          data.experience || data.ex || null, 
          data.expected_revenue || null, 
          data.proposed_fee || data.fee || null
        ).run();

        return new Response(JSON.stringify({ 
          success: true, 
          id: info.meta.last_row_id,
          message: "Data successfully secured in the Institute database." 
        }), {
          headers: { "Content-Type": "application/json" },
        });

      } catch (err) {
        console.error(`[${timestamp}] CRITICAL ERROR: ${err.message}`);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
