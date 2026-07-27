const maintenancePage = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Website temporarily unavailable | Nana B Enterprises</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background:
          radial-gradient(circle at 15% 10%, rgba(35, 79, 165, .17), transparent 32rem),
          linear-gradient(145deg, #071d4b, #0d326f);
        color: #10244a;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      main {
        width: min(100%, 620px);
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, .28);
        border-radius: 30px;
        background: #fff;
        box-shadow: 0 30px 80px rgba(0, 0, 0, .28);
      }
      .brand {
        padding: 22px 28px;
        background: #0b2d69;
        color: white;
        font-size: 15px;
        font-weight: 900;
        letter-spacing: .14em;
        text-align: center;
      }
      .content { padding: 52px 36px; text-align: center; }
      .status {
        display: inline-block;
        margin-bottom: 22px;
        border-radius: 999px;
        padding: 8px 14px;
        background: #eef4ff;
        color: #17489e;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: .08em;
        text-transform: uppercase;
      }
      h1 { margin: 0; font-size: clamp(30px, 7vw, 48px); line-height: 1.04; letter-spacing: -.04em; }
      p { margin: 20px auto 0; max-width: 450px; color: #61708c; font-size: 16px; line-height: 1.7; }
      a {
        display: inline-flex;
        margin-top: 30px;
        border-radius: 999px;
        padding: 14px 22px;
        background: #e31c2b;
        color: white;
        font-weight: 800;
        text-decoration: none;
      }
      footer { border-top: 1px solid #edf0f5; padding: 18px; color: #8994a8; font-size: 12px; text-align: center; }
      @media (max-width: 520px) {
        body { padding: 16px; }
        main { border-radius: 24px; }
        .content { padding: 42px 24px; }
      }
    </style>
  </head>
  <body>
    <main>
      <div class="brand">NANA B ENTERPRISES</div>
      <section class="content">
        <span class="status">Temporary maintenance</span>
        <h1>We’ll be back soon.</h1>
        <p>The Nana B Enterprises website is temporarily unavailable while scheduled updates are completed. For enquiries, please contact the business directly.</p>
        <a href="tel:+233244018530">Call 0244 018 530</a>
      </section>
      <footer>Wholesale and retail · Delivery across Ghana</footer>
    </main>
  </body>
</html>`;

export async function GET() {
  return new Response(maintenancePage, {
    status: 503,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "Retry-After": "3600",
    },
  });
}
