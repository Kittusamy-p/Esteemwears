"use client";

import { dataMap } from "@/data";
import { Product } from "@/types/product";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useMemo, use } from "react";

type DataMap = Record<string, Product[]>;

function useInView(threshold = 0.12) {
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
  direction?: "up" | "left" | "right";
}) {
  const { ref, visible } = useInView();
  const transforms: Record<string, string> = {
    up: "translateY(56px)",
    left: "translateX(-56px)",
    right: "translateX(56px)",
  };
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0)" : transforms[direction],
        transition: `opacity 0.85s ease ${delay}s, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ── ANIMATED CARD ──────────────────────────────────────────────────── */
function ProductCard({
  product,
  categoryKey,
  index,
}: {
  product: Product;
  categoryKey: string;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  const lowestPrice = product.sizes?.length
    ? Math.min(...product.sizes.map((s) => s.price))
    : null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const tiltX = hovered ? ((mousePos.y - 50) / 50) * -6 : 0;
  const tiltY = hovered ? ((mousePos.x - 50) / 50) * 6 : 0;

  return (
    <Reveal delay={index * 0.07}>
      <Link
        href={`/catalogue/${categoryKey}/${product.slug}`}
        style={{ textDecoration: "none", display: "block" }}
      >
        <div
          ref={cardRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            setHovered(false);
            setMousePos({ x: 50, y: 50 });
          }}
          onMouseMove={handleMouseMove}
          style={{
            background: "#fff",
            border: `1px solid ${hovered ? "#c9a96e" : "#e8e2d9"}`,
            borderRadius: "10px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            cursor: "pointer",
            transform: hovered
              ? `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-10px) scale(1.02)`
              : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)",
            transition:
              "transform 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease, box-shadow 0.4s ease",
            boxShadow: hovered
              ? "0 28px 64px rgba(0,0,0,0.14), 0 0 0 1px rgba(201,169,110,0.2)"
              : "0 2px 16px rgba(0,0,0,0.04)",
            position: "relative",
          }}
        >
          {/* Shimmer overlay on hover */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              pointerEvents: "none",
              borderRadius: "10px",
              background: hovered
                ? `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(201,169,110,0.12) 0%, transparent 60%)`
                : "transparent",
              transition: "background 0.3s ease",
            }}
          />

          {/* Image area */}
          <div
            style={{
              width: "100%",
              aspectRatio: "4/3",
              background: "linear-gradient(135deg,#f7f3ed,#ede7db)",
              overflow: "hidden",
              position: "relative",
              flexShrink: 0,
            }}
          >
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  objectFit: "contain",
                  padding: "20px",
                  transform: hovered ? "scale(1.08)" : "scale(1)",
                  transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
                }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  fontSize: "64px",
                  transform: hovered
                    ? "scale(1.15) rotate(-5deg)"
                    : "scale(1) rotate(0deg)",
                  transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                👕
              </div>
            )}

            {/* Top-right badge */}
            <div
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                zIndex: 3,
                background: "#1a1a1a",
                color: "#c9a96e",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.1em",
                padding: "5px 10px",
                borderRadius: "100px",
                textTransform: "uppercase",
                transform: hovered
                  ? "translateY(0px) scale(1)"
                  : "translateY(-4px) scale(0.9)",
                opacity: hovered ? 1 : 0,
                transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              View →
            </div>

            {/* Bottom gradient */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "60px",
                background:
                  "linear-gradient(to top, rgba(247,243,237,0.8), transparent)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Info area */}
          <div
            style={{
              padding: "28px 28px 24px",
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            {/* Size badges */}
            {product.sizes && (
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  flexWrap: "wrap",
                  marginBottom: "14px",
                }}
              >
                {product.sizes.slice(0, 4).map((s, si) => (
                  <span
                    key={s.size}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: "100px",
                      background: hovered ? "#f0ebe0" : "#f5f2ec",
                      color: "#9a8a70",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      transform: hovered
                        ? `translateY(${-si * 1}px)`
                        : "translateY(0px)",
                      transition: `transform 0.4s cubic-bezier(0.16,1,0.3,1) ${si * 0.04}s`,
                    }}
                  >
                    {s.size}
                  </span>
                ))}
                {product.sizes.length > 4 && (
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: "100px",
                      background: "#c9a96e22",
                      color: "#c9a96e",
                      letterSpacing: "0.06em",
                    }}
                  >
                    +{product.sizes.length - 4} more
                  </span>
                )}
              </div>
            )}

            {/* Name */}
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "18px",
                fontWeight: 800,
                color: "#1a1a1a",
                lineHeight: 1.3,
                marginBottom: "16px",
                flexGrow: 1,
              }}
            >
              {product.name}
            </h2>

            {/* Divider that animates in */}
            <div
              style={{
                height: "1px",
                background: "linear-gradient(90deg, #c9a96e, transparent)",
                marginBottom: "16px",
                transform: hovered ? "scaleX(1)" : "scaleX(0.3)",
                transformOrigin: "left",
                transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
              }}
            />

            {/* Price row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#aaa",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: "2px",
                  }}
                >
                  Starting at
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "26px",
                    fontWeight: 800,
                    color: "#c9a96e",
                    transform: hovered ? "scale(1.06)" : "scale(1)",
                    transformOrigin: "left",
                    transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
                    display: "inline-block",
                  }}
                >
                  ₹{lowestPrice ?? "N/A"}
                </div>
              </div>

              {/* Arrow button */}
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: hovered ? "#c9a96e" : "#f0ebe0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  transform: hovered
                    ? "rotate(45deg) scale(1.1)"
                    : "rotate(0deg) scale(1)",
                  transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    color: hovered ? "#1a1a1a" : "#c9a96e",
                    transition: "color 0.3s",
                  }}
                >
                  ↗
                </span>
              </div>
            </div>
          </div>

          {/* Bottom shimmer bar */}
          <div
            style={{
              height: "3px",
              background: "linear-gradient(90deg, #c9a96e, #d4b896, #c9a96e)",
              backgroundSize: "200% 100%",
              transform: hovered ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left",
              transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
              animation: hovered ? "gradientSlide 2s linear infinite" : "none",
            }}
          />
        </div>
      </Link>
    </Reveal>
  );
}

/* ── CSS ────────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes gradientSlide {
    0% { background-position: 0% 0%; }
    100% { background-position: 200% 0%; }
  }
  @keyframes heroFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(32px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmerSweep {
    0% { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  @keyframes countBadge {
    from { transform: scale(0.7); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes rotateSlow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }

  @media (max-width: 1024px) { .product-grid { grid-template-columns: repeat(2, 1fr) !important; } }
  @media (max-width: 600px) { .product-grid { grid-template-columns: 1fr !important; } }
`;

/* ── PAGE ───────────────────────────────────────────────────────────── */
export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);
  const key = resolvedParams.category.toLowerCase();

  const products = useMemo(() => {
    const data = dataMap as unknown as DataMap;
    return data[key] || [];
  }, [key]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#fafaf7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <style>{css}</style>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              position: "relative",
              width: "56px",
              height: "56px",
              margin: "0 auto 20px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                border: "2px solid #e8ddd0",
                borderTopColor: "#c9a96e",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: "10px",
                border: "2px solid transparent",
                borderTopColor: "rgba(201,169,110,0.35)",
                borderRadius: "50%",
                animation: "spin 1.6s linear infinite reverse",
              }}
            />
          </div>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#b09a78",
            }}
          >
            Loading…
          </p>
        </div>
      </div>
    );

  if (products.length === 0)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <style>{css}</style>
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "40px",
              marginBottom: "16px",
              color: "#1a1a1a",
            }}
          >
            Category Not Found
          </h1>
          <Link
            href="/catalogue"
            style={{
              color: "#c9a96e",
              fontWeight: 700,
              textDecoration: "none",
              letterSpacing: "0.08em",
            }}
          >
            ← Return to Catalogue
          </Link>
        </div>
      </div>
    );

  const categoryTitle = key.charAt(0).toUpperCase() + key.slice(1);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div
        style={{
          background: "#fafaf7",
          minHeight: "100vh",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section
          style={{
            background: "#1a1a1a",
            color: "#fff",
            padding: "100px 48px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative ambient orbs */}
          <div
            style={{
              position: "absolute",
              top: "-60px",
              right: "-60px",
              width: "350px",
              height: "350px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%)",
              animation: "pulse 6s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-80px",
              left: "10%",
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)",
              animation: "pulse 8s ease-in-out infinite 2s",
              pointerEvents: "none",
            }}
          />
          {/* Rotating ring */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "120px",
              width: "160px",
              height: "160px",
              border: "1px solid rgba(201,169,110,0.15)",
              borderRadius: "50%",
              animation: "rotateSlow 20s linear infinite",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "40px",
              right: "140px",
              width: "120px",
              height: "120px",
              border: "1px solid rgba(201,169,110,0.08)",
              borderRadius: "50%",
              animation: "rotateSlow 14s linear infinite reverse",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              position: "relative",
            }}
          >
            <Reveal>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                <Link
                  href="/catalogue"
                  style={{
                    color: "#7a7a7a",
                    textDecoration: "none",
                    fontSize: "13px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#c9a96e")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#7a7a7a")
                  }
                >
                  Catalogue
                </Link>
                <span style={{ color: "#444", fontSize: "16px" }}>›</span>
                <span
                  style={{
                    color: "#c9a96e",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {categoryTitle}
                </span>
              </div>
              <span
                style={{
                  color: "#c9a96e",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "12px",
                }}
              >
                Collection
              </span>
              <h1
                style={{
                  fontSize: "clamp(40px, 6vw, 72px)",
                  fontFamily: "'Playfair Display', serif",
                  color: "#fff",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  marginBottom: "20px",
                }}
              >
                {categoryTitle}
                <br />
                <em style={{ color: "#c9a96e", fontStyle: "italic" }}>
                  Innerwear
                </em>
              </h1>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "24px",
                  marginTop: "32px",
                }}
              >
                <div
                  style={{
                    padding: "8px 20px",
                    border: "1px solid rgba(201,169,110,0.4)",
                    borderRadius: "100px",
                    fontSize: "13px",
                    color: "#c9a96e",
                    fontWeight: 600,
                  }}
                >
                  {products.length} Products
                </div>
                <div
                  style={{ width: "1px", height: "20px", background: "#333" }}
                />
                <span style={{ fontSize: "13px", color: "#777" }}>
                  100% Pure Cotton · Trusted Sellers
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── GRID ──────────────────────────────────────────────────── */}
        <section
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 32px" }}
        >
          <div
            className="product-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "32px",
            }}
          >
            {products.map((product, i) => (
              <ProductCard
                key={`${product.slug}-${i}`}
                product={product}
                categoryKey={key}
                index={i}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
