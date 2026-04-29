"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Catalogue", href: "/catalogue" },
  ];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
    .nav-root {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
      transition: background 0.4s ease, box-shadow 0.4s ease, padding 0.4s ease;
    }
    .nav-root.scrolled {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(20px);
      box-shadow: 0 2px 24px rgba(0,0,0,0.07);
    }
    .nav-root.top {
      background: transparent;
    }
    .nav-link {
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      position: relative;
      transition: opacity 0.2s ease, color 0.4s ease;
      letter-spacing: 0.01em;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 0;
      height: 1.5px;
      background: currentColor;
      transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
    }
    .nav-link:hover::after { width: 100%; }
    .nav-link:hover { opacity: 0.7; }
    .nav-logo {
      font-family: 'Playfair Display', serif;
      font-weight: 800;
      font-size: 22px;
      text-decoration: none;
      letter-spacing: -0.02em;
      transition: color 0.4s ease, opacity 0.4s ease;
    }
    .nav-cta {
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      padding: 10px 24px;
      border-radius: 50px;
      text-decoration: none;
      transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.4s ease, color 0.4s ease, opacity 0.4s ease;
      letter-spacing: 0.02em;
    }
    .nav-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }
    .hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
      padding: 4px;
      background: none;
      border: none;
    }
    .hamburger span {
      display: block;
      height: 1.5px;
      width: 24px;
      border-radius: 2px;
      transition: all 0.3s ease;
    }
    .mobile-menu {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      z-index: 99;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 36px;
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .mobile-nav-link {
      font-family: 'Playfair Display', serif;
      font-size: 36px;
      font-weight: 700;
      text-decoration: none;
      transition: opacity 0.2s ease;
    }
    .mobile-nav-link:hover { opacity: 0.5; }
    @media (max-width: 640px) {
      .desktop-links { display: none !important; }
      .hamburger { display: flex !important; }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Mobile Menu */}
      <div
        className="mobile-menu"
        style={{
          background: "#1a1a1a",
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? "translateY(0)" : "translateY(-100%)",
          pointerEvents: menuOpen ? "all" : "none",
        }}
      >
        <button
          onClick={() => setMenuOpen(false)}
          style={{
            position: "absolute",
            top: "28px",
            right: "28px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#fff",
            fontSize: "28px",
            lineHeight: 1,
          }}
        >
          ✕
        </button>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="mobile-nav-link"
            style={{ color: "#fff" }}
            onClick={() => setMenuOpen(false)}
          >
            {l.label}
          </Link>
        ))}
        <Link
          href="/catalogue"
          onClick={() => setMenuOpen(false)}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            padding: "14px 36px",
            borderRadius: "50px",
            background: "#d4b896",
            color: "#1a1a1a",
            textDecoration: "none",
            marginTop: "12px",
          }}
        >
          Shop Now
        </Link>
      </div>

      {/* Main Nav */}
      <nav
        className={`nav-root ${scrolled ? "scrolled" : "top"}`}
        style={{ padding: scrolled ? "12px 48px" : "20px 48px" }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo — invisible at top, visible when scrolled */}
          <Link
            href="/"
            className="nav-logo"
            style={{
              color: "#1a1a1a",
              opacity: scrolled ? 1 : 0,
              pointerEvents: scrolled ? "auto" : "none",
            }}
          >
            Esteem Innerwears
          </Link>

          {/* Desktop links — invisible at top */}
          <div
            className="desktop-links"
            style={{
              display: "flex",
              gap: "36px",
              alignItems: "center",
              opacity: scrolled ? 1 : 0,
              transition: "opacity 0.4s ease",
              pointerEvents: scrolled ? "auto" : "none",
            }}
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="nav-link"
                style={{ color: "#1a1a1a" }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* CTA — invisible at top */}
            <Link
              href="/catalogue"
              className="nav-cta desktop-links"
              style={{
                background: "#1a1a1a",
                color: "#fff",
                opacity: scrolled ? 1 : 0,
                pointerEvents: scrolled ? "auto" : "none",
              }}
            >
              Shop Now
            </Link>

            {/* Hamburger — invisible at top */}
            <button
              className="hamburger"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              style={{
                opacity: scrolled ? 1 : 0,
                pointerEvents: scrolled ? "auto" : "none",
                transition: "opacity 0.4s ease",
              }}
            >
              <span style={{ background: "#1a1a1a" }} />
              <span style={{ background: "#1a1a1a" }} />
              <span style={{ background: "#1a1a1a", width: "16px" }} />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
