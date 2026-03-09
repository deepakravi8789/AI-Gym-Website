import { useState, useEffect, useRef, useCallback } from "react";

// ─── AI CONFIG ────────────────────────────────────────────────────────────────
const AI_URL = "https://api.anthropic.com/v1/messages";
const SYSTEM_PROMPT = `You are APEX AI — an expert fitness coach, certified personal trainer, and nutritionist.
Help gym users with workout routines, muscle gain, fat loss, diet plans, and healthy lifestyle advice.
Structure responses with these sections when relevant:
🏋️ WORKOUT PLAN - step-by-step exercises with sets/reps
🥗 DIET TIPS - practical nutrition advice
⚠️ SAFETY - important precautions
💪 MOTIVATION - an energizing closing line
Be science-based, specific, actionable. Use **bold** for key terms. Keep tone energetic and motivating.`;

const SUGGESTIONS = ["Beginner Workout Plan", "90-Day Weight Loss Diet", "Muscle Gain Tips", "Best Chest Exercises"];

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const G = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,300;0,400;0,600;0,700;0,900;1,400&family=Barlow+Condensed:wght@600;700;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--r:#ff1744;--rd:#c62828;--b:#00b4ff;--bg:#060608;--tx:#f0f0f5;--mu:#777}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--tx);font-family:'Barlow',sans-serif;overflow-x:hidden}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:var(--r)}
.bb{font-family:'Bebas Neue',sans-serif}
.bc{font-family:'Barlow Condensed',sans-serif}
@keyframes pulseR{0%,100%{box-shadow:0 0 20px rgba(255,23,68,.4)}50%{box-shadow:0 0 50px rgba(255,23,68,.8)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes spinS{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:translateY(0)}}
@keyframes typing{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-5px);opacity:1}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
@keyframes chatPop{from{opacity:0;transform:scale(.92) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes flicker{0%,94%,100%{opacity:1}96%{opacity:.5}98%{opacity:.8}}
.fu{animation:fadeUp .7s ease both}
.fl{animation:float 4s ease-in-out infinite}
.pr{animation:pulseR 2s ease-in-out infinite}
.ss{animation:spinS 20s linear infinite}
.fk{animation:flicker 5s ease-in-out infinite}
.gl{background:rgba(255,255,255,.04);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.08)}
.gr{background-image:linear-gradient(rgba(255,23,68,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,23,68,.03) 1px,transparent 1px);background-size:55px 55px}
.tgr{background:linear-gradient(135deg,#ff1744,#ff6b6b,#ff1744);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite}
.tgb{background:linear-gradient(135deg,#00b4ff,#80d4ff,#00b4ff);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite}
.ch{transition:all .4s cubic-bezier(.23,1,.32,1)}
.ch:hover{transform:translateY(-7px);border-color:rgba(255,23,68,.35)!important;box-shadow:0 20px 50px rgba(255,23,68,.1)}
.pbr{height:3px;background:rgba(255,255,255,.1);border-radius:2px;overflow:hidden}
.pbf{height:100%;background:linear-gradient(90deg,var(--r),var(--b));border-radius:2px;transition:width 1.5s cubic-bezier(.23,1,.32,1)}
.tdt{width:6px;height:6px;border-radius:50%;background:var(--b);display:inline-block;animation:typing 1.2s ease-in-out infinite}
.tdt:nth-child(2){animation-delay:.2s}.tdt:nth-child(3){animation-delay:.4s}
.cb{animation:chatPop .3s ease both}
input,select,textarea{font-family:'Barlow',sans-serif}
input[type=range]{-webkit-appearance:none;appearance:none;height:4px;background:rgba(255,255,255,.1);border-radius:2px;outline:none;cursor:pointer;width:100%}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;cursor:pointer;background:#ff1744}
.noise{position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:.02;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
@media(max-width:900px){
  .nav-links{display:none!important}
  .mob-menu-btn{display:flex!important}
  .hero-grid{grid-template-columns:1fr!important}
  .hero-deco{display:none!important}
}
@media(max-width:700px){
  .feat-grid{grid-template-columns:1fr!important}
  .prog-grid{grid-template-columns:1fr!important}
  .nut-grid{grid-template-columns:1fr!important}
  .mac-grid{grid-template-columns:1fr!important}
  .price-grid{grid-template-columns:1fr!important}
  .foot-grid{grid-template-columns:1fr 1fr!important}
  .foot-brand{grid-column:1/-1!important}
  .hero-btns{flex-direction:column;align-items:flex-start}
  .stat-row{gap:24px!important;flex-wrap:wrap}
  .chat-win{width:calc(100vw - 16px)!important;right:8px!important;left:8px!important;bottom:78px!important;height:70vh!important;min-height:400px!important}
  .test-pad{padding:24px 20px!important}
}
@media(max-width:400px){
  .foot-grid{grid-template-columns:1fr!important}
  .price-grid{grid-template-columns:1fr!important}
}
`;

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ic = ({ n, s = 20, c = "currentColor" }) => {
  const m = {
    dumbbell: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect x="6" y="9" width="12" height="6" rx="1"/><rect x="2" y="7" width="4" height="10" rx="1"/><rect x="18" y="7" width="4" height="10" rx="1"/></svg>,
    brain: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-4.61A3 3 0 0 1 5 12a3 3 0 0 1 1.5-2.6 2.5 2.5 0 0 1 3-3.9M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-4.61A3 3 0 0 0 19 12a3 3 0 0 0-1.5-2.6 2.5 2.5 0 0 0-3-3.9"/></svg>,
    fire: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
    zap: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    target: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    trend: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    send: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    x: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    bot: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4M8 15h.01M16 15h.01"/></svg>,
    star: <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
    check: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    menu: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    ig: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill={c}/></svg>,
    tw: <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    yt: <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12z"/></svg>,
    loc: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    mail: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/></svg>,
    ph: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 10.5a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 6.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 13.92z"/></svg>,
  };
  return m[n] || null;
};

// ─── HOOKS ────────────────────────────────────────────────────────────────────
const useInView = (t = 0.1) => {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: t });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return [ref, v];
};

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────
const BtnPrimary = ({ children, onClick, style = {} }) => (
  <button onClick={onClick} style={{ background: "linear-gradient(135deg,#ff1744,#c62828)", color: "#fff", border: "none", padding: "13px 28px", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", clipPath: "polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)", transition: "all .3s", ...style }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(255,23,68,.5)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
    {children}
  </button>
);

const BtnOutline = ({ children, onClick, style = {} }) => (
  <button onClick={onClick} style={{ background: "transparent", color: "var(--b)", border: "1px solid rgba(0,180,255,.4)", padding: "12px 27px", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", clipPath: "polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)", transition: "all .3s", ...style }}
    onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,180,255,.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = ""; }}>
    {children}
  </button>
);

const Tag = ({ children, style = {} }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,23,68,.1)", border: "1px solid rgba(255,23,68,.3)", color: "var(--r)", padding: "5px 13px", fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14, ...style }}>
    <span style={{ width: 6, height: 6, background: "var(--r)", borderRadius: "50%", display: "inline-block", animation: "pulseR 1.5s ease-in-out infinite" }} />
    {children}
  </div>
);

// ─── NAV ──────────────────────────────────────────────────────────────────────
const Nav = ({ onChat }) => {
  const [sc, setSc] = useState(false);
  const [mo, setMo] = useState(false);
  useEffect(() => {
    const f = () => setSc(window.scrollY > 50);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, transition: "all .4s", background: sc ? "rgba(6,6,8,.96)" : "transparent", backdropFilter: sc ? "blur(20px)" : "none", borderBottom: sc ? "1px solid rgba(255,255,255,.06)" : "none" }}>
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 30, height: 30, background: "var(--r)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span className="bb" style={{ fontSize: 17, color: "#fff" }}>A</span>
          </div>
          <span className="bb fk" style={{ fontSize: 20, letterSpacing: 3 }}>APEX FIT</span>
        </div>
        <div className="nav-links" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Programs", "Nutrition", "Pricing"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: "rgba(255,255,255,.55)", textDecoration: "none", fontSize: 12, letterSpacing: 1.5, fontWeight: 600, textTransform: "uppercase", transition: "color .3s" }}
              onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.55)"}>{l}</a>
          ))}
          <BtnPrimary onClick={onChat} style={{ padding: "9px 20px", fontSize: 12 }}>AI Coach</BtnPrimary>
        </div>
        <button className="mob-menu-btn" onClick={() => setMo(!mo)} style={{ display: "none", background: "none", border: "1px solid rgba(255,255,255,.15)", color: "#fff", cursor: "pointer", padding: "6px 8px", borderRadius: 2, alignItems: "center", justifyContent: "center" }}>
          {mo ? <Ic n="x" s={19} /> : <Ic n="menu" s={19} />}
        </button>
      </div>
      {mo && (
        <div style={{ background: "rgba(6,6,8,.98)", borderTop: "1px solid rgba(255,255,255,.06)", padding: "12px 20px 18px" }}>
          {["Programs", "Nutrition", "Pricing"].map(l => (
            <a key={l} onClick={() => setMo(false)} href={`#${l.toLowerCase()}`} style={{ display: "block", color: "rgba(255,255,255,.7)", textDecoration: "none", fontSize: 15, fontWeight: 600, letterSpacing: 1, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>{l}</a>
          ))}
          <BtnPrimary onClick={() => { setMo(false); onChat(); }} style={{ marginTop: 14, width: "100%", clipPath: "none", textAlign: "center" }}>Talk to AI Coach</BtnPrimary>
        </div>
      )}
    </nav>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = ({ onChat }) => {
  const [cnt, setCnt] = useState({ m: 0, p: 0, c: 0 });
  useEffect(() => {
    const t = { m: 50000, p: 200, c: 150 };
    let s = 0;
    const id = setInterval(() => {
      s++;
      const e = 1 - Math.pow(1 - s / 60, 3);
      setCnt({ m: Math.floor(t.m * e), p: Math.floor(t.p * e), c: Math.floor(t.c * e) });
      if (s >= 60) clearInterval(id);
    }, 2000 / 60);
    return () => clearInterval(id);
  }, []);
  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: 64 }} className="gr">
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 0%,rgba(255,23,68,.14) 0%,transparent 60%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 85% 50%,rgba(0,180,255,.07) 0%,transparent 60%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,rgba(255,23,68,.3),transparent)", animation: "scan 8s linear infinite", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "60px 20px", width: "100%", position: "relative", zIndex: 2 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center" }} className="hero-grid">
          <div style={{ animation: "fadeUp .8s ease both" }}>
            <Tag>AI-Powered Fitness Platform</Tag>
            <h1 className="bb" style={{ fontSize: "clamp(52px,10vw,122px)", lineHeight: .9, marginBottom: 22, letterSpacing: -1 }}>
              <span style={{ display: "block", color: "#fff" }}>TRANSFORM</span>
              <span className="tgr" style={{ display: "block" }}>YOUR BODY</span>
              <span style={{ display: "block", color: "rgba(255,255,255,.9)" }}>WITH AI</span>
            </h1>
            <p style={{ fontSize: "clamp(14px,2vw,17px)", color: "rgba(255,255,255,.5)", maxWidth: 500, lineHeight: 1.75, marginBottom: 34, fontWeight: 300 }}>
              Elite fitness meets artificial intelligence. Personalized workouts, AI nutrition coaching, and real-time progress tracking.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }} className="hero-btns">
              <BtnPrimary>Start Training</BtnPrimary>
              <BtnOutline onClick={onChat}>Talk to AI Coach</BtnOutline>
            </div>
            <div style={{ display: "flex", gap: 40, marginTop: 52, flexWrap: "wrap" }} className="stat-row">
              {[{ v: cnt.m.toLocaleString() + "+", l: "Members" }, { v: cnt.p + "+", l: "Programs" }, { v: cnt.c + "+", l: "Coaches" }].map(s => (
                <div key={s.l}>
                  <div className="bb" style={{ fontSize: "clamp(28px,5vw,40px)", lineHeight: 1, color: "#fff" }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: "var(--mu)", letterSpacing: 2, textTransform: "uppercase", marginTop: 3 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-deco fl" style={{ position: "relative", width: 280, height: 280, flexShrink: 0 }}>
            <div className="ss" style={{ position: "absolute", inset: 0, border: "1px solid rgba(255,23,68,.15)", borderRadius: "50%" }} />
            <div className="ss" style={{ position: "absolute", inset: 20, border: "1px dashed rgba(0,180,255,.1)", borderRadius: "50%", animationDirection: "reverse", animationDuration: "14s" }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 110, height: 110, background: "rgba(255,23,68,.1)", border: "1px solid rgba(255,23,68,.3)", display: "flex", alignItems: "center", justifyContent: "center", clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }} className="pr">
              <Ic n="zap" s={42} c="var(--r)" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── FEATURES ─────────────────────────────────────────────────────────────────
const Features = () => {
  const [ref, v] = useInView();
  const feats = [
    { ic: "brain", t: "AI Workout Coach", d: "Adaptive plans that evolve with your performance metrics.", col: "var(--r)" },
    { ic: "fire", t: "Weight Loss Guide", d: "Fat-loss protocols with real-time metabolic adaptation.", col: "#ff9100" },
    { ic: "trend", t: "Muscle Gain Programs", d: "Progressive overload with AI-predicted growth optimization.", col: "var(--b)" },
    { ic: "target", t: "Personalized Plans", d: "Your unique physiology drives every decision — no templates.", col: "#e040fb" },
    { ic: "zap", t: "Real-Time Analytics", d: "Live performance tracking with instant feedback.", col: "#ffea00" },
    { ic: "dumbbell", t: "Smart Diet Planner", d: "Precision macros with AI meal suggestions for your goals.", col: "#00e676" },
  ];
  return (
    <section id="features" style={{ padding: "90px 20px" }} ref={ref}>
      <div style={{ maxWidth: 1360, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <Tag style={{ margin: "0 auto 14px" }}>Why Choose Apex</Tag>
          <h2 className="bb" style={{ fontSize: "clamp(34px,5vw,70px)", letterSpacing: 2 }}>FEATURES BUILT FOR <span className="tgr">RESULTS</span></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 18 }} className="feat-grid">
          {feats.map((f, i) => (
            <div key={f.t} className="gl ch" style={{ padding: 26, borderRadius: 2, cursor: "default", animation: v ? `fadeUp .6s ${i * .1}s ease both` : "none", opacity: v ? 1 : 0 }}>
              <div style={{ width: 44, height: 44, background: `${f.col}18`, border: `1px solid ${f.col}33`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Ic n={f.ic} s={20} c={f.col} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.t}</h3>
              <p style={{ color: "rgba(255,255,255,.45)", fontSize: 13, lineHeight: 1.7 }}>{f.d}</p>
              <div className="pbr" style={{ marginTop: 18 }}><div className="pbf" style={{ width: v ? `${65 + i * 5}%` : "0%", transitionDelay: `${i * .15 + .4}s` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── PROGRAMS ─────────────────────────────────────────────────────────────────
const Programs = () => {
  const [ref, v] = useInView();
  const progs = [
    { t: "Weight Loss", w: "12 Weeks", lv: "All Levels", tag: "Popular", col: "var(--r)", ic: "fire", d: "Metabolic conditioning meets AI nutrition for maximum fat oxidation." },
    { t: "Muscle Gain", w: "16 Weeks", lv: "Intermediate", tag: "Best Results", col: "var(--b)", ic: "trend", d: "Progressive hypertrophy with optimized protein synthesis protocols." },
    { t: "Strength Training", w: "20 Weeks", lv: "Advanced", tag: "Elite", col: "#e040fb", ic: "zap", d: "Powerlifting methodology with AI-adjusted periodization." },
    { t: "Beginner Program", w: "8 Weeks", lv: "Beginner", tag: "Start Here", col: "#00e676", ic: "target", d: "Foundation building with guided form coaching and gradual progression." },
    { t: "Athlete Program", w: "24 Weeks", lv: "Pro", tag: "Pro Level", col: "#ff9100", ic: "dumbbell", d: "Sport-specific conditioning used by professional athletes." },
  ];
  return (
    <section id="programs" style={{ padding: "90px 20px", background: "rgba(255,255,255,.01)" }} ref={ref}>
      <div style={{ maxWidth: 1360, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <Tag>Training Programs</Tag>
          <h2 className="bb" style={{ fontSize: "clamp(34px,5vw,66px)", letterSpacing: 2 }}>ELITE <span className="tgb">PROGRAMS</span></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }} className="prog-grid">
          {progs.map((p, i) => (
            <div key={p.t} className="gl ch" style={{ padding: 24, borderRadius: 2, cursor: "pointer", position: "relative", overflow: "hidden", animation: v ? `fadeUp .6s ${i * .1}s ease both` : "none", opacity: v ? 1 : 0 }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: p.col }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, background: `${p.col}18`, display: "flex", alignItems: "center", justifyContent: "center" }}><Ic n={p.ic} s={18} c={p.col} /></div>
                <span style={{ fontSize: 9, padding: "3px 8px", background: `${p.col}20`, border: `1px solid ${p.col}40`, color: p.col, letterSpacing: 1.5, fontWeight: 700, textTransform: "uppercase" }}>{p.tag}</span>
              </div>
              <h3 className="bb" style={{ fontSize: 24, letterSpacing: 1, marginBottom: 6 }}>{p.t}</h3>
              <p style={{ color: "var(--mu)", fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>{p.d}</p>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {[p.w, p.lv].map(x => <span key={x} style={{ fontSize: 10, color: "rgba(255,255,255,.45)", background: "rgba(255,255,255,.05)", padding: "3px 8px" }}>{x}</span>)}
              </div>
              <button style={{ width: "100%", marginTop: 16, background: "transparent", border: `1px solid ${p.col}35`, color: p.col, padding: "8px", fontSize: 11, letterSpacing: 2, fontFamily: "'Barlow Condensed'", fontWeight: 700, textTransform: "uppercase", cursor: "pointer", transition: "all .3s" }}
                onMouseEnter={e => e.target.style.background = `${p.col}18`} onMouseLeave={e => e.target.style.background = "transparent"}>
                View Program
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── NUTRITION ────────────────────────────────────────────────────────────────
const Nutrition = () => {
  const [ref, v] = useInView();
  const [cal, setCal] = useState({ wt: 75, ht: 175, ag: 25, ac: 1.55, gl: "loss" });
  const [bmi, setBmi] = useState({ wt: 70, ht: 175 });
  const bmr = () => { let b = 10 * cal.wt + 6.25 * cal.ht - 5 * cal.ag + 5; let t = b * cal.ac; if (cal.gl === "loss") t -= 500; if (cal.gl === "gain") t += 300; return Math.round(t); };
  const bmiV = () => { const h = bmi.ht / 100; return (bmi.wt / (h * h)).toFixed(1); };
  const bv = parseFloat(bmiV()), bcat = bv < 18.5 ? "Underweight" : bv < 25 ? "Normal" : bv < 30 ? "Overweight" : "Obese";
  const bcol = bv < 18.5 ? "var(--b)" : bv < 25 ? "#00e676" : bv < 30 ? "#ff9100" : "var(--r)";
  const Slider = ({ label, val, min, max, onChange, col }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <label style={{ fontSize: 11, color: "var(--mu)", letterSpacing: 1, textTransform: "uppercase" }}>{label}</label>
        <span style={{ fontSize: 12, fontWeight: 700, color: col }}>{val}</span>
      </div>
      <input type="range" min={min} max={max} value={val} onChange={onChange} style={{ accentColor: col }} />
    </div>
  );
  return (
    <section id="nutrition" style={{ padding: "90px 20px" }} ref={ref}>
      <div style={{ maxWidth: 1360, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Tag style={{ margin: "0 auto 14px" }}>Nutrition & Calculators</Tag>
          <h2 className="bb" style={{ fontSize: "clamp(32px,5vw,66px)", letterSpacing: 2 }}>FUEL YOUR <span className="tgr">PERFORMANCE</span></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, animation: v ? "fadeUp .7s ease both" : "none" }} className="nut-grid">
          <div className="gl" style={{ padding: "28px 24px", borderRadius: 2 }}>
            <h3 className="bc" style={{ fontSize: 17, fontWeight: 700, letterSpacing: 1, marginBottom: 20, color: "var(--r)" }}>CALORIE CALCULATOR</h3>
            <Slider label="Weight (kg)" val={cal.wt} min={40} max={200} onChange={e => setCal(p => ({ ...p, wt: +e.target.value }))} col="var(--r)" />
            <Slider label="Height (cm)" val={cal.ht} min={140} max={220} onChange={e => setCal(p => ({ ...p, ht: +e.target.value }))} col="var(--r)" />
            <Slider label="Age" val={cal.ag} min={15} max={80} onChange={e => setCal(p => ({ ...p, ag: +e.target.value }))} col="var(--r)" />
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: "var(--mu)", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Activity Level</label>
              <select value={cal.ac} onChange={e => setCal(p => ({ ...p, ac: +e.target.value }))} style={{ width: "100%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff", padding: "9px 11px", fontSize: 13, cursor: "pointer" }}>
                <option value={1.2}>Sedentary</option><option value={1.375}>Light Exercise</option>
                <option value={1.55}>Moderate Exercise</option><option value={1.725}>Heavy Exercise</option><option value={1.9}>Athlete</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
              {[["loss", "Fat Loss", "var(--r)"], ["maintain", "Maintain", "var(--mu)"], ["gain", "Muscle Gain", "var(--b)"]].map(([val, lbl, col]) => (
                <button key={val} onClick={() => setCal(p => ({ ...p, gl: val }))} style={{ flex: 1, padding: "7px 3px", fontSize: 10, letterSpacing: 1, fontFamily: "'Barlow Condensed'", fontWeight: 700, textTransform: "uppercase", cursor: "pointer", transition: "all .2s", border: `1px solid ${cal.gl === val ? col : "rgba(255,255,255,.1)"}`, background: cal.gl === val ? `${col}20` : "transparent", color: cal.gl === val ? col : "var(--mu)" }}>{lbl}</button>
              ))}
            </div>
            <div style={{ background: "rgba(255,23,68,.08)", border: "1px solid rgba(255,23,68,.2)", padding: 18, textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "var(--mu)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Daily Calorie Target</div>
              <div className="bb" style={{ fontSize: 46, color: "var(--r)" }}>{bmr().toLocaleString()}</div>
              <div style={{ fontSize: 12, color: "var(--mu)" }}>calories / day</div>
            </div>
          </div>
          <div className="gl" style={{ padding: "28px 24px", borderRadius: 2 }}>
            <h3 className="bc" style={{ fontSize: 17, fontWeight: 700, letterSpacing: 1, marginBottom: 20, color: "var(--b)" }}>BMI CALCULATOR</h3>
            <Slider label="Weight (kg)" val={bmi.wt} min={40} max={200} onChange={e => setBmi(p => ({ ...p, wt: +e.target.value }))} col="var(--b)" />
            <Slider label="Height (cm)" val={bmi.ht} min={140} max={220} onChange={e => setBmi(p => ({ ...p, ht: +e.target.value }))} col="var(--b)" />
            <div style={{ background: "rgba(0,180,255,.06)", border: "1px solid rgba(0,180,255,.15)", padding: 22, textAlign: "center", marginTop: 22 }}>
              <div style={{ fontSize: 10, color: "var(--mu)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Your BMI</div>
              <div className="bb" style={{ fontSize: 56, color: bcol, lineHeight: 1 }}>{bmiV()}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: bcol, marginTop: 6 }}>{bcat}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 5, marginTop: 16 }}>
              {[["<18.5", "Under", "var(--b)"], ["18-25", "Normal", "#00e676"], ["25-30", "Over", "#ff9100"], [">30", "Obese", "var(--r)"]].map(([r, l, c]) => (
                <div key={l} style={{ textAlign: "center", padding: "8px 3px", background: "rgba(255,255,255,.03)", border: `1px solid ${c}25` }}>
                  <div style={{ fontSize: 9, color: c, fontWeight: 700 }}>{r}</div>
                  <div style={{ fontSize: 9, color: "var(--mu)", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 24 }} className="mac-grid">
          {[["Protein", "2.2g/kg", "Muscle repair & growth", "var(--r)", 30], ["Carbohydrates", "4–6g/kg", "Primary energy source", "var(--b)", 45], ["Healthy Fats", "0.8g/kg", "Hormonal balance", "#ff9100", 25]].map(([l, vl, d, c, p], i) => (
            <div key={l} className="gl" style={{ padding: 20, borderRadius: 2, animation: v ? `fadeUp .6s ${i * .15 + .3}s ease both` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{l}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: c }}>{p}%</span>
              </div>
              <div className="pbr" style={{ marginBottom: 9 }}><div className="pbf" style={{ width: v ? `${p * 2}%` : "0%", background: c, transitionDelay: `${i * .2 + .5}s` }} /></div>
              <div style={{ fontSize: 15, fontWeight: 700, color: c, marginBottom: 3 }}>{vl}</div>
              <div style={{ fontSize: 12, color: "var(--mu)" }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const Testimonials = () => {
  const [ac, setAc] = useState(0);
  const tms = [
    { nm: "Marcus Chen", rl: "Software Engineer", rs: "Lost 28kg in 16 weeks", tx: "The AI coach adjusted my program every week based on my recovery. Like having a world-class trainer 24/7." },
    { nm: "Aisha Okafor", rl: "Marathon Runner", rs: "PR by 18 minutes", tx: "The nutrition AI calculated exactly what I needed for peak performance. Science-backed results that amazed my whole team." },
    { nm: "Tyler Rodriguez", rl: "Former Athlete", rs: "Gained 12kg muscle", tx: "Coming back after injury, I needed precise programming. Apex AI made micro-adjustments I wouldn't have thought of myself." },
  ];
  useEffect(() => { const id = setInterval(() => setAc(a => (a + 1) % tms.length), 4500); return () => clearInterval(id); }, []);
  return (
    <section style={{ padding: "90px 20px", background: "rgba(255,255,255,.01)" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
        <Tag style={{ margin: "0 auto 14px" }}>Success Stories</Tag>
        <h2 className="bb" style={{ fontSize: "clamp(32px,5vw,66px)", letterSpacing: 2, marginBottom: 48 }}>REAL <span className="tgr">TRANSFORMATIONS</span></h2>
        <div style={{ position: "relative", minHeight: 230 }}>
          {tms.map((t, i) => (
            <div key={i} style={{ position: i === ac ? "relative" : "absolute", inset: 0, opacity: i === ac ? 1 : 0, transition: "opacity .6s", pointerEvents: i === ac ? "all" : "none" }}>
              <div className="gl test-pad" style={{ padding: "32px 36px", borderRadius: 2 }}>
                <div style={{ display: "flex", gap: 3, justifyContent: "center", marginBottom: 18 }}>
                  {Array(5).fill(0).map((_, j) => <Ic key={j} n="star" s={14} c="var(--r)" />)}
                </div>
                <p style={{ fontSize: "clamp(14px,2vw,17px)", lineHeight: 1.8, color: "rgba(255,255,255,.78)", fontStyle: "italic", marginBottom: 22, fontWeight: 300 }}>"{t.tx}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,var(--r),var(--b))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{t.nm[0]}</div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{t.nm}</div>
                    <div style={{ fontSize: 11, color: "var(--mu)" }}>{t.rl}</div>
                  </div>
                  <div style={{ fontSize: 11, padding: "4px 10px", background: "rgba(255,23,68,.1)", border: "1px solid rgba(255,23,68,.2)", color: "var(--r)", fontWeight: 700 }}>{t.rs}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 7, justifyContent: "center", marginTop: 26 }}>
          {tms.map((_, i) => <button key={i} onClick={() => setAc(i)} style={{ width: i === ac ? 24 : 7, height: 7, borderRadius: 4, background: i === ac ? "var(--r)" : "rgba(255,255,255,.15)", border: "none", cursor: "pointer", transition: "all .3s" }} />)}
        </div>
      </div>
    </section>
  );
};

// ─── PRICING ──────────────────────────────────────────────────────────────────
const Pricing = () => {
  const [ref, v] = useInView();
  const plans = [
    { nm: "Basic", pr: 29, ft: ["3 AI Workouts/week", "Basic nutrition tracking", "Community access", "Progress tracking"], col: "rgba(255,255,255,.08)", hi: false },
    { nm: "Pro", pr: 79, ft: ["Unlimited AI Workouts", "Advanced nutrition AI", "Real-time adjustments", "Priority support", "Custom meal plans"], col: "var(--r)", hi: true },
    { nm: "Elite", pr: 149, ft: ["Everything in Pro", "1-on-1 AI sessions", "Sports medicine insights", "Recovery optimization", "Direct coach access"], col: "var(--b)", hi: false },
  ];
  return (
    <section id="pricing" style={{ padding: "90px 20px" }} ref={ref}>
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Tag style={{ margin: "0 auto 14px" }}>Simple Pricing</Tag>
          <h2 className="bb" style={{ fontSize: "clamp(32px,5vw,66px)", letterSpacing: 2 }}>INVEST IN YOUR <span className="tgb">TRANSFORMATION</span></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }} className="price-grid">
          {plans.map((p, i) => (
            <div key={p.nm} style={{ padding: 28, borderRadius: 2, position: "relative", background: p.hi ? "rgba(255,23,68,.06)" : "rgba(255,255,255,.03)", border: `1px solid ${p.hi ? "rgba(255,23,68,.3)" : "rgba(255,255,255,.07)"}`, transform: p.hi ? "scale(1.03)" : "", boxShadow: p.hi ? "0 0 40px rgba(255,23,68,.12)" : "none", animation: v ? `fadeUp .6s ${i * .15}s ease both` : "none", opacity: v ? 1 : 0, transition: "all .4s" }}
              onMouseEnter={e => { if (!p.hi) e.currentTarget.style.transform = "translateY(-6px)"; }}
              onMouseLeave={e => { if (!p.hi) e.currentTarget.style.transform = ""; }}>
              {p.hi && <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: "var(--r)", padding: "3px 13px", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", whiteSpace: "nowrap" }}>Most Popular</div>}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: p.col }} />
              <h3 className="bb" style={{ fontSize: 28, letterSpacing: 2, marginBottom: 6 }}>{p.nm}</h3>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 22 }}>
                <span style={{ fontSize: 12, color: "var(--mu)" }}>$</span>
                <span className="bb" style={{ fontSize: 48, lineHeight: 1, color: p.hi ? "var(--r)" : "#fff" }}>{p.pr}</span>
                <span style={{ fontSize: 11, color: "var(--mu)" }}>/mo</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 20, marginBottom: 22 }}>
                {p.ft.map(f => (
                  <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 9 }}>
                    <div style={{ marginTop: 1, flexShrink: 0 }}><Ic n="check" s={13} c={p.hi ? "var(--r)" : "var(--b)"} /></div>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,.6)", lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button style={{ width: "100%", padding: "12px", fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", transition: "all .3s", background: p.hi ? "var(--r)" : "transparent", border: `1px solid ${p.hi ? "var(--r)" : "rgba(255,255,255,.15)"}`, color: "#fff" }}
                onMouseEnter={e => { if (!p.hi) e.target.style.background = "rgba(255,255,255,.07)"; }}
                onMouseLeave={e => { if (!p.hi) e.target.style.background = "transparent"; }}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = () => {
  const [em, setEm] = useState("");
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,.06)", padding: "64px 20px 32px" }}>
      <div style={{ maxWidth: 1360, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.4fr", gap: 36, marginBottom: 48 }} className="foot-grid">
          <div className="foot-brand">
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
              <div style={{ width: 26, height: 26, background: "var(--r)", display: "flex", alignItems: "center", justifyContent: "center" }}><span className="bb" style={{ fontSize: 15 }}>A</span></div>
              <span className="bb" style={{ fontSize: 18, letterSpacing: 3 }}>APEX FIT</span>
            </div>
            <p style={{ color: "var(--mu)", fontSize: 13, lineHeight: 1.8, maxWidth: 230, marginBottom: 20 }}>The world's most advanced AI fitness platform. Science-backed, data-driven, results-guaranteed.</p>
            <div style={{ display: "flex", gap: 9 }}>
              {[["ig", "#"], ["tw", "#"], ["yt", "#"]].map(([ic, h]) => (
                <a key={ic} href={h} style={{ width: 32, height: 32, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--mu)", transition: "all .3s", textDecoration: "none" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,23,68,.4)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.08)"; e.currentTarget.style.color = "var(--mu)"; }}>
                  <Ic n={ic} s={14} />
                </a>
              ))}
            </div>
          </div>
          {[{ t: "Programs", ls: ["Weight Loss", "Muscle Gain", "Strength", "Beginner", "Athlete"] }, { t: "Company", ls: ["About", "Careers", "Blog", "Affiliates"] }].map(col => (
            <div key={col.t}>
              <h4 style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16, color: "rgba(255,255,255,.4)" }}>{col.t}</h4>
              {col.ls.map(l => <div key={l} style={{ marginBottom: 8 }}><a href="#" style={{ fontSize: 13, color: "var(--mu)", textDecoration: "none", transition: "color .3s" }} onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "var(--mu)"}>{l}</a></div>)}
            </div>
          ))}
          <div>
            <h4 style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16, color: "rgba(255,255,255,.4)" }}>Newsletter</h4>
            <div style={{ display: "flex", marginBottom: 18 }}>
              <input type="email" placeholder="your@email.com" value={em} onChange={e => setEm(e.target.value)} style={{ flex: 1, borderRight: "none", fontSize: 12, padding: "9px 10px", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff", outline: "none", minWidth: 0 }} />
              <BtnPrimary style={{ clipPath: "none", padding: "9px 13px", fontSize: 12 }}>Go</BtnPrimary>
            </div>
            {[["loc", "123 Elite Ave, NYC 10001"], ["ph", "+1 (555) 999-APEX"], ["mail", "coach@apexfit.ai"]].map(([ic, tx]) => (
              <div key={tx} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <Ic n={ic} s={13} c="var(--mu)" />
                <span style={{ fontSize: 12, color: "var(--mu)" }}>{tx}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 22, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 11, color: "var(--mu)" }}>© 2026 Apex Fit. All rights reserved.</span>
          <span style={{ fontSize: 11, color: "var(--mu)" }}>Powered by <span style={{ color: "var(--r)" }}>Claude AI</span></span>
        </div>
      </div>
    </footer>
  );
};

// ─── FORMAT AI RESPONSE ───────────────────────────────────────────────────────
const formatAI = (raw) => {
  return raw
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#ff8a9b;font-weight:700">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color:rgba(255,255,255,.85)">$1</em>')
    .replace(/^#{1,3}\s(.+)$/gm, '<div style="font-weight:700;color:#ff8a9b;margin:10px 0 4px;font-size:13px;letter-spacing:.5px">$1</div>')
    .replace(/^(\d+)\.\s(.+)$/gm, '<div style="display:flex;gap:8px;margin:3px 0;align-items:flex-start;font-size:12.5px"><span style="color:#ff1744;font-weight:700;min-width:16px">$1.</span><span>$2</span></div>')
    .replace(/^[-•]\s(.+)$/gm, '<div style="display:flex;gap:7px;margin:3px 0;align-items:flex-start;font-size:12.5px"><span style="color:#00b4ff;font-size:10px;margin-top:2px;flex-shrink:0">▸</span><span>$1</span></div>')
    .replace(/\n{2,}/g, '<div style="height:8px"></div>')
    .replace(/\n/g, "<br/>");
};

// ─── CHATBOT ──────────────────────────────────────────────────────────────────
const Chatbot = ({ open, onClose }) => {
  const [msgs, setMsgs] = useState([{
    r: "a",
    t: "👋 Hey! I'm **APEX AI**, your personal fitness coach.\n\nAsk me anything about:\n- Workout plans & routines\n- Diet & nutrition\n- Fat loss strategies\n- Muscle building tips"
  }]);
  const [inp, setInp] = useState("");
  const [load, setLoad] = useState(false);
  const [hist, setHist] = useState([]);
  const bot = useRef(null);
  const inpRef = useRef(null);

  useEffect(() => { if (open) setTimeout(() => inpRef.current?.focus(), 400); }, [open]);
  useEffect(() => { bot.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, load]);

  const send = useCallback(async (rawText) => {
    const txt = (typeof rawText === "string" ? rawText : inp).trim();
    if (!txt || load) return;

    setMsgs(p => [...p, { r: "u", t: txt }]);
    setInp("");
    setLoad(true);

    const newHist = [...hist, { role: "user", content: txt }];

    try {
      const res = await fetch(AI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: newHist,
        }),
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.error?.message || `Server error ${res.status}`);
      }

      const data = await res.json();
      const reply = data?.content?.[0]?.text || "Sorry, I couldn't generate a response. Please try again!";
      setMsgs(p => [...p, { r: "a", t: reply }]);
      setHist([...newHist, { role: "assistant", content: reply }]);
    } catch (err) {
      setMsgs(p => [...p, { r: "a", t: `⚠️ **Connection Error:** ${err.message || "Unable to connect. Please check your internet and try again."}` }]);
    } finally {
      setLoad(false);
    }
  }, [inp, load, hist]);

  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 998, background: "rgba(0,0,0,.4)", backdropFilter: "blur(4px)" }} />}

      {/* Chat Window */}
      <div className="chat-win" style={{
        position: "fixed", bottom: 88, right: 20, zIndex: 999,
        width: 370, height: 580,
        background: "#09090c", border: "1px solid rgba(255,23,68,.28)",
        display: "flex", flexDirection: "column", borderRadius: 6, overflow: "hidden",
        transform: open ? "scale(1) translateY(0)" : "scale(.88) translateY(14px)",
        opacity: open ? 1 : 0, pointerEvents: open ? "all" : "none",
        transition: "all .4s cubic-bezier(.34,1.56,.64,1)", transformOrigin: "bottom right",
        boxShadow: open ? "0 32px 80px rgba(0,0,0,.75), 0 0 40px rgba(255,23,68,.08)" : "none",
      }}>
        {/* Header */}
        <div style={{ padding: "13px 16px", borderBottom: "1px solid rgba(255,255,255,.06)", background: "rgba(255,23,68,.05)", display: "flex", alignItems: "center", gap: 11, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#ff1744,#c62828)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} className="pr">
            <Ic n="bot" s={16} c="#fff" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>APEX AI Coach</div>
            <div style={{ fontSize: 10, color: "#00e676", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#00e676", display: "inline-block", flexShrink: 0 }} />
              Online — Ready to help
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,.06)", border: "none", color: "var(--mu)", cursor: "pointer", padding: "5px", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s", flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.12)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.06)"; e.currentTarget.style.color = "var(--mu)"; }}>
            <Ic n="x" s={16} />
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 13px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
          {msgs.map((m, i) => (
            <div key={i} className="cb" style={{ display: "flex", gap: 7, flexDirection: m.r === "u" ? "row-reverse" : "row", alignItems: "flex-end" }}>
              {m.r === "a" && (
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#ff1744,#c62828)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ic n="zap" s={11} c="#fff" />
                </div>
              )}
              <div style={{
                maxWidth: "82%", padding: "10px 13px", fontSize: 12.5, lineHeight: 1.65, wordBreak: "break-word",
                background: m.r === "u" ? "linear-gradient(135deg,#ff1744,#c62828)" : "rgba(255,255,255,.06)",
                border: m.r === "u" ? "none" : "1px solid rgba(255,255,255,.07)",
                color: "#fff",
                borderRadius: m.r === "u" ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
              }} dangerouslySetInnerHTML={{ __html: formatAI(m.t) }} />
            </div>
          ))}
          {load && (
            <div style={{ display: "flex", gap: 7, alignItems: "flex-end" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#ff1744,#c62828)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ic n="zap" s={11} c="#fff" />
              </div>
              <div style={{ padding: "11px 15px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.07)", borderRadius: "14px 14px 14px 3px", display: "flex", gap: 4, alignItems: "center" }}>
                <div className="tdt" /><div className="tdt" /><div className="tdt" />
              </div>
            </div>
          )}
          <div ref={bot} />
        </div>

        {/* Quick Suggestions */}
        <div style={{ padding: "7px 11px 5px", display: "flex", gap: 5, flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,.04)", flexShrink: 0 }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)} disabled={load} style={{ fontSize: 10, padding: "4px 8px", background: "rgba(255,23,68,.08)", border: "1px solid rgba(255,23,68,.2)", color: "rgba(255,160,160,.9)", cursor: load ? "not-allowed" : "pointer", letterSpacing: .3, transition: "all .2s", fontFamily: "Barlow,sans-serif", borderRadius: 3, opacity: load ? .5 : 1 }}
              onMouseEnter={e => { if (!load) { e.target.style.background = "rgba(255,23,68,.2)"; e.target.style.color = "#fff"; } }}
              onMouseLeave={e => { e.target.style.background = "rgba(255,23,68,.08)"; e.target.style.color = "rgba(255,160,160,.9)"; }}>
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: "9px 12px 12px", borderTop: "1px solid rgba(255,255,255,.06)", display: "flex", gap: 7, flexShrink: 0 }}>
          <input
            ref={inpRef} type="text" placeholder="Ask me anything about fitness..."
            value={inp} onChange={e => setInp(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(inp); } }}
            disabled={load}
            style={{ flex: 1, padding: "10px 12px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.09)", color: "#fff", fontSize: 12.5, outline: "none", borderRadius: 6, opacity: load ? .7 : 1, minWidth: 0 }}
          />
          <button
            onClick={() => send(inp)} disabled={load || !inp.trim()}
            style={{ width: 38, height: 38, background: inp.trim() && !load ? "var(--r)" : "rgba(255,255,255,.07)", border: "none", cursor: inp.trim() && !load ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s", borderRadius: 6, flexShrink: 0 }}>
            <Ic n="send" s={15} c="#fff" />
          </button>
        </div>
      </div>

      {/* FAB Button */}
      <button
        onClick={() => open ? onClose() : null}
        style={{
          position: "fixed", bottom: 20, right: 20, zIndex: 1000,
          width: 54, height: 54, borderRadius: "50%",
          background: open ? "rgba(30,30,36,.9)" : "linear-gradient(135deg,#ff1744,#c62828)",
          border: open ? "1px solid rgba(255,255,255,.15)" : "none",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: open ? "none" : "0 6px 28px rgba(255,23,68,.55)",
          transition: "all .3s",
        }}
        className={open ? "" : "pr"}>
        <Ic n={open ? "x" : "bot"} s={22} c="#fff" />
      </button>
    </>
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <>
      <style>{G}</style>
      <div className="noise" />
      <Nav onChat={() => setChatOpen(true)} />
      <main>
        <Hero onChat={() => setChatOpen(true)} />
        <Features />
        <Programs />
        <Nutrition />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
      <Chatbot open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
/*
───────────────────────────────────────────────────────────────────────────────
INSTALL ALL REQUIREMENTS TO RUN THIS PROJECT

To run this AI Gym Website, please make sure you have the following dependencies and tools installed:

1. Install Node.js and npm
   Download and install from: https://nodejs.org

2. Project setup
   - Open your terminal.
   - Navigate to (or create) your desired project directory.

3. Place the `gym-website.jsx` file into your project directory.

4. Initialize npm (if you haven't already):
      npm init -y

5. Install the required React libraries:
      npm install react react-dom

6. (Recommended) Install a frontend build tool for local development:

   - Using Vite:
        npm create vite@latest . -- --template react
        npm install
        # Replace `App.jsx` in the generated source with this file's contents.
        npm run dev

   - OR using Parcel:
        npm install --save-dev parcel
        # In your package.json, add:
        # "scripts": { "start": "parcel index.html" }
        npm start

7. Create an `index.html` file in your project root with at least:
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8" />
     <title>AI Gym Website</title>
   </head>
   <body>
     <div id="root"></div>
     <script type="module" src="./main.jsx"></script>
   </body>
   </html>

8. Create a `main.jsx` file:
   import React from "react";
   import { createRoot } from "react-dom/client";
   import App from "./gym-website.jsx";
   createRoot(document.getElementById("root")).render(<App />);

9. Install any missing dependencies if prompted.

10. Anthropic Claude API KEY (required for full functionality):
    - Obtain an API key: https://console.anthropic.com
    - Add the key securely; do not commit it in public repos.
    - For demos/testing, you may mock responses.

───────────────────────────────────────────────────────────────────────────────
NOTES:
- This project uses React 18+.
- Do NOT expose your Anthropic API key in production frontend code.
- An API proxy or backend may be needed for local development.
- For best results, use Vite, Parcel, or Create React App as your build tool.

───────────────────────────────────────────────────────────────────────────────
*/