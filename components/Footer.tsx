import Link from "next/link";

export default function Footer() {
  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Catalogue", href: "/catalogue" },
  ];

  const platforms = [
    { label: "Amazon", href: "#" },
    { label: "Flipkart", href: "#" },
    { label: "Meesho", href: "#" },
  ];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
    .footer-link {
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      color: rgba(255,255,255,0.45);
      text-decoration: none;
      transition: color 0.2s ease;
      font-weight: 500;
    }
    .footer-link:hover { color: #d4b896; }
    .platform-badge {
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      padding: 8px 20px;
      border-radius: 50px;
      text-decoration: none;
      border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.7);
      transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
      display: inline-block;
    }
    .platform-badge:hover {
      border-color: rgba(255,255,255,0.35);
      color: #fff;
      transform: translateY(-2px);
    }
    .footer-logo {
      font-family: 'Playfair Display', serif;
      font-weight: 800;
      font-size: 28px;
      color: #fff;
      letter-spacing: -0.02em;
    }
    .neohive-link {
      color: #d4b896;
      text-decoration: none;
      font-weight: 600;
      transition: opacity 0.2s ease;
    }
    .neohive-link:hover { opacity: 0.7; }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <footer
        style={{
          background: "#111111",
          padding: "80px 48px 40px",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          {/* Top row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "48px",
              marginBottom: "64px",
            }}
          >
            {/* Brand */}
            <div style={{ maxWidth: "300px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "16px",
                }}
              >
                <span className="footer-logo">Esteem</span>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.8,
                  marginBottom: "24px",
                }}
              >
                Tiruppur&apos;s trusted innerwear brand — 30+ years of comfort,
                craftsmanship, and care for every Indian family.
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {platforms.map((p) => (
                  <Link key={p.label} href={p.href} className="platform-badge">
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Links */}
            <div style={{ display: "flex", gap: "64px", flexWrap: "wrap" }}>
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#d4b896",
                    marginBottom: "20px",
                  }}
                >
                  Navigate
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  {links.map((l) => (
                    <Link key={l.href} href={l.href} className="footer-link">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#d4b896",
                    marginBottom: "20px",
                  }}
                >
                  Why Esteem
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  {[
                    "100% Organic Cotton",
                    "Skin-Safe Dyes",
                    "Family Range",
                    "Affordable Quality",
                  ].map((item) => (
                    <span
                      key={item}
                      style={{
                        fontSize: "14px",
                        color: "rgba(255,255,255,0.45)",
                        fontWeight: 500,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              paddingTop: "28px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>
              © {new Date().getFullYear()} Esteem Innerwears. All rights
              reserved.
            </p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>
              Made by{" "}
              <span
                style={{ color: "rgba(255,255,255,0.55)", fontWeight: 600 }}
              >
                Web Dude,
              </span>
              <Link
                href="https://neohive.in"
                target="_blank"
                rel="noopener noreferrer"
                className="neohive-link"
              >
                Neohive Technologies
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
