"use client";

import { dataMap } from "@/data";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";

/* ─── INTERSECTION OBSERVER HOOK ─────────────────────────────────────── */
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

/* ─── REVEAL COMPONENT ───────────────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "down";
}) {
  const { ref, visible } = useInView();
  const transforms: Record<string, string> = {
    up: "translateY(64px)",
    down: "translateY(-64px)",
    left: "translateX(-64px)",
    right: "translateX(64px)",
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

/* ─── MAGNETIC BUTTON ────────────────────────────────────────────────── */
function MagneticBtn({
  children,
  className,
  style,
  onClick,
  href,
  target,
  rel,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
}) {
  const btnRef = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  };
  const handleLeave = () => {
    if (btnRef.current) btnRef.current.style.transform = "translate(0,0)";
  };
  const inner = href ? (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={className}
      style={{
        ...style,
        display: "block",
        transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {children}
    </Link>
  ) : (
    <button
      onClick={onClick}
      className={className}
      style={{
        ...style,
        transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {children}
    </button>
  );
  return (
    <div
      ref={btnRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        display: "inline-block",
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {inner}
    </div>
  );
}

/* ─── IMAGE CAROUSEL ─────────────────────────────────────────────────── */
function ImageCarousel({ images, icon }: { images: string[]; icon?: string }) {
  const [active, setActive] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null); // FIX: renamed from 'prev' to avoid conflict with the go() callback param
  const [dir, setDir] = useState<"left" | "right">("right");
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(0);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number, direction: "left" | "right") => {
      setPrevIdx(active);
      setDir(direction);
      setActive(next);
    },
    [active],
  );

  const goNext = useCallback(
    () => go((active + 1) % images.length, "right"),
    [active, go, images.length],
  );
  const goPrev = useCallback(
    () => go((active - 1 + images.length) % images.length, "left"),
    [active, go, images.length],
  );

  useEffect(() => {
    if (images.length <= 1) return;
    autoRef.current = setInterval(goNext, 3800);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [goNext, images.length]);

  const resetAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(goNext, 3800);
  }, [goNext]);

  const handleNext = () => {
    goNext();
    resetAuto();
  };
  const handlePrev = () => {
    goPrev();
    resetAuto();
  };

  const onDragStart = (clientX: number) => {
    setDragging(true);
    dragStart.current = clientX;
  };
  const onDragEnd = (clientX: number) => {
    if (!dragging) return;
    setDragging(false);
    const diff = dragStart.current - clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? handleNext() : handlePrev();
    }
  };

  if (images.length === 0) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg,#f5f0e8,#e8ddd0)",
          borderRadius: "12px",
          minHeight: "500px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "180px",
        }}
      >
        {icon || "👕"}
      </div>
    );
  }

  return (
    <div style={{ userSelect: "none" }}>
      {/* Main carousel — FIX: wrapper is position:relative so absolute children stack correctly */}
      <div
        style={{
          position: "relative",
          borderRadius: "12px",
          overflow: "hidden",
          background: "#f0ebe3",
          minHeight: "500px",
          cursor: dragging ? "grabbing" : "grab",
        }}
        onMouseDown={(e) => onDragStart(e.clientX)}
        onMouseUp={(e) => onDragEnd(e.clientX)}
        onMouseLeave={(e) => {
          if (dragging) onDragEnd(e.clientX);
        }}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}
      >
        {images.map((src, i) => {
          const isActive = i === active;
          const isPrev = i === prevIdx;
          // FIX: slides must be position:absolute to layer on top of each other
          // Only active and previous slides are rendered visibly; others are hidden off-screen
          let translateX = dir === "right" ? "100%" : "-100%";
          if (isActive) translateX = "0%";
          else if (isPrev) translateX = dir === "right" ? "-100%" : "100%";

          const isVisible = isActive || isPrev;

          return (
            <div
              key={i}
              style={{
                position: "absolute", // FIX: was 'relative', causing layout stacking issues
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                minHeight: "500px",
                transform: `translateX(${translateX})`,
                transition: isVisible
                  ? "transform 0.65s cubic-bezier(0.77,0,0.175,1)"
                  : "none",
                opacity: isVisible ? 1 : 0,
                zIndex: isActive ? 2 : isPrev ? 1 : 0,
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              <Image
                src={src}
                alt={`Product image ${i + 1}`}
                fill
                draggable={false}
                style={{ objectFit: "contain", padding: "24px" }}
              />
            </div>
          );
        })}

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(240,235,227,0.6) 0%, transparent 40%)",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />

        {/* Arrows */}
        {images.length > 1 && (
          <>
            {(["prev", "next"] as const).map((arrow) => (
              <button
                key={arrow}
                onClick={arrow === "prev" ? handlePrev : handleNext}
                style={{
                  position: "absolute",
                  top: "50%",
                  [arrow === "prev" ? "left" : "right"]: "16px",
                  transform: "translateY(-50%)",
                  zIndex: 4,
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.92)",
                  border: "1px solid #e0d8cc",
                  fontSize: "28px",
                  lineHeight: "1",
                  color: "#1a1a1a",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#c9a96e";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.92)";
                  e.currentTarget.style.color = "#1a1a1a";
                }}
              >
                {arrow === "prev" ? "‹" : "›"}
              </button>
            ))}
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "8px",
              zIndex: 4,
            }}
          >
            {images.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to image ${i + 1}`}
                onClick={() => {
                  go(i, i > active ? "right" : "left");
                  resetAuto();
                }}
                style={{
                  width: i === active ? "28px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  background:
                    i === active ? "#c9a96e" : "rgba(201,169,110,0.35)",
                  transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                  padding: 0,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "16px",
            flexWrap: "wrap",
          }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              role="button"
              aria-label={`View image ${i + 1}`}
              tabIndex={0}
              onClick={() => {
                go(i, i > active ? "right" : "left");
                resetAuto();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  go(i, i > active ? "right" : "left");
                  resetAuto();
                }
              }}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "8px",
                overflow: "hidden",
                border:
                  active === i ? "2px solid #c9a96e" : "2px solid transparent",
                cursor: "pointer",
                background: "#f0ebe3",
                boxShadow:
                  active === i ? "0 0 0 3px rgba(201,169,110,0.25)" : "none",
                transition: "all 0.3s ease",
                transform: active === i ? "scale(1.05)" : "scale(1)",
                position: "relative",
              }}
            >
              <Image
                src={src}
                alt=""
                fill
                style={{ objectFit: "contain", padding: "6px" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── FLOATING PARTICLE ──────────────────────────────────────────────── */
function FloatingDot({ style }: { style: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", borderRadius: "50%", ...style }} />
  );
}

/* ─── CSS STRING ─────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  @keyframes floatY {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-18px) rotate(3deg); }
    66% { transform: translateY(-8px) rotate(-2deg); }
  }
  @keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes pricePulse {
    0%, 100% { text-shadow: 0 0 0px rgba(201,169,110,0); }
    50% { text-shadow: 0 0 30px rgba(201,169,110,0.5); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes borderGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201,169,110,0); }
    50% { box-shadow: 0 0 0 4px rgba(201,169,110,0.25); }
  }
  @keyframes iconBounce {
    0%, 100% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(1.1) rotate(-3deg); }
    75% { transform: scale(1.05) rotate(2deg); }
  }

  .cta-primary {
    display: inline-block;
    background: linear-gradient(135deg, #c9a96e 0%, #d4b896 50%, #c9a96e 100%);
    background-size: 200% 200%;
    color: #1a1a1a;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 18px 40px;
    border-radius: 3px;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    animation: gradientShift 4s ease infinite;
    position: relative;
    overflow: hidden;
  }
  .cta-primary::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
    transition: left 0.5s ease;
  }
  .cta-primary:hover::after { left: 150%; }
  .cta-primary:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(201,169,110,0.45);
  }

  /* FIX: size-badge is a <button> natively; removed the stale <span> z-index trick */
  .size-badge {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    padding: 10px 16px;
    border: 1.5px solid #ede8e0;
    border-radius: 3px;
    background: #fff;
    color: #1a1a1a;
    cursor: pointer;
    transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
  }
  .size-badge:hover, .size-badge.active {
    border-color: #c9a96e;
    background: #c9a96e;
    color: #1a1a1a;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(201,169,110,0.25);
  }

  .platform-card {
    padding: 36px 32px;
    background: #fff;
    border: 1px solid #ede8e0;
    border-radius: 8px;
    transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
    position: relative;
    overflow: hidden;
    height: 100%;
  }
  .platform-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #c9a96e, #d4b896, #c9a96e);
    background-size: 200% 100%;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }
  .platform-card:hover::before { transform: scaleX(1); animation: gradientShift 2s ease infinite; }
  .platform-card:hover {
    border-color: #c9a96e;
    transform: translateY(-8px);
    box-shadow: 0 32px 64px rgba(0,0,0,0.12);
  }

  .detail-item {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    padding: 16px 20px;
    border-radius: 6px;
    transition: all 0.3s ease;
  }
  .detail-item:hover {
    background: rgba(201,169,110,0.08);
    transform: translateX(8px);
  }

  /* ── RESPONSIVE ─────────────────────────────────────────────────────── */
  @media (max-width: 900px) {
    .grid-2 { grid-template-columns: 1fr !important; gap: 40px !important; }
    .product-grid { grid-template-columns: 1fr !important; }
    .page-section { padding: 60px 24px !important; }
    .breadcrumb-section { padding: 20px 24px !important; }
    .sticky-carousel { position: static !important; }
  }
  @media (max-width: 600px) {
    .product-grid { grid-template-columns: 1fr !important; }
    .platform-card { padding: 24px 20px !important; }
  }
`;

interface Size {
  size: string;
  price: number;
}
interface StoreLink {
  platform: string;
  seller: string;
  rating: number;
  url: string;
}
interface Product {
  slug: string;
  name: string;
  images?: string[];
  icon?: string;
  sizeChart?: string;
  sizes: Size[];
  links: StoreLink[];
  details?: string[];
  [key: string]: unknown;
}

/* ─── STAR RENDERER ──────────────────────────────────────────────────── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            position: "relative",
            width: "16px",
            height: "16px",
            fontSize: "16px",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#e0d7cc" }}>★</span>
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              color: "#c9a96e",
              overflow: "hidden",
              width: rating >= i ? "100%" : rating >= i - 0.5 ? "50%" : "0%",
            }}
          >
            ★
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── SECTION LABEL ──────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "12px",
      }}
    >
      <div style={{ width: "40px", height: "1px", background: "#c9a96e" }} />
      <span
        style={{
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#c9a96e",
        }}
      >
        {children}
      </span>
    </div>
  );
}

const platformColors: Record<string, string> = {
  amazon: "#FF9900",
  flipkart: "#2874F0",
  meesho: "#F43397",
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────── */
export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const category = params?.category as string;
    const slug = params?.slug as string;
    let found: Product | undefined;
    if (category && slug && (dataMap as Record<string, Product[]>)[category]) {
      found = (dataMap as Record<string, Product[]>)[category].find(
        (p) => p.slug === slug,
      );
    }
    const t = setTimeout(() => {
      setLoading(false);
      if (found) setProduct(found);
    }, 500);
    return () => clearTimeout(t);
  }, [params]);

  /* ── LOADING ─────────────────────────────────────────────────────────── */
  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#fafaf7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <style>{css}</style>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              position: "relative",
              width: "64px",
              height: "64px",
              margin: "0 auto 20px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                border: "2px solid #e8ddd0",
                borderTop: "2px solid #c9a96e",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: "12px",
                border: "2px solid transparent",
                borderTop: "2px solid rgba(201,169,110,0.4)",
                borderRadius: "50%",
                animation: "spin 1.5s linear infinite reverse",
              }}
            />
          </div>
          <p
            style={{
              fontSize: "12px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#a0906e",
            }}
          >
            Loading…
          </p>
        </div>
      </div>
    );

  /* ── NOT FOUND ───────────────────────────────────────────────────────── */
  if (!product)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#fafaf7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <style>{css}</style>
        <div style={{ textAlign: "center", maxWidth: "480px" }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "48px",
              fontWeight: 800,
              color: "#1a1a1a",
              marginBottom: "16px",
            }}
          >
            Product Not Found
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#7a7a7a",
              marginBottom: "36px",
              lineHeight: 1.8,
            }}
          >
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/catalogue" className="cta-primary">
            Back to Catalogue
          </Link>
        </div>
      </div>
    );

  /* ── DERIVED DATA ────────────────────────────────────────────────────── */
  // FIX: Deduplicate products/links by platform+seller to prevent duplicate key crashes
  const uniqueLinks = product.links.filter(
    (link, idx, arr) =>
      arr.findIndex(
        (l) =>
          l.platform === link.platform &&
          l.seller === link.seller &&
          l.url === link.url,
      ) === idx,
  );

  const lowestPrice = Math.min(...product.sizes.map((s) => s.price));
  const selectedPrice = product.sizes.find(
    (s) => s.size === selectedSize,
  )?.price;
  const avgRating =
    uniqueLinks.reduce((a, l) => a + l.rating, 0) / uniqueLinks.length;
  const images = product.images || [];

  /* ── RENDER ──────────────────────────────────────────────────────────── */
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
        {/* ── AMBIENT PARTICLES ─────────────────────────────────────────── */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          {(
            [
              {
                w: 300,
                h: 300,
                top: "10%",
                left: "-5%",
                dur: "8s",
                color: "rgba(201,169,110,0.06)",
              },
              {
                w: 200,
                h: 200,
                top: "60%",
                right: "-3%",
                dur: "12s",
                color: "rgba(201,169,110,0.04)",
              },
              {
                w: 150,
                h: 150,
                top: "30%",
                right: "10%",
                dur: "10s",
                color: "rgba(201,169,110,0.05)",
              },
            ] as {
              w: number;
              h: number;
              top: string;
              left?: string;
              right?: string;
              dur: string;
              color: string;
            }[]
          ).map((p, i) => (
            <FloatingDot
              key={i}
              style={{
                width: p.w,
                height: p.h,
                top: p.top,
                left: p.left,
                right: p.right,
                background: p.color,
                animation: `floatY ${p.dur} ease-in-out infinite`,
                animationDelay: `${i * 2}s`,
                filter: "blur(60px)",
              }}
            />
          ))}
        </div>

        {/* ── BREADCRUMB ────────────────────────────────────────────────── */}
        <section
          className="breadcrumb-section"
          style={{
            padding: "28px 48px",
            borderBottom: "1px solid #e8e2d9",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div
              style={{
                fontSize: "13px",
                color: "#7a7a7a",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Link
                href="/catalogue"
                style={{
                  color: "#7a7a7a",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a96e")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
              >
                Catalogue
              </Link>
              <span style={{ fontSize: "18px", color: "#c9a96e" }}>›</span>
              <span style={{ color: "#1a1a1a", fontWeight: 500 }}>
                {product.name}
              </span>
            </div>
          </div>
        </section>

        {/* ── PRODUCT OVERVIEW ──────────────────────────────────────────── */}
        <section
          className="page-section"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "80px 48px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            className="grid-2"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "80px",
              alignItems: "start",
            }}
          >
            {/* LEFT – CAROUSEL */}
            <Reveal direction="left">
              {/* FIX: sticky class so mobile can override via media query */}
              <div
                className="sticky-carousel"
                style={{ position: "sticky", top: "40px" }}
              >
                <ImageCarousel
                  images={images}
                  icon={product.icon as string | undefined}
                />
              </div>
            </Reveal>

            {/* RIGHT – INFO */}
            <Reveal direction="right" delay={0.1}>
              <div>
                <SectionLabel>Product Details</SectionLabel>

                <h1
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(32px,4vw,50px)",
                    fontWeight: 800,
                    color: "#1a1a1a",
                    lineHeight: 1.12,
                    marginBottom: "28px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {product.name}
                </h1>

                {/* Rating */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "28px",
                    paddingBottom: "28px",
                    borderBottom: "1px solid #e8e2d9",
                  }}
                >
                  <StarRating rating={avgRating} />
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#1a1a1a",
                    }}
                  >
                    {avgRating.toFixed(1)} / 5
                  </span>
                  <span style={{ fontSize: "13px", color: "#7a7a7a" }}>
                    ({uniqueLinks.length} store
                    {uniqueLinks.length !== 1 ? "s" : ""})
                  </span>
                </div>

                {/* Price */}
                <div style={{ marginBottom: "36px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#7a7a7a",
                      fontWeight: 600,
                      marginBottom: "6px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {selectedSize ? "Selected Size Price" : "Starting Price"}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(36px,5vw,52px)",
                        fontWeight: 800,
                        color: "#c9a96e",
                        animation: "pricePulse 4s ease-in-out infinite",
                        transition: "all 0.4s ease",
                      }}
                    >
                      ₹{(selectedPrice ?? lowestPrice).toLocaleString("en-IN")}
                    </div>
                    {selectedPrice && selectedPrice > lowestPrice && (
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#aaa",
                          textDecoration: "line-through",
                        }}
                      >
                        ₹{lowestPrice.toLocaleString("en-IN")}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sizes */}
                <div style={{ marginBottom: "36px" }}>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#1a1a1a",
                      marginBottom: "14px",
                    }}
                  >
                    Choose Size
                    {selectedSize && (
                      <span
                        style={{
                          fontWeight: 400,
                          color: "#c9a96e",
                          marginLeft: "8px",
                          fontSize: "13px",
                        }}
                      >
                        — {selectedSize}
                      </span>
                    )}
                  </div>
                  <div
                    style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                  >
                    {product.sizes.map((s) => (
                      // FIX: key is s.size (unique within a product's size list); no duplicate risk here
                      <button
                        key={s.size}
                        onClick={() =>
                          setSelectedSize(s.size === selectedSize ? "" : s.size)
                        }
                        className={`size-badge${selectedSize === s.size ? " active" : ""}`}
                        aria-pressed={selectedSize === s.size}
                      >
                        {s.size}
                      </button>
                    ))}
                  </div>
                  {selectedSize && (
                    <button
                      onClick={() => setSelectedSize("")}
                      style={{
                        marginTop: "10px",
                        fontSize: "12px",
                        color: "#7a7a7a",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textDecoration: "underline",
                        padding: 0,
                      }}
                    >
                      Clear selection
                    </button>
                  )}
                </div>

                {/* Material info */}
                <div
                  style={{
                    padding: "20px 24px",
                    background: "linear-gradient(135deg,#f5f0e8,#ede8de)",
                    borderRadius: "8px",
                    marginBottom: "36px",
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                    animation: "borderGlow 3s ease-in-out infinite",
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      animation: "iconBounce 3s ease-in-out infinite",
                      flexShrink: 0,
                    }}
                  ></div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#1a1a1a",
                        marginBottom: "4px",
                      }}
                    >
                      100% Organic Cotton
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#7a7a7a",
                        lineHeight: 1.7,
                      }}
                    >
                      Skin-safe dyes · Sustainably sourced
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <MagneticBtn
                  href="#stores"
                  className="cta-primary"
                  style={{
                    width: "100%",
                    textAlign: "center",
                    fontSize: "13px",
                  }}
                >
                  View Best Deals ↓
                </MagneticBtn>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── STORE CARDS ───────────────────────────────────────────────── */}
        <section
          id="stores"
          className="page-section"
          style={{
            background: "linear-gradient(180deg, #f5f0e8 0%, #ede8de 100%)",
            padding: "100px 48px",
            position: "relative",
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          {/* Decorative rings */}
          {[
            { size: 400, offset: -80 },
            { size: 250, offset: -40 },
          ].map(({ size, offset }, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${offset}px`,
                right: `${offset}px`,
                width: `${size}px`,
                height: `${size}px`,
                border: `1px solid rgba(201,169,110,${i === 0 ? 0.15 : 0.1})`,
                borderRadius: "50%",
                animation: `floatY ${i === 0 ? 12 : 8}s ease-in-out infinite${i === 1 ? " reverse" : ""}`,
                pointerEvents: "none",
              }}
            />
          ))}

          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              position: "relative",
            }}
          >
            <Reveal direction="up">
              <SectionLabel>Available On</SectionLabel>
            </Reveal>
            <Reveal direction="up" delay={0.1}>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(36px,5vw,52px)",
                  fontWeight: 800,
                  color: "#1a1a1a",
                  letterSpacing: "-0.02em",
                  marginBottom: "56px",
                }}
              >
                Buy from Trusted Platforms
              </h2>
            </Reveal>

            <div
              className="product-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "28px",
              }}
            >
              {/* FIX: key uses index fallback to guarantee uniqueness even if platform names repeat */}
              {uniqueLinks.map((link, i) => {
                const platformColor =
                  platformColors[link.platform.toLowerCase()] || "#c9a96e";
                const badge =
                  link.platform.toLowerCase() === "amazon"
                    ? "Prime"
                    : link.platform.toLowerCase() === "flipkart"
                      ? "Plus"
                      : "Official";
                return (
                  <Reveal
                    key={`${link.platform}-${i}`}
                    direction="up"
                    delay={i * 0.12}
                  >
                    <div className="platform-card">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "20px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              background: platformColor,
                              boxShadow: `0 0 12px ${platformColor}`,
                            }}
                          />
                          <div
                            style={{
                              fontFamily: "'Playfair Display', serif",
                              fontSize: "22px",
                              fontWeight: 800,
                              color: "#1a1a1a",
                              textTransform: "capitalize",
                            }}
                          >
                            {link.platform}
                          </div>
                        </div>
                        <div
                          style={{
                            background: platformColor,
                            color: "#fff",
                            padding: "4px 12px",
                            borderRadius: "100px",
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            opacity: 0.9,
                          }}
                        >
                          {badge}
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: "13px",
                          color: "#7a7a7a",
                          marginBottom: "16px",
                        }}
                      >
                        Seller:{" "}
                        <span style={{ fontWeight: 700, color: "#3a3a3a" }}>
                          {link.seller}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "24px",
                        }}
                      >
                        <StarRating rating={link.rating} />
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#1a1a1a",
                          }}
                        >
                          {link.rating.toFixed(1)}
                        </span>
                      </div>

                      <MagneticBtn
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cta-primary"
                        style={{ display: "block", textAlign: "center" }}
                      >
                        Shop Now
                      </MagneticBtn>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── PRODUCT FEATURES ──────────────────────────────────────────── */}
        {product.details && product.details.length > 0 && (
          <section
            className="page-section"
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "100px 48px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Reveal direction="up">
              <SectionLabel>What&apos;s Included</SectionLabel>
            </Reveal>
            <Reveal direction="up" delay={0.1}>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(36px,5vw,52px)",
                  fontWeight: 800,
                  color: "#1a1a1a",
                  letterSpacing: "-0.02em",
                  marginBottom: "48px",
                }}
              >
                Product Features
              </h2>
            </Reveal>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "16px",
              }}
            >
              {product.details.map((detail, i) => (
                // FIX: index key is fine here — detail list is static, never reordered
                <Reveal key={i} direction="up" delay={i * 0.07}>
                  <div
                    className="detail-item"
                    style={{
                      background: "#fff",
                      border: "1px solid #ede8e0",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#c9a96e,#d4b896)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "14px",
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </div>
                    <span
                      style={{
                        fontSize: "15px",
                        color: "#3a3a3a",
                        lineHeight: 1.7,
                        fontWeight: 500,
                      }}
                    >
                      {detail}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* ── SIZE CHART ────────────────────────────────────────────────── */}
        {product.sizeChart && (
          <section
            className="page-section"
            style={{
              background: "linear-gradient(180deg,#f5f0e8,#ede8de)",
              padding: "100px 48px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                maxWidth: "800px",
                margin: "0 auto",
                textAlign: "center",
              }}
            >
              <Reveal direction="up">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    marginBottom: "12px",
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
                    Sizing Guide
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
                    fontSize: "clamp(32px,5vw,48px)",
                    fontWeight: 800,
                    color: "#1a1a1a",
                    letterSpacing: "-0.02em",
                    marginBottom: "48px",
                  }}
                >
                  Size Chart
                </h2>
              </Reveal>
              <Reveal direction="up" delay={0.2}>
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #ede8e0",
                    borderRadius: "12px",
                    padding: "48px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  <Image
                    src={product.sizeChart}
                    alt="Size Chart"
                    width={400}
                    height={400}
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#7a7a7a",
                      lineHeight: 1.8,
                      maxWidth: "360px",
                    }}
                  >
                    Detailed size chart available on the store page. Click{" "}
                    <strong style={{ color: "#c9a96e" }}>
                      <Link href="#stores" style={{ color: "inherit" }}>
                        Shop Now
                      </Link>
                    </strong>{" "}
                    above to see complete measurements.
                  </p>
                </div>
              </Reveal>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
