/* START: 100% Public Worker Logic */
export default {
  async fetch(request, env) {
    // No more redirects or session checks. Everything is public.
    return env.ASSETS.fetch(request);
  }
};
/* END: 100% Public Worker Logic */