"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

/* ── Intersection-observer hook ── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
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

/* ── Reveal wrapper — one div, CSS transition ── */
const TRANSFORMS: Record<string, string> = {
  up: "translateY(56px)",
  left: "translateX(-56px)",
  right: "translateX(56px)",
  fade: "none",
};
function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "fade";
  className?: string;
  style?: React.CSSProperties;
}) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : TRANSFORMS[direction],
        transition: `opacity .9s ease ${delay}s, transform .9s cubic-bezier(.16,1,.3,1) ${delay}s`,
        willChange: "opacity,transform",
      }}
    >
      {children}
    </div>
  );
}

/* ── CountUp ── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useInView();
  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1800, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, target]);
  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ── Data ── */
const ACCENTS = [
  "#c9a96e",
  "#8b9e7a",
  "#7a8b9e",
  "#9e7a8b",
  "#8b7a9e",
  "#9e8b7a",
];
const FEATURES = [
  {
    title: "100% Organic Cotton",
    desc: "Only the finest certified organic cotton — soft, breathable, and completely free from harmful chemicals.",
  },
  {
    title: "Skin-Safe Dyes",
    desc: "Certified hypoallergenic dyes gentle on all skin types, from newborns to seniors.",
  },
  {
    title: "Built to Last",
    desc: "Decades of garment expertise behind every stitch — engineered for durability without sacrificing comfort.",
  },
  {
    title: "For the Whole Family",
    desc: "Kids to adults — our full range covers every age, size, and need under one trusted brand.",
  },
  {
    title: "Always Affordable",
    desc: "Premium quality should never carry a premium price. The best value in Indian innerwear.",
  },
  {
    title: "Reliable Supply",
    desc: "Strong operational backbone ensures products are always in stock — fast dispatch, no delays.",
  },
];
const STATS = [
  { value: 100000, suffix: "+", label: "Customer Reviews" },
  { value: 4, suffix: ".1+", label: "Avg Rating" },
  { value: 40, suffix: "+", label: "Years Expertise" },
  { value: 10, suffix: "+", label: "Years Online" },
];
const PLATFORMS = [
  {
    name: "Amazon",
    badge: "Prime Seller",
    color: "#883D11",
    desc: "Buy any 2 products from us on Amazon, get 10% off.",
    links: [
      {
        label: "Esteem Innerwear",
        href: "https://www.amazon.in/storefront?me=A34AJOT31SQCLN",
      },
    ],
  },
  {
    name: "Flipkart",
    badge: "Golden Seller",
    color: "#2874F0",
    desc: "Flipkart Plus benefits. Fast 2-day shipping across India.",
    links: [
      {
        label: "Keyar Exports",
        href: "https://www.flipkart.com/search?q=ESTEEM%20innerwear&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off",
      },
    ],
  },
  {
    name: "Meesho",
    badge: "Top Seller",
    color: "#9B30D9",
    desc: "Available all across India.",
    links: [
      { label: "Keyar Exports", href: "https://www.meesho.com/KEYAREXPORTS" },
      { label: "ARS Clothing", href: "https://www.meesho.com/ARSCLOTHING" },
      { label: "Esteem Wears", href: "https://www.meesho.com/EsteemWears" },
    ],
  },
];

/* ── Global CSS — single injection ── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{overflow-x:hidden}

@keyframes fadeSlideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes marquee{to{transform:translateX(-50%)}}
@keyframes rotateSlow{to{transform:rotate(360deg)}}
@keyframes scrollLine{0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(6px);opacity:.4}}
@keyframes awardFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}

/* Hero entrance */
.h1{animation:fadeSlideUp 1s cubic-bezier(.16,1,.3,1) .1s both}
.h2{animation:fadeSlideUp 1s cubic-bezier(.16,1,.3,1) .25s both}
.h3{animation:fadeSlideUp 1s cubic-bezier(.16,1,.3,1) .4s both}
.h4{animation:fadeSlideUp 1s cubic-bezier(.16,1,.3,1) .55s both}
.hv{animation:fadeIn 1.4s ease .3s both}

/* Background rings — pure CSS, no extra DOM wrappers */
.ring1{animation:rotateSlow 40s linear infinite}
.ring2{animation:rotateSlow 28s linear infinite reverse}
.scroll-line{animation:scrollLine 2s ease-in-out infinite}
.marquee-track{animation:marquee 22s linear infinite;display:flex;white-space:nowrap;will-change:transform}
.award-img{animation:awardFloat 4s ease-in-out infinite}

/* Buttons */
.cta-primary{display:inline-block;background:#c9a96e;color:#1a1a1a;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:16px 36px;border-radius:2px;text-decoration:none;transition:transform .25s,box-shadow .25s,background .25s}
.cta-primary:hover{transform:translateY(-3px);box-shadow:0 12px 36px rgba(201,169,110,.35);background:#d4b896}
.cta-ghost{display:inline-block;background:transparent;color:rgba(255,255,255,.75);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:15px 36px;border-radius:2px;border:1px solid rgba(255,255,255,.2);text-decoration:none;transition:border-color .25s,color .25s,transform .25s}
.cta-ghost:hover{border-color:rgba(255,255,255,.5);color:#fff;transform:translateY(-3px)}

/* Feature card */
.fc{background:#fafaf7;border:1px solid #e8e2d9;border-radius:4px;padding:36px 32px;transition:background .35s cubic-bezier(.16,1,.3,1),border-color .35s,transform .35s,box-shadow .35s;cursor:default;position:relative}
.fc:hover{background:#fff;border-color:var(--ac);transform:translateY(-6px);box-shadow:0 20px 60px rgba(0,0,0,.08)}
.fc-bar{width:32px;height:2px;background:var(--ac);margin-bottom:24px;transition:width .35s}
.fc:hover .fc-bar{width:48px}
.fc-title{font-size:17px;font-weight:700;color:#1a1a1a;margin-bottom:12px;font-family:'DM Sans',sans-serif;letter-spacing:-.01em}
.fc-desc{font-size:14px;color:#7a7a7a;line-height:1.75;font-family:'DM Sans',sans-serif}

/* Stat card */
.sc{border-left:1px solid rgba(255,255,255,.12);padding-left:36px}
.sc-val{font-family:'Playfair Display',serif;font-size:52px;font-weight:800;color:#c9a96e;line-height:1;letter-spacing:-.02em}
.sc-lbl{font-size:13px;color:rgba(255,255,255,.4);margin-top:10px;font-family:'DM Sans',sans-serif;font-weight:500;letter-spacing:.04em;text-transform:uppercase}

/* Platform card */
.pc{padding:40px;background:#fafaf7;border:1px solid #e8e2d9;border-radius:4px}
.pc-name{font-size:32px;font-weight:800;color:#1a1a1a;font-family:'Playfair Display',serif;margin-bottom:6px}
.pc-badge{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:16px}
.pc-desc{font-size:14px;color:#7a7a7a;line-height:1.75;margin:0 0 24px}
.pc-link{display:inline-flex;align-items:center;gap:6px;font-size:18px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;border-bottom-width:1px;border-bottom-style:solid;padding-bottom:2px}
.pc-note{font-size:14px;color:#7a7a7a;line-height:1.75;margin:24px 0 0}

/* Labels & tags */
.eyebrow{font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#c9a96e;font-family:'DM Sans',sans-serif}
.tag{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#8a7a6a;background:#f0ece4;border:1px solid #e0d8cc;border-radius:2px;padding:8px 16px;font-family:'DM Sans',sans-serif}

/* Grid line decoration — single pseudo on parent, no extra DOM nodes */
.grid-lines{position:absolute;inset:0;pointer-events:none;
  background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.02) 0,rgba(255,255,255,.02) 1px,transparent 1px,transparent 20%);
  background-size:20% 100%}

/* Responsive */
@media(max-width:900px){
  .hero-grid{flex-direction:column!important}
  .features-grid{grid-template-columns:1fr 1fr!important}
  .stats-row{flex-direction:column!important;gap:32px!important}
  .story-grid{flex-direction:column!important}
  .trust-inner{flex-direction:column!important;align-items:center!important;text-align:center}
  .three-col{grid-template-columns:1fr 1fr!important}
}
@media(max-width:600px){
  .features-grid{grid-template-columns:1fr!important}
  .three-col{grid-template-columns:1fr!important}
  .hero-title{font-size:48px!important}
}
`;

export default function HomePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div
        style={{
          fontFamily: "'DM Sans',sans-serif",
          background: "#fafaf7",
          color: "#1a1a1a",
        }}
      >
        {/* ── HERO ── */}
        <section
          style={{
            minHeight: "100vh",
            background:
              "linear-gradient(150deg,#141414 0%,#1e1a16 60%,#241e18 100%)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            paddingTop: "88px",
          }}
        >
          {/* BG rings — 2 divs instead of 7+ */}
          <div className="grid-lines" />
          <div
            className="ring1"
            style={{
              position: "absolute",
              top: "-15%",
              right: "-8%",
              width: "680px",
              height: "680px",
              border: "1px solid rgba(201,169,110,.08)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />
          <div
            className="ring2"
            style={{
              position: "absolute",
              top: "-5%",
              right: "2%",
              width: "480px",
              height: "480px",
              border: "1px solid rgba(201,169,110,.05)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />
          {/* radial glow via box-shadow on ring1, no extra div needed */}

          <div
            className="hero-grid"
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "80px 48px",
              display: "flex",
              alignItems: "center",
              gap: "80px",
              width: "100%",
              position: "relative",
            }}
          >
            {/* LEFT */}
            <div style={{ flex: 1 }}>
              <div className="h1" style={{ marginBottom: "32px" }}>
                <div
                  style={{
                    display: "inline-flex",
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
                  <span className="eyebrow">
                    Est. Tiruppur · Since 30+ Years
                  </span>
                </div>
              </div>
              <h1
                className="hero-title h2"
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "76px",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.02,
                  letterSpacing: "-.025em",
                  marginBottom: "32px",
                }}
              >
                Comfort
                <br />
                <em style={{ fontStyle: "italic", color: "#c9a96e" }}>
                  Knitted
                </em>
                <br />
                into Every
                <br />
                Thread.
              </h1>
              <p
                className="h3"
                style={{
                  fontSize: "16px",
                  color: "rgba(255,255,255,.5)",
                  lineHeight: 1.85,
                  maxWidth: "420px",
                  marginBottom: "44px",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                100% organic cotton innerwear for every member of your family —
                crafted with four decades of expertise and skin-safe dyes.
                Trusted by over one lakh families across India.
              </p>
            </div>

            {/* RIGHT */}
            <div
              className="hero-visual hv"
              style={{
                flex: "1 1 420px",
                maxWidth: "420px",
                position: "relative",
              }}
            >
              <div
                className="h4"
                style={{
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                  marginBottom: "36px",
                }}
              >
                <Link href="/catalogue" className="cta-primary">
                  Shop Collection
                </Link>
                <Link href="#story" className="cta-ghost">
                  Our Story
                </Link>
              </div>
              <div
                className="h4"
                style={{
                  display: "flex",
                  gap: 0,
                  paddingTop: "36px",
                  borderTop: "1px solid rgba(255,255,255,.07)",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { n: "40+", l: "Years Expertise" },
                  { n: "1L+", l: "Reviews" },
                  { n: "4.1★", l: "Avg Rating" },
                ].map((s, i) => (
                  <div
                    key={s.l}
                    style={{
                      paddingRight: "40px",
                      marginRight: "40px",
                      borderRight:
                        i < 2 ? "1px solid rgba(255,255,255,.08)" : "none",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: "32px",
                        fontWeight: 800,
                        color: "#c9a96e",
                        lineHeight: 1,
                      }}
                    >
                      {s.n}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "rgba(255,255,255,.35)",
                        marginTop: "6px",
                        fontWeight: 500,
                        letterSpacing: ".06em",
                        textTransform: "uppercase",
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                    >
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div
            style={{
              position: "absolute",
              bottom: "36px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              animation: "fadeIn 1s ease 1.4s both",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.25)",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Scroll
            </span>
            <div
              className="scroll-line"
              style={{
                width: "1px",
                height: "56px",
                background:
                  "linear-gradient(to bottom,rgba(201,169,110,.6),transparent)",
              }}
            />
          </div>
        </section>

        {/* ── MARQUEE — single CSS animation, items duplicated via CSS not JS ── */}
        <div
          style={{
            background: "#c9a96e",
            padding: "16px 0",
            overflow: "hidden",
          }}
        >
          <div className="marquee-track">
            {/* Two copies is enough for seamless loop */}
            {[0, 1].map((copy) => (
              <span key={copy} style={{ display: "contents" }}>
                {[
                  "100% Organic Cotton",
                  "Skin-Safe Dyes",
                  "Family Innerwear",
                  "30+ Years Craftsmanship",
                  "1 Lakh+ Reviews",
                  "Amazon Prime Seller",
                  "Flipkart Golden Seller",
                  "Meesho Top Seller",
                ].map((item, i) => (
                  <span
                    key={`${copy}-${i}`}
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#1a1a1a",
                      letterSpacing: ".14em",
                      textTransform: "uppercase",
                      marginRight: "56px",
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    {item}
                    <span style={{ marginLeft: "56px", opacity: 0.4 }}>—</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ── STORY ── */}
        <section
          id="story"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "140px 48px",
          }}
        >
          <div
            className="story-grid"
            style={{ display: "flex", gap: "100px", alignItems: "center" }}
          >
            <Reveal direction="left" style={{ flex: "0 0 400px" }}>
              <div
                style={{
                  background: "#1a1a1a",
                  borderRadius: "4px",
                  padding: "60px 52px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Corner accents via pseudo-elements in CSS would be cleaner but inline is fine for 2 divs */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "100px",
                    height: "100px",
                    borderBottom: "1px solid rgba(201,169,110,.15)",
                    borderLeft: "1px solid rgba(201,169,110,.15)",
                  }}
                />
                <span
                  className="eyebrow"
                  style={{ display: "block", marginBottom: "20px" }}
                >
                  Founder
                </span>
                <div
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: "64px",
                    fontWeight: 800,
                    color: "#c9a96e",
                    lineHeight: 1,
                    marginBottom: "4px",
                  }}
                >
                  40+
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "rgba(255,255,255,.4)",
                    fontFamily: "'DM Sans',sans-serif",
                    marginBottom: "48px",
                  }}
                >
                  Years of mastery
                </div>
                <div
                  style={{
                    paddingTop: "32px",
                    borderTop: "1px solid rgba(255,255,255,.08)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#fff",
                      fontFamily: "'DM Sans',sans-serif",
                      marginBottom: "4px",
                    }}
                  >
                    Krishnaswamy P
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,.35)",
                      fontFamily: "'DM Sans',sans-serif",
                      letterSpacing: ".06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Founder &amp; Director
                  </div>
                </div>
              </div>
            </Reveal>

            <div style={{ flex: 1 }}>
              <Reveal direction="right" delay={0.1}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "1px",
                      background: "#c9a96e",
                    }}
                  />
                  <span className="eyebrow">Our Legacy</span>
                </div>
              </Reveal>
              <Reveal direction="right" delay={0.2}>
                <h2
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: "54px",
                    fontWeight: 800,
                    lineHeight: 1.08,
                    color: "#1a1a1a",
                    letterSpacing: "-.02em",
                    marginBottom: "32px",
                  }}
                >
                  Three Decades
                  <br />
                  <em
                    style={{
                      fontStyle: "italic",
                      color: "#6b6b6b",
                      fontWeight: 700,
                    }}
                  >
                    of Trust
                  </em>
                </h2>
              </Reveal>
              <Reveal direction="right" delay={0.3}>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#6b6b6b",
                    lineHeight: 1.85,
                    marginBottom: "20px",
                    maxWidth: "520px",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  Esteem Innerwear was born in Tiruppur — India&apos;s textile
                  capital — with a simple mission: bring comfort that every
                  family deserves. Our founder Krishnaswamy P spent over four
                  decades mastering the art of garment manufacturing before
                  channeling that expertise into Esteem.
                </p>
              </Reveal>
              <Reveal direction="right" delay={0.4}>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#6b6b6b",
                    lineHeight: 1.85,
                    marginBottom: "44px",
                    maxWidth: "520px",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  From traditional craftsmanship to modern e-commerce, we
                  combine both worlds — serving customers on Amazon, Flipkart,
                  and Meesho for over a decade with an unbroken commitment to
                  quality, comfort, and affordability.
                </p>
              </Reveal>
              <Reveal direction="right" delay={0.5}>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {[
                    "Tiruppur-Based",
                    "Family Values",
                    "Organic Materials",
                    "10+ Years Online",
                  ].map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section
          style={{
            background: "#141414",
            padding: "120px 48px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="grid-lines" />
          <div
            className="trust-inner"
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: "64px",
              position: "relative",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <Reveal direction="up">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "1px",
                      background: "#c9a96e",
                    }}
                  />
                  <span className="eyebrow">By the Numbers</span>
                </div>
              </Reveal>
              <Reveal direction="up" delay={0.1}>
                <h2
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: "52px",
                    fontWeight: 800,
                    color: "#fff",
                    letterSpacing: "-.02em",
                    marginBottom: "72px",
                  }}
                >
                  Trust, Measured.
                </h2>
              </Reveal>
              <div className="stats-row" style={{ display: "flex" }}>
                {STATS.map((s, i) => (
                  <Reveal
                    key={s.label}
                    direction="up"
                    delay={0.1 + i * 0.05}
                    className="sc"
                  >
                    <div className="sc-val">
                      <CountUp target={s.value} suffix={s.suffix} />
                    </div>
                    <div className="sc-lbl">{s.label}</div>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal direction="up" delay={0.2}>
              <div
                style={{
                  flexShrink: 0,
                  width: "260px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: "220px",
                      height: "220px",
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle,rgba(201,169,110,.18) 0%,transparent 70%)",
                    }}
                  />
                  <Image
                    src="https://res.cloudinary.com/desmywzoz/image/upload/v1777385399/gold_seller_shbjad.png"
                    alt="Gold Seller Award"
                    width={180}
                    height={180}
                    className="award-img"
                    style={{
                      width: "350px",
                      height: "auto",
                      objectFit: "contain",
                      position: "relative",
                      zIndex: 1,
                      filter: "drop-shadow(0 8px 32px rgba(201,169,110,.35))",
                    }}
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div className="eyebrow" style={{ marginBottom: "6px" }}>
                    Gold Seller Excellence
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "rgba(255,255,255,.4)",
                      fontFamily: "'DM Sans',sans-serif",
                      lineHeight: 1.6,
                    }}
                  >
                    Top Seller on Flipkart.
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "140px 48px",
          }}
        >
          <Reveal direction="up" style={{ marginBottom: "80px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{ width: "40px", height: "1px", background: "#c9a96e" }}
              />
              <span className="eyebrow">Why Esteem</span>
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "52px",
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#1a1a1a",
                letterSpacing: "-.02em",
                maxWidth: "480px",
              }}
            >
              Crafted for Every Family.
            </h2>
          </Reveal>
          <div
            className="features-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: "20px",
            }}
          >
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} direction="up" delay={i * 0.08}>
                <div
                  className="fc"
                  style={
                    {
                      "--ac": ACCENTS[i % ACCENTS.length],
                    } as React.CSSProperties
                  }
                >
                  <div className="fc-bar" />
                  <h3 className="fc-title">{f.title}</h3>
                  <p className="fc-desc">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── PLATFORMS ── */}
        <section style={{ background: "#f5f0e8", padding: "120px 48px" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <Reveal
              direction="up"
              style={{ textAlign: "center", marginBottom: "80px" }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "1px",
                    background: "#c9a96e",
                  }}
                />
                <span className="eyebrow">Platform Recognition</span>
                <div
                  style={{
                    width: "40px",
                    height: "1px",
                    background: "#c9a96e",
                  }}
                />
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "52px",
                  fontWeight: 800,
                  color: "#1a1a1a",
                  letterSpacing: "-.02em",
                  marginBottom: "16px",
                }}
              >
                Trusted Nationwide.
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: "#7a7a7a",
                  maxWidth: "480px",
                  margin: "0 auto",
                  lineHeight: 1.8,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Over 1 lakh reviews and a 4.1+ rating across platforms — earned
                through decades of delivering on our promise.
              </p>
            </Reveal>

            <div
              className="three-col"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: "24px",
              }}
            >
              {PLATFORMS.map((p, i) => (
                <Reveal key={p.name} direction="up" delay={i * 0.12}>
                  <div className="pc">
                    <div
                      style={{
                        width: "48px",
                        height: "2px",
                        background: p.color,
                        marginBottom: "16px",
                      }}
                    />
                    <div className="pc-name">{p.name}</div>
                    <div className="pc-badge" style={{ color: p.color }}>
                      {p.badge}
                    </div>
                    <p className="pc-desc">{p.desc}</p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {p.links.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pc-link"
                          style={{ color: p.color, borderColor: p.color }}
                        >
                          {link.label}{" "}
                          <span style={{ fontSize: "14px" }}>→</span>
                        </Link>
                      ))}
                    </div>
                    <p className="pc-note">
                      View on the above platform to shop our full collection and
                      read reviews from verified customers.
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Rating */}
            <Reveal
              direction="up"
              delay={0.2}
              style={{ textAlign: "center", marginTop: "80px" }}
            >
              {/* Stars as CSS — no clipPath divs */}
              <div
                style={{
                  fontSize: "32px",
                  letterSpacing: "4px",
                  color: "#c9a96e",
                  marginBottom: "16px",
                }}
              >
                ★★★★<span style={{ opacity: 0.15 }}>★</span>
              </div>
              <div
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "72px",
                  fontWeight: 800,
                  color: "#1a1a1a",
                  lineHeight: 1,
                  letterSpacing: "-.03em",
                }}
              >
                4.1
                <span
                  style={{ fontSize: "28px", color: "#bbb", fontWeight: 700 }}
                >
                  /5
                </span>
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#9a9a9a",
                  marginTop: "12px",
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 500,
                  letterSpacing: ".04em",
                  textTransform: "uppercase",
                }}
              >
                Average across 1,00,000+ verified reviews
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          style={{
            background: "linear-gradient(150deg,#141414 0%,#1e1a16 100%)",
            padding: "140px 48px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Concentric rings via box-shadow on a single div instead of 2 divs */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: "700px",
              height: "700px",
              borderRadius: "50%",
              pointerEvents: "none",
              boxShadow:
                "0 0 0 200px rgba(201,169,110,.01), 0 0 0 1px rgba(201,169,110,.06), inset 0 0 0 200px rgba(201,169,110,.005), inset 0 0 0 1px rgba(201,169,110,.04)",
            }}
          />
          <div
            style={{
              maxWidth: "680px",
              margin: "0 auto",
              position: "relative",
            }}
          >
            <Reveal direction="up">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "16px",
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
                <span className="eyebrow">Shop Now</span>
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
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "60px",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.05,
                  letterSpacing: "-.025em",
                  marginBottom: "24px",
                }}
              >
                Comfort Your Family
                <br />
                <em style={{ fontStyle: "italic", color: "#c9a96e" }}>
                  Deserves.
                </em>
              </h2>
            </Reveal>
            <Reveal direction="up" delay={0.2}>
              <p
                style={{
                  fontSize: "16px",
                  color: "rgba(255,255,255,.45)",
                  lineHeight: 1.85,
                  marginBottom: "48px",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Join over one lakh families who have made Esteem their everyday
                choice. Shop our full collection on your preferred platform.
              </p>
            </Reveal>
            <Reveal direction="up" delay={0.3}>
              <a className="cta-primary" href="catalogue">
                View our products
              </a>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}
