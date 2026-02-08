/* START: Worker Bypass Logic */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // Allow direct access to Home, IT Lab, and Images
    if (
      url.pathname === '/' || 
      url.pathname.includes('index.html') || 
      url.pathname.includes('IT.html') || 
      url.pathname.includes('.png')
    ) {
      return env.ASSETS.fetch(request);
    }
    // Protect other sensitive institute areas
    return env.ASSETS.fetch(request);
  }
};
