import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

// ————————————————————————————————————————————————
// EDIT THESE — everything you'll want to change lives here.
// ————————————————————————————————————————————————
const GRAD = {
  name: "Job Musembi",
  fullName: "Job M. Musembi",
  eyebrow: "You're invited · Class of 2026",
  degree: "BSc Business Information Technology, Strathmore University",
  date: "Wednesday, 12 August 2026",
  time: "5:00 PM — 8:00 PM",
  venue: "Dijo · Nairobi",
  dress: "Smart · a touch of green",
  intro:
    "A quiet dinner to close the chapter... come as you are, leave a word behind.",
};

// A 10-year road (2016 → 2026). Static captions. Put photos in static/journey/<year>.jpg
const JOURNEY = [
  { year: "2016", img: "/journey/2016.jpg", title: "A New Beginning", body: "Started university in September — evening classes, 5 to 8 — buzzing with ambition and no idea what the next ten years would ask of me." },
  { year: "2017", img: "/journey/2017.jpg", title: "Building Friendships", body: "Made it through first year and found my people — the classmates who'd carry me through everything that came after." },
  { year: "2018", img: "/journey/2018.jpg", title: "Rising to the Challenge", body: "The work got real: Calculus, three semesters back-to-back with no long breaks. Got featured on the university website, then took a personal break, September to December." },
  { year: "2019", img: "/journey/2019.jpg", title: "Strength Through Loss", body: "Back in January, and soon after I lost someone close in my family. My friends and cell members held me through the hardest stretch of all." },
  { year: "2020", img: "/journey/2020.jpg", title: "Discovering Software Development", body: "Enrolled in the Moringa School bootcamp and fell for software engineering — while watching my uni friends graduate and trusting my own longer road." },
  { year: "2021", img: "/journey/2021.jpg", title: "Upskilling for the Future", body: "A year of sharpening tools: certifications in digital marketing, e-commerce, web development and design." },
  { year: "2022", img: "/journey/2022.jpg", title: "Career Growth & New Opportunities", body: "Web development found momentum. Shipped client sites — including my dad's company, now past 30,000 visitors — and landed an internship at Green Spoon." },
  { year: "2023", img: "/journey/2023.jpg", title: "Balancing Work & Education", body: "Joined Faholo Chemicals and kept evening classes going. Full-time work and school at once was brutal, but with my parents behind me, I carried both." },
  { year: "2024", img: "/journey/2024.jpg", title: "Personal Growth & New Milestones", body: "Still working, I pushed the final-year project forward, earned another certification through NLC Insights, and laced up for a run club." },
  { year: "2025", img: "/journey/2025.jpg", title: "Independence & Finishing Strong", body: "Moved into my own place and kept the balance going. Cleared my remaining units — French included — and the final-year project." },
  { year: "2026", img: "/journey/2026.jpg", title: "Graduation & Looking Ahead", body: "Worked right up to the finish, wrapped the project, and earned grades I'm proud of. Ten years of perseverance — now, the next chapter." },
];

const MENU = [
  { course: "To start", dish: "Roast tomato & basil soup", note: "warm bread, olive oil" },
  {
    course: "The main",
    note: "seasonal greens, spiced rice",
    options: [
      { tag: "Non-veg", text: "Herb chicken or grilled tilapia" },
      { tag: "Veg", text: "Roasted vegetable & halloumi skewers" },
    ],
  },
  { course: "To finish", dish: "Passion-fruit cheesecake", note: "Kenyan coffee or dawa" },
];

// One long table for 25. Amani sits at the head; guests fill the sides.
// Replace these 24 names with your real seating list — order = seat order down the table.
const GUEST_NAMES = [
  "Laban M.", "Dorcas M.", "Joses M.", "Anne M.", "John N.", "Rose N.",
  "George O.", "Cate G.", "Anne M.", "Micheal M.", "Timothy K.","Kawira K.",
  "Daniel K.", "Nats P.", "Patience M.", "Frida M.", "Joe M.", "Ken M.",
  "Apollo M.", "Sharon M.", "Edmond E.", "Joel M.", "Faith M.", "Caleb F.",
];
const GUESTS = GUEST_NAMES.map((name, i) => ({ n: i + 2, name }));
const LEFT = GUESTS.filter((_, i) => i % 2 === 0);
const RIGHT = GUESTS.filter((_, i) => i % 2 === 1);

// The three pillars — guests can leave a word on each.
const PILLARS = [
  { id: "faith", label: "Faith & Purpose" },
  { id: "love", label: "Love & Relationships" },
  { id: "money", label: "Money & Wealth" },
];
const emptyForm = { faith: "", love: "", money: "" };

// Manual M-Pesa gift — Send Money is the single channel.
const GIFT = { phone: "0111 203 302", name: GRAD.fullName };

// ————————————————————————————————————————————————

const useReveal = () => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setShown(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setShown(true), io.disconnect()),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
};

function Section({ id, children }) {
  const [ref, shown] = useReveal();
  return (
    <section id={id} ref={ref} className={`sec ${shown ? "in" : ""}`}>
      {children}
    </section>
  );
}

function Detail({ k, v }) {
  return (
    <div className="dt">
      <span className="dt-k">{k}</span>
      <span className="dt-v">{v}</span>
    </div>
  );
}

function CopyRow({ label, value }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try {
      navigator.clipboard?.writeText(value.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (_) {}
  };
  return (
    <div className="gift-row">
      <span className="gift-k">{label}</span>
      <b className="gift-v">{value}</b>
      <button className="copy" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
    </div>
  );
}

function Tent({ seat, align }) {
  return (
    <div className={`tent ${align}`}>
      <span className="seat-no">Seat {seat.n}</span>
      <span className="seat-name">{seat.name}</span>
    </div>
  );
}

function AdviceField({ pillar, value, onChange }) {
  const starter = `On ${pillar.label}, my advice is… `;
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try {
      navigator.clipboard?.writeText(starter);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (_) {}
  };
  return (
    <div className="afield">
      <div className="afield-head">
        <span className="afield-label">{pillar.label}</span>
        <button className="copy" onClick={copy}>{copied ? "Copied" : "Copy starter"}</button>
      </div>
      <button className="starter" onClick={() => onChange(starter)}>{starter}</button>
      <textarea
        className="ta"
        rows={2}
        maxLength={280}
        placeholder="Write your advice…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

const onImgErr = (e) => {
  e.currentTarget.style.display = "none";
  e.currentTarget.parentElement.classList.add("broken");
};

export default function GraduationDinner() {
  const [advice, setAdvice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [posting, setPosting] = useState(false);
  const [filter, setFilter] = useState("all");
  const [zoom, setZoom] = useState(null); // enlarged journey photo

  // Load the wall from Supabase, newest first.
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("advice")
          .select("*")
          .order("id", { ascending: false });
        if (!error && data) setAdvice(data);
      } catch (_) { /* empty wall */ }
      setLoading(false);
    })();
  }, []);

  // Close the lightbox on Escape.
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e) => e.key === "Escape" && setZoom(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);

  // Submit one row per filled pillar — all anonymous.
  const submit = async () => {
    const entries = PILLARS
      .filter((p) => form[p.id].trim())
      .map((p) => ({ pillar: p.id, text: form[p.id].trim() }));
    if (!entries.length) return;
    setPosting(true);
    try {
      const { data, error } = await supabase.from("advice").insert(entries).select();
      if (!error && data) setAdvice((prev) => [...data.reverse(), ...prev]);
    } catch (_) {}
    setForm(emptyForm);
    setPosting(false);
  };

  const hasAny = PILLARS.some((p) => form[p.id].trim());
  const shown = filter === "all" ? advice : advice.filter((a) => a.pillar === filter);
  const pillarOf = (id) => PILLARS.find((p) => p.id === id);

  return (
    <div className="wrap">
      <style>{css}</style>

      <nav className="nav">
        <span className="mark">J · M · M</span>
        <div className="navlinks">
          <a href="#journey">Journey</a>
          <a href="#evening">The evening</a>
          <a href="#wall">Leave a word</a>
          <a href="#support">A gift</a>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero">
        <p className="eyebrow">{GRAD.eyebrow}</p>
        <h1 className="grad-name">{GRAD.name}</h1>
        <p className="degree">{GRAD.degree}</p>
        <p className="hero-intro">{GRAD.intro}</p>
        <div className="hero-meta">
          <span>{GRAD.date}</span>
          <i />
          <span>{GRAD.time}</span>
          <i />
          <span>{GRAD.venue}</span>
        </div>
        <a className="btn ghost" href="#wall">Leave a word for me ↓</a>
      </header>

      {/* JOURNEY */}
      <Section id="journey">
        <p className="kicker">The road here</p>
        <h2 className="h2">Ten years, in short</h2>
        <p className="lead">Delayed but never denied. A four-year degree that somehow took a decade. Tap any photo to enlarge it.</p>
        <ol className="journey">
          {JOURNEY.map((j, i) => (
            <li key={i}>
              <div className="jimg photo" data-label={j.year}>
                <img
                  src={j.img}
                  alt={j.title}
                  loading="lazy"
                  onError={onImgErr}
                  onClick={() => setZoom(j)}
                  style={{ cursor: "zoom-in" }}
                />
              </div>
              <div className="jtext">
                <span className="jyear">{j.year}</span>
                <h3>{j.title}</h3>
                <p>{j.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* EVENING */}
      <Section id="evening">
        <p className="kicker">The evening</p>
        <h2 className="h2">A set menu, one long table of friends</h2>
        <div className="evening-grid">
          <div className="menu">
            {MENU.map((m, i) => (
              <div className="menu-row" key={i}>
                <span className="menu-course">{m.course}</span>
                <div>
                  {m.options ? (
                    m.options.map((o, k) => (
                      <p className="menu-dish" key={k}>
                        <span className="menu-opt">{o.tag}</span>{o.text}
                      </p>
                    ))
                  ) : (
                    <p className="menu-dish">{m.dish}</p>
                  )}
                  <p className="menu-note">{m.note}</p>
                </div>
              </div>
            ))}
          </div>
          <aside className="details">
            <Detail k="When" v={`${GRAD.date} · ${GRAD.time}`} />
            <Detail k="Where" v={GRAD.venue} />
            <Detail k="Dress" v={GRAD.dress} />
            <Detail k="Menu" v="Fixed 3-course · tell us of any allergies" />
          </aside>
        </div>

        {/* One long table for 25 */}
        <div className="banquet-wrap">
          <p className="kicker center">One long table</p>
          <h3 className="banquet-title">Twenty-five of us, side by side</h3>
          <p className="banquet-note">Find your name — there's a tent card at your plate.</p>

          <div className="table-photo photo" data-label="Table preview">
            <img src="/table-preview.jpg" alt="How the long table will look" loading="lazy" onError={onImgErr} />
          </div>

          <div className="banquet">
            <div className="head-seat">
              <span className="seat-no">Seat 1 · head of table</span>
              <span className="seat-name">{GRAD.name}</span>
              <span className="seat-role">the graduate</span>
            </div>
            <div className="banquet-body">
              <div className="side left">
                {LEFT.map((s) => <Tent key={s.n} seat={s} align="r" />)}
              </div>
              <div className="table-strip" aria-hidden="true" />
              <div className="side right">
                {RIGHT.map((s) => <Tent key={s.n} seat={s} align="l" />)}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ADVICE WALL */}
      <Section id="wall">
        <p className="kicker">The reason I built this</p>
        <h2 className="h2">Leave me a piece of advice</h2>
        <p className="lead">
          It's anonymous — no names, no signing in. Leave a word on each of the three,
          or just the one that moves you. Tap a starter to begin.
        </p>

        <div className="composer">
          {PILLARS.map((p) => (
            <AdviceField
              key={p.id}
              pillar={p}
              value={form[p.id]}
              onChange={(val) => setForm((f) => ({ ...f, [p.id]: val }))}
            />
          ))}
          <div className="composer-foot">
            <span className="tiny">Each note you write posts anonymously to the wall below.</span>
            <button className="btn solid" onClick={submit} disabled={posting || !hasAny}>
              {posting ? "Pinning…" : "Pin them to the wall"}
            </button>
          </div>
        </div>

        <div className="filter-row">
          <button className={`fbtn ${filter === "all" ? "on" : ""}`} onClick={() => setFilter("all")}>All</button>
          {PILLARS.map((p) => (
            <button key={p.id} className={`fbtn ${filter === p.id ? "on" : ""}`} onClick={() => setFilter(p.id)}>
              {p.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="empty">Opening the wall…</p>
        ) : shown.length === 0 ? (
          <p className="empty">No notes here yet — be the first.</p>
        ) : (
          <div className="wall">
            {shown.map((a) => (
              <figure className="note" key={a.id}>
                <span className="note-tag">{pillarOf(a.pillar)?.label}</span>
                <blockquote>{a.text}</blockquote>
                <figcaption>— Anonymous</figcaption>
              </figure>
            ))}
          </div>
        )}
      </Section>

      {/* SUPPORT — Send Money only */}
      <Section id="support">
        <p className="kicker">If you'd like to</p>
        <h2 className="h2">Send a little something</h2>
        <p className="lead">
          No obligation at all. If you'd like to help me start the next chapter, an
          M-Pesa gift means the world. Tap to copy, then send from your phone.
        </p>

        <div className="gift">
          <span className="gift-badge">M-Pesa · Send Money</span>
          <CopyRow label="Send Money to" value={GIFT.phone} />
          <p className="gift-name">Reaches {GIFT.name}</p>
        </div>
      </Section>

      <footer className="foot">
        <p className="foot-name">{GRAD.fullName}</p>
        <p className="foot-line">Thank you for being part of the road here.</p>
      </footer>

      {/* LIGHTBOX */}
      {zoom && (
        <div className="lightbox" onClick={() => setZoom(null)}>
          <button className="lb-close" onClick={() => setZoom(null)} aria-label="Close">✕</button>
          <figure className="lb-fig" onClick={(e) => e.stopPropagation()}>
            <img src={zoom.img} alt={zoom.title} />
            <figcaption><b>{zoom.year}</b> — {zoom.title}</figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.wrap{
  --bg:#FFFFFF; --ink:#0F1A13; --muted:#5A665C;
  --green:#16E35B; --accent:#0C8F3D;
  --panel:#F3F7F3; --panel2:#EDF3ED; --line:#E1E9E1;
  --title:21px;
  background:var(--bg); color:var(--ink);
  font-family:'Inter',system-ui,sans-serif; line-height:1.6;
  overflow-x:hidden; -webkit-font-smoothing:antialiased;
}
.wrap *{box-sizing:border-box}
a{color:inherit;text-decoration:none}

/* one standard title style */
.grad-name,.h2,.banquet-title,.foot-name{
  font-weight:700;text-transform:uppercase;letter-spacing:.04em;
  font-size:var(--title);line-height:1.25;color:var(--ink);margin:0;
}

.nav{
  position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;
  padding:16px clamp(20px,5vw,64px);
  background:rgba(255,255,255,.8);backdrop-filter:blur(10px);
  border-bottom:1px solid var(--line);
}
.mark{font-weight:700;letter-spacing:.18em;color:var(--accent);font-size:15px}
.navlinks{display:flex;gap:clamp(14px,3vw,34px);font-size:13.5px;color:var(--muted)}
.navlinks a{transition:color .2s}
.navlinks a:hover{color:var(--accent)}

.hero{
  min-height:86vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;padding:80px clamp(20px,5vw,40px) 60px;
  background:
    radial-gradient(120% 80% at 50% -10%, rgba(22,227,92,.20), transparent 60%),
    radial-gradient(70% 50% at 85% 110%, rgba(22,227,92,.12), transparent 55%);
}
.eyebrow{font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--accent);margin:0 0 20px}
.grad-name{font-size:26px;letter-spacing:.14em}
.degree{color:var(--muted);font-size:15px;margin:12px 0 0}
.hero-intro{max-width:540px;color:var(--muted);font-size:16px;margin:22px auto 0;font-weight:300}
.hero-meta{
  display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:center;
  margin:30px 0 32px;font-size:13px;letter-spacing:.04em;color:var(--ink)
}
.hero-meta i{width:4px;height:4px;border-radius:50%;background:var(--green);display:inline-block}

.btn{display:inline-block;cursor:pointer;font-family:inherit;font-size:13px;font-weight:600;
  text-transform:uppercase;letter-spacing:.06em;border-radius:12px;
  transition:transform .18s, box-shadow .2s, background .2s, filter .2s;border:none}
.btn.ghost{padding:13px 26px;border:1.5px solid var(--green);color:var(--ink);background:transparent}
.btn.ghost:hover{background:rgba(22,227,92,.12);transform:translateY(-2px)}
.btn.solid{padding:13px 26px;background:var(--green);color:#04240F;box-shadow:0 6px 20px rgba(22,227,92,.35)}
.btn.solid:hover:not(:disabled){filter:brightness(1.06);transform:translateY(-2px);box-shadow:0 10px 28px rgba(22,227,92,.45)}
.btn.solid:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}

.sec{
  max-width:1000px;margin:0 auto;padding:clamp(70px,10vw,120px) clamp(20px,5vw,40px);
  opacity:0;transform:translateY(26px);transition:opacity .7s ease, transform .7s ease;
}
.sec.in{opacity:1;transform:none}
.kicker{font-size:11.5px;letter-spacing:.26em;text-transform:uppercase;color:var(--accent);margin:0 0 12px}
.kicker.center{text-align:center}
.h2{margin:0 0 6px}
.lead{max-width:560px;color:var(--muted);font-weight:300;margin:14px 0 0;font-size:16px}

/* shared photo placeholder */
.photo{position:relative}
.photo.broken::after{content:"📷  " attr(data-label);position:absolute;inset:0;display:flex;
  align-items:center;justify-content:center;color:var(--muted);font-size:12px;letter-spacing:.08em}

/* journey */
.journey{list-style:none;margin:40px 0 0;padding:0}
.journey li{display:grid;grid-template-columns:128px 1fr;gap:24px;align-items:center;
  padding:22px 0;border-top:1px solid var(--line)}
.journey li:last-child{border-bottom:1px solid var(--line)}
.jimg{width:128px;height:128px;border-radius:12px;overflow:hidden;
  background:linear-gradient(135deg,var(--panel2),var(--panel));border:1px solid var(--line)}
.jimg img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .25s}
.jimg img:hover{transform:scale(1.05)}
.jyear{font-weight:700;color:var(--accent);font-size:15px;letter-spacing:.05em}
.jtext h3{margin:5px 0 5px;font-size:18px;font-weight:600}
.jtext p{margin:0;color:var(--muted);font-weight:300;font-size:15px}

/* evening */
.evening-grid{display:grid;grid-template-columns:1.3fr 1fr;gap:40px;margin:44px 0 0;align-items:start}
.menu-row{display:grid;grid-template-columns:110px 1fr;gap:18px;padding:20px 0;border-top:1px solid var(--line)}
.menu-row:last-child{border-bottom:1px solid var(--line)}
.menu-course{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);padding-top:3px}
.menu-dish{font-size:17px;font-weight:500;margin:0 0 4px;color:var(--ink)}
.menu-opt{display:inline-block;font-size:10px;letter-spacing:.1em;text-transform:uppercase;
  background:rgba(22,227,92,.16);color:var(--accent);padding:2px 9px;border-radius:999px;margin-right:9px;vertical-align:middle}
.menu-note{margin:4px 0 0;color:var(--muted);font-weight:300;font-size:14px;font-style:italic}
.details{background:var(--panel);border-radius:14px;padding:26px;border:1px solid var(--line)}
.dt{padding:12px 0;border-bottom:1px dashed var(--line)}
.dt:last-child{border-bottom:none}
.dt-k{display:block;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);margin-bottom:3px}
.dt-v{font-size:15px}

/* banquet */
.banquet-wrap{margin:66px 0 0}
.banquet-title{text-align:center;margin:6px 0 0}
.banquet-note{text-align:center;color:var(--muted);font-weight:300;font-size:14px;margin:8px 0 0}
.table-photo{max-width:640px;margin:22px auto 0;aspect-ratio:16/9;border-radius:16px;overflow:hidden;
  background:linear-gradient(135deg,var(--panel2),var(--panel));border:1px solid var(--line)}
.table-photo img{width:100%;height:100%;object-fit:cover;display:block}
.banquet{margin:34px 0 0}
.head-seat{max-width:250px;margin:0 auto 14px;text-align:center;background:var(--green);color:#04240F;
  border-radius:12px;padding:14px 18px;box-shadow:0 8px 24px rgba(22,227,92,.3)}
.head-seat .seat-no{display:block;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;opacity:.8}
.head-seat .seat-name{display:block;font-size:20px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin:2px 0 0}
.head-seat .seat-role{display:block;font-size:12px;font-style:italic;opacity:.85}
.banquet-body{display:grid;grid-template-columns:1fr 46px 1fr;gap:18px;align-items:stretch}
.side{display:flex;flex-direction:column;gap:12px}
.side.left{align-items:flex-end}
.side.right{align-items:flex-start}
.table-strip{border-radius:16px;border:1px solid rgba(22,227,92,.32);
  background:linear-gradient(180deg,rgba(22,227,92,.16),rgba(22,227,92,.05))}
.tent{width:min(230px,100%);background:var(--panel);border:1px solid var(--line);
  border-radius:10px;padding:12px 14px;position:relative;transition:transform .18s,border-color .18s,box-shadow .18s}
.tent::before{content:"";position:absolute;top:0;left:16px;right:16px;height:3px;
  background:var(--green);border-radius:0 0 3px 3px;opacity:.6}
.tent:hover{transform:translateY(-2px);border-color:var(--green);box-shadow:0 6px 16px rgba(22,227,92,.15)}
.tent.r{text-align:right}
.tent .seat-no{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent)}
.tent .seat-name{display:block;font-size:16px;font-weight:600;margin-top:2px}

/* advice composer */
.composer{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:24px;margin:34px 0 0}
.afield{margin:0 0 20px}
.afield-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:8px}
.afield-label{font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.starter{display:block;width:100%;text-align:left;cursor:pointer;font-family:inherit;font-style:italic;
  color:var(--muted);background:#fff;border:1px dashed rgba(22,227,92,.5);
  border-radius:9px;padding:9px 13px;font-size:13.5px;margin-bottom:9px;transition:all .16s}
.starter:hover{color:var(--ink);border-color:var(--green);background:rgba(22,227,92,.06)}
.ta{width:100%;font-family:inherit;font-size:15px;color:var(--ink);background:#fff;
  border:1px solid var(--line);border-radius:10px;padding:12px 14px;resize:vertical}
.ta:focus{outline:none;border-color:var(--green)}
.ta::placeholder{color:#9aa89e}
.copy{cursor:pointer;font-family:inherit;font-size:11.5px;padding:6px 12px;border-radius:999px;
  background:transparent;color:var(--ink);border:1px solid rgba(22,227,92,.55);transition:all .18s;white-space:nowrap}
.copy:hover{background:rgba(22,227,92,.12)}
.composer-foot{display:flex;gap:12px;margin:6px 0 0;align-items:center;justify-content:space-between;flex-wrap:wrap}
.tiny{font-size:12px;color:var(--muted)}

.filter-row{display:flex;flex-wrap:wrap;gap:8px;margin:40px 0 20px}
.fbtn{cursor:pointer;font-family:inherit;font-size:12.5px;padding:7px 14px;border-radius:999px;background:transparent;color:var(--muted);border:1px solid var(--line)}
.fbtn.on{color:var(--accent);border-color:var(--green)}
.empty{color:var(--muted);font-style:italic;padding:30px 0}

.wall{columns:3;column-gap:16px}
.note{break-inside:avoid;margin:0 0 16px;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:18px}
.note-tag{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent)}
.note blockquote{margin:10px 0 12px;font-size:16px;line-height:1.5;font-style:italic;color:var(--ink)}
.note figcaption{color:var(--muted);font-size:13px;font-style:italic}

/* gift */
.gift{max-width:440px;margin:36px 0 0;background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:28px;position:relative}
.gift-badge{position:absolute;top:-11px;left:24px;background:var(--green);color:#04240F;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;padding:5px 12px;border-radius:999px}
.gift-row{display:flex;align-items:baseline;gap:12px;padding:16px 0}
.gift-k{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);flex:1}
.gift-v{font-size:22px;font-weight:600;letter-spacing:.02em}
.gift-name{margin:6px 0 0;color:var(--muted);font-size:13px;font-style:italic}

.foot{text-align:center;padding:80px 20px;border-top:1px solid var(--line);margin-top:40px;
  background:radial-gradient(120% 160% at 50% 130%, rgba(22,227,92,.24), transparent 62%)}
.foot-name{margin:0}
.foot-line{color:var(--muted);font-weight:300;margin:10px 0 0}

/* lightbox */
.lightbox{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;
  padding:24px;background:rgba(8,20,12,.86);backdrop-filter:blur(4px);cursor:zoom-out;
  animation:lbfade .18s ease}
@keyframes lbfade{from{opacity:0}to{opacity:1}}
.lb-fig{margin:0;max-width:min(920px,92vw);cursor:default}
.lb-fig img{width:100%;max-height:80vh;object-fit:contain;border-radius:12px;display:block;
  box-shadow:0 20px 60px rgba(0,0,0,.5)}
.lb-fig figcaption{color:#EDF3ED;text-align:center;margin:14px 0 0;font-size:14px}
.lb-fig figcaption b{color:var(--green)}
.lb-close{position:absolute;top:20px;right:24px;width:42px;height:42px;border-radius:50%;
  background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.25);
  font-size:16px;cursor:pointer;transition:background .18s}
.lb-close:hover{background:rgba(255,255,255,.22)}

@media(max-width:760px){
  .navlinks{display:none}
  .evening-grid{grid-template-columns:1fr}
  .journey li{grid-template-columns:92px 1fr;gap:16px}
  .jimg{width:92px;height:92px}
  .banquet-body{grid-template-columns:1fr}
  .table-strip{display:none}
  .side.left,.side.right{align-items:stretch}
  .tent{width:100%}
  .tent.r{text-align:left}
  .wall{columns:1}
}
@media(prefers-reduced-motion:reduce){
  .sec{opacity:1;transform:none;transition:none}
  .btn,.tent,.jimg img{transition:none}
}
`;