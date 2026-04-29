"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "fade";
}) {
  const { ref, visible } = useInView();
  const transforms: Record<string, string> = {
    up: "translateY(56px)",
    left: "translateX(-56px)",
    right: "translateX(56px)",
    fade: "translateY(0px)",
  };
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0)" : transforms[direction],
        transition: `opacity 0.9s ease ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { overflow-x: hidden; }

  @keyframes rotateSlow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .cta-primary {
    display: inline-block;
    background: #c9a96e;
    color: #1a1a1a;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 16px 36px;
    border-radius: 2px;
    text-decoration: none;
    transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  }
  .cta-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 36px rgba(201,169,110,0.35);
    background: #d4b896;
  }

  .category-card {
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    border: 1px solid #ede8e0;
    transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
    aspect-ratio: 4/3;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .category-card:hover {
    border-color: #c9a96e;
    transform: translateY(-8px);
    box-shadow: 0 24px 60px rgba(0,0,0,0.1);
  }

  @media (max-width: 900px) {
    .grid-3 { grid-template-columns: 1fr 1fr !important; }
  }
  @media (max-width: 600px) {
    .hero-title { font-size: 48px !important; }
    .grid-3 { grid-template-columns: 1fr !important; }
  }
`;

export default function Catalogue() {
  const categories = [
    {
      name: "Boys",
      desc: "Ages 2 - 14",
      products: "10+ Products",
      slug: "boys",
    },
    {
      name: "Girls",
      desc: "Ages 2 - 14",
      products: "4+ Products",
      slug: "girls",
    },
    {
      name: "Men",
      desc: "Fit for all",
      products: "4+ Products",
      slug: "men",
    },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          overflowX: "hidden",
          background: "#fafaf7",
          color: "#1a1a1a",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section
          style={{
            minHeight: "80vh",
            background:
              "linear-gradient(150deg, #141414 0%, #1e1a16 60%, #241e18 100%)",
            display: "flex",
            alignItems: "center",
            padding: "120px 48px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Geometry */}
          <div
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            <div
              style={{
                position: "absolute",
                top: "-15%",
                right: "-8%",
                width: "680px",
                height: "680px",
                border: "1px solid rgba(201,169,110,0.08)",
                borderRadius: "50%",
                animation: "rotateSlow 40s linear infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "20%",
                right: "10%",
                width: "500px",
                height: "500px",
                background:
                  "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)",
                borderRadius: "50%",
              }}
            />
          </div>

          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              position: "relative",
              width: "100%",
            }}
          >
            <Reveal>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "32px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "1px",
                    background: "#c9a96e",
                  }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#c9a96e",
                  }}
                >
                  Shop All Products
                </span>
              </div>
            </Reveal>

            <div style={{ marginBottom: "28px" }}>
              <h1
                className="hero-title"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "76px",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.02,
                  letterSpacing: "-0.025em",
                }}
              >
                Comfort for
                <br />
                <em style={{ fontStyle: "italic", color: "#c9a96e" }}>
                  Every Family
                </em>
              </h1>
            </div>

            <Reveal>
              <p
                style={{
                  fontSize: "16px",
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.85,
                  maxWidth: "540px",
                  fontWeight: 400,
                }}
              >
                100% organic cotton innerwear designed for every age, every
                season, and every lifestyle. Browse our complete range and find
                your perfect fit.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── CATEGORIES ────────────────────────────────────────────────── */}
        <section
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "140px 48px",
          }}
        >
          <div style={{ marginBottom: "72px" }}>
            <Reveal direction="up">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "1px",
                    background: "#c9a96e",
                  }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#c9a96e",
                  }}
                >
                  Collections
                </span>
              </div>
            </Reveal>
            <Reveal direction="up" delay={0.1}>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "52px",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: "#1a1a1a",
                  letterSpacing: "-0.02em",
                }}
              >
                Choose Your Category
              </h2>
            </Reveal>
          </div>

          <div
            className="grid-3"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "28px",
            }}
          >
            {categories.map((cat, i) => (
              <Reveal key={cat.slug} direction="up" delay={i * 0.12}>
                <Link href={`/catalogue/${cat.slug}`}>
                  <div className="category-card">
                    <div style={{ textAlign: "center" }}>
                      <h3
                        style={{
                          fontSize: "28px",
                          fontWeight: 800,
                          color: "#1a1a1a",
                          fontFamily: "'Playfair Display', serif",
                          marginBottom: "6px",
                        }}
                      >
                        {cat.name}
                      </h3>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#c9a96e",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          marginBottom: "12px",
                        }}
                      >
                        {cat.desc}
                      </p>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#7a7a7a",
                        }}
                      >
                        {cat.products}
                      </p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── FEATURES ──────────────────────────────────────────────────── */}
        <section
          style={{
            background: "#f5f0e8",
            padding: "100px 48px",
          }}
        >
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <Reveal direction="up">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "1px",
                    background: "#c9a96e",
                  }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#c9a96e",
                  }}
                >
                  Why Shop With Us
                </span>
                <div
                  style={{
                    width: "40px",
                    height: "1px",
                    background: "#c9a96e",
                  }}
                />
              </div>
            </Reveal>
            <Reveal direction="up" delay={0.1}>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "48px",
                  fontWeight: 800,
                  color: "#1a1a1a",
                  letterSpacing: "-0.02em",
                  textAlign: "center",
                  marginBottom: "56px",
                }}
              >
                Quality Guaranteed
              </h2>
            </Reveal>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "24px",
              }}
            >
              {[
                {
                  title: "100% Organic Cotton",
                  desc: "Premium, certified organic cotton for comfort and breathability.",
                },
                {
                  title: "Skin-Safe Dyes",
                  desc: "Hypoallergenic dyes tested for sensitive skin. No harmful chemicals.",
                },
                {
                  title: "Easy Returns",
                  desc: "30-day returns on all items. Free returns on marketplace orders.",
                },
                {
                  title: "Fast Shipping",
                  desc: "Prime orders ship within 24 hours. Most arrive in 2–3 days.",
                },
              ].map((item, i) => (
                <Reveal key={item.title} direction="up" delay={i * 0.1}>
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #ede8e0",
                      borderRadius: "4px",
                      padding: "32px 28px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "#c9a96e";
                      (e.currentTarget as HTMLDivElement).style.transform =
                        "translateY(-6px)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "0 20px 60px rgba(0,0,0,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "#ede8e0";
                      (e.currentTarget as HTMLDivElement).style.transform =
                        "translateY(0)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "none";
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#1a1a1a",
                        marginBottom: "12px",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#7a7a7a",
                        lineHeight: 1.75,
                        margin: 0,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section
          style={{
            background:
              "linear-gradient(150deg, #141414 0%, #1e1a16 60%, #241e18 100%)",
            padding: "140px 48px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "700px",
                height: "700px",
                border: "1px solid rgba(201,169,110,0.06)",
                borderRadius: "50%",
              }}
            />
          </div>

          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              textAlign: "center",
              position: "relative",
            }}
          >
            <Reveal direction="up">
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "60px",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.05,
                  letterSpacing: "-0.025em",
                  marginBottom: "28px",
                }}
              >
                Start Shopping
              </h2>
            </Reveal>

            <Reveal direction="up" delay={0.1}>
              <p
                style={{
                  fontSize: "16px",
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.85,
                  marginBottom: "48px",
                }}
              >
                Browse your favourite category above or shop directly on Amazon,
                Flipkart, and Meesho.
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.2}>
              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  className="cta-primary"
                  href="https://www.meesho.com/EsteemWears"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop Meesho
                </Link>
                <Link
                  className="cta-primary"
                  href="https://www.amazon.in/s?rh=n%3A1571271031%2Cp_4%3AEsteem"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop Amazon
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}
