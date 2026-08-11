import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { siteCss, Section, onImgErr } from "../components/shared";

// ————————————————————————————————————————————————
// EDIT THESE — landing-page content lives here.
// ————————————————————————————————————————————————
const GRAD = {
  name: "Musembi J.M",
  fullName: "Musembi Job Munyithya",
  honours: "First Class Honours · Class of 2026",
  course: "Bachelor of Business Information Technology, Business Intelligence major",
  school: "Strathmore University · School of Computing and Engineering",
  gradDate: "Wednesday, 12 August 2026",
  intro:
    "Four years and more in the making, and finally here. This little corner of the internet holds the story so far, a place to leave me a word, and a way to send a blessing for anyone celebrating from afar. Thank you for being part of the road.",
};

// A 10-year road (2016 → 2026). Warm, dash-free milestones. Photos in static/journey/<year>.jpg
const JOURNEY = [
  { year: "2016", img: "/journey/2016.jpg", title: "A Joyful Beginning", body: "After finishing high school with a B plus, just a whisker from an A minus, I had my heart set on architecture at UoN. When the selection filled up, I happily found my place in Computing and Engineering at Strathmore, a path I had also dreamed of." },
  { year: "2017", img: "/journey/2017.jpg", title: "Friendships and Freedom", body: "I completed first year and built friendships I treasure. As an evening student the days were mine, so I studied in the daytime and poured love into my hobbies." },
  { year: "2018", img: "/journey/2018.jpg", title: "Rising to the Challenge", body: "The workload grew and second year asked a lot, three semesters back to back. I finished strong, then gave myself a kind semester break at the start of third year to rest and take in everything I had learned." },
  { year: "2019", img: "/journey/2019.jpg", title: "A Bold New Direction", body: "I followed my curiosity into a specialised, hands on software engineering course, chasing real practice over theory. I earned my certificate at the prestigious Moringa School, finishing right on time just before the world changed." },
  { year: "2020", img: "/journey/2020.jpg", title: "Building With Purpose", body: "With fresh practical skills, I stepped into software engineering for real. I built projects with brilliant people, made wonderful friends, and shipped work that made technology more accessible where it is truly needed. I also cheered on my old classmates as they graduated." },
  { year: "2021", img: "/journey/2021.jpg", title: "Growing and Exploring", body: "I kept honing my craft as a software engineer while joyfully exploring a few entrepreneurial ventures on the side." },
  { year: "2022", img: "/journey/2022.jpg", title: "Passion Finds a Home", body: "Fuelled by passion, I earned a place at a tech company and interned there, and by year's end I had secured a role at our family business, ready to begin full time." },
  { year: "2023", img: "/journey/2023.jpg", title: "Work, Study, and Grace", body: "I joined the family chemical company as a tech consultant and admin, shipping its tech assets and doing work I am proud of. I also rejoined university to finish my degree, carried the whole way by my parents, who are a gift from God." },
  { year: "2024", img: "/journey/2024.jpg", title: "Faith and Growth", body: "Alongside work and school, I completed Insight, a yearlong course focusing on character, morality and community wisdom. Giving my weekends to it made finishing it feel especially sweet." },
  { year: "2025", img: "/journey/2025.jpg", title: "Almost There", body: "One skipped semester set off a domino effect, so I pieced my remaining units together as they became available. Through it all I began my final year project and carried it forward into 2026." },
  { year: "2026", img: "/journey/2026.jpg", title: "First Class, and Full of Gratitude", body: "On the 12th of August we graduate with First Class Honours. What a milestone, and what joy to see it through. My heart is full of thanks for everyone who walked this road and lifted me along the way." },
];

const PILLARS = [
  { id: "faith", label: "Faith & Purpose" },
  { id: "love", label: "Love & Relationships" },
  { id: "money", label: "Money & Wealth" },
];
const emptyForm = { faith: "", love: "", money: "" };

// M-Pesa Send Money + physical gift (edit the contact link to your email or WhatsApp).
const GIFT = { phone: "0111 203 302", name: GRAD.fullName, contact: "https://wa.me/254111203301" };

// ————————————————————————————————————————————————

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

export default function IndexPage() {
  const [advice, setAdvice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [posting, setPosting] = useState(false);
  const [filter, setFilter] = useState("all");
  const [zoom, setZoom] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("advice")
          .select("*")
          .order("id", { ascending: false });
        if (!error && data) setAdvice(data);
      } catch (_) {}
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e) => e.key === "Escape" && setZoom(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);

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
      <style>{siteCss}</style>

      <nav className="nav">
        <span className="mark">J · M</span>
        <div className="navlinks">
          <a href="#journey">Journey</a>
          <a href="#wall">Leave a word</a>
          <a href="#support">A gift</a>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero">
        <span className="badge">{GRAD.honours}</span>
        <h1 className="grad-name">{GRAD.name}</h1>
        <div className="flourish" />
        <p className="degree">{GRAD.course}</p>
        <p className="school">{GRAD.school}</p>
        <p className="hero-intro">{GRAD.intro}</p>
        <div className="hero-meta">
          <span>Graduation day · {GRAD.gradDate}</span>
        </div>
        <a className="btn ghost" href="#wall">Leave a word for me ↓</a>
      </header>

      {/* JOURNEY */}
      <Section id="journey">
        <p className="kicker">The road here</p>
        <h2 className="h2">Four years and more, in short</h2>
        <p className="lead">Four years and more of evening classes, growth, and so much love along the way. Tap any photo to enlarge it.</p>
        <ol className="journey">
          {JOURNEY.map((j, i) => (
            <li key={i}>
              <div className="jimg photo" data-label={j.year}>
                <img src={j.img} alt={j.title} loading="lazy" onError={onImgErr} onClick={() => setZoom(j)} style={{ cursor: "zoom-in" }} />
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

      {/* ADVICE WALL */}
      <Section id="wall">
        <p className="kicker">The reason I built this</p>
        <h2 className="h2">Leave me a piece of advice</h2>
        <p className="lead">
          It's anonymous, no names, no signing in. Leave a word on each of the three,
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
          <p className="empty">No notes here yet, be the first.</p>
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

      {/* SUPPORT */}
      <Section id="support">
        <p className="kicker">If you'd like to</p>
        <h2 className="h2">Send a little something</h2>
        <p className="lead">
          There is no obligation at all. If you are near or far and would like to bless me
          as I begin this next chapter, it means the world.
        </p>

        <div className="gift">
          <span className="gift-badge">M-Pesa · Send Money</span>
          <CopyRow label="Send Money to" value={GIFT.phone} />
          <p className="gift-name">Reaches {GIFT.name}</p>
        </div>
        <p className="gift-alt">
          Would you prefer to send a physical gift? I would love that.{" "}
          <a href={GIFT.contact}>Reach out to me here</a> and I will happily share my address.
        </p>
      </Section>

      <footer className="foot">
        <p className="foot-name">{GRAD.fullName}</p>
        <p className="foot-line">Thank you for celebrating this with me.</p>
        <a className="backlink" href="/dinner">Invited to the dinner? View the details →</a>
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

export const Head = () => <title>Musembi JM · Graduating 2026</title>;
