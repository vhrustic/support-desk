/**
 * Better Stack JavaScript tag.
 *
 * Loads the frontend error tracking / RUM snippet. The token is a public,
 * write-only ingest key — it ships to every visitor in the page source by
 * design, the same as a Google Analytics ID.
 *
 * This is a plain inline <script>, not `next/script`, on purpose:
 *
 *  1. It runs during HTML parse, before any Next.js runtime chunk, so errors
 *     thrown very early are still captured. `next/script`'s `beforeInteractive`
 *     appends the tag only once Next's own loader has booted.
 *  2. `next/script` requires an `id` on inline scripts, and it copies that `id`
 *     onto the injected <script> element. An element with `id="betterstack"`
 *     makes `window.betterstack` resolve to that DOM element via named element
 *     access, so the snippet's `b[t]=b[t]||function(){...}` keeps the element
 *     instead of installing the stub, and `betterstack('init', ...)` then throws
 *     "betterstack is not a function". The collector would look healthy —
 *     b.js still downloads — while never actually initializing.
 */
const APPLICATION_TOKEN = "e45LvomhTYGCyJzFqNug7wrz";

export function BetterStack() {
  // This renders on the server, so Vercel's VERCEL_ENV is readable directly and
  // no NEXT_PUBLIC_ variable is needed. Without this, preview and local builds
  // would report as "production" and pollute the production error feed.
  const environment = process.env.VERCEL_ENV ?? "development";

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
!function(b,e,t,r){
  b[t]=b[t]||function(...args){(b[t].q=b[t].q||[]).push(args)};
  b[t].l=+new Date;
  var s=e.createElement('script'); s.async=1; s.crossOrigin='anonymous';
  s.src='https://betterstack.net/b.js?t='+r;
  (e.head||e.getElementsByTagName('head')[0]).appendChild(s);
}(window,document,'betterstack',${JSON.stringify(APPLICATION_TOKEN)});
betterstack('init', { environment: ${JSON.stringify(environment)} });
        `.trim(),
      }}
    />
  );
}
