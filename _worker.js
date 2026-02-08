
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // PUBLIC ROUTES: Add pages here you want everyone to see
    if (
      url.pathname === '/' || 
      url.pathname.includes('index.html') || 
      url.pathname.includes('it_panel.html') ||
      url.pathname.includes('.png') ||
      url.pathname.includes('.jpg')
    ) {
      return env.ASSETS.fetch(request);
    }

    // PROTECTED ROUTES: Redirect everything else to Sign-in if needed
    // (This is where your pedagogy-db logic lives)
    return env.ASSETS.fetch(request);
  }
};
