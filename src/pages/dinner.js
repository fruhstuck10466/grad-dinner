import React, { useState, useEffect } from "react";
import { siteCss, Section, onImgErr } from "../components/shared";

// ————————————————————————————————————————————————
// EDIT THESE — dinner-page content lives here.
// ————————————————————————————————————————————————
const PASSWORD = "biscuit"; // light privacy only (see note)

const DINNER = {
  venue: "La Casa di Nico",
  venueNote: "an Italian restaurant in Village Market",
  date: "Wednesday, 12 August 2026",
  time: "4:00 PM — 7:00 PM",
  photo: "/la-casa-di-nico.jpg", // drop the restaurant photo in static/
  menuPdf: "/la-casa-di-nico-menu.pdf", // drop the PDF in static/ or paste an external link
};

// The evening, at a glance.
const SCHEDULE = [
  { t: "4:00 PM", label: "Arrival & welcome", note: "Find your name at the table and settle in" },
  { t: "4:20 PM", label: "Opening word & a prayer", note: "" },
  { t: "4:35 PM", label: "Browse the menu & order", note: "Have a look beforehand so it's quick" },
  { t: "5:00 PM", label: "Dinner is served", note: "" },
  { t: "5:45 PM", label: "Eating, laughing, good company", note: "" },
  { t: "6:40 PM", label: "Closing remarks & a toast", note: "" },
  { t: "7:00 PM", label: "Farewell", note: "" },
];

// One table of 15 — Musembi JM at the head, plus 14 guests. Replace with your real list.
const HEAD = "Musembi J.M";
const GUEST_NAMES = [
  "Laban M.", "Dorcas M.", "Joe M.", "Agnes W.", "George O.", "Danny K.", "Kawira M.",
  "Anne M.", "Joel M.", "Timothy K.", "Peter M.", "Frida M.", "Joel M.", "Patience M.",
];
const GUESTS = GUEST_NAMES.map((name, i) => ({ n: i + 2, name }));
const LEFT = GUESTS.filter((_, i) => i % 2 === 0);
const RIGHT = GUESTS.filter((_, i) => i % 2 === 1);

// ————————————————————————————————————————————————

function Detail({ k, v }) {
  return (
    <div className="dt">
      <span className="dt-k">{k}</span>
      <span className="dt-v">{v}</span>
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

export default function DinnerPage() {
  const [ok, setOk] = useState(false);
  const [entered, setEntered] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage?.getItem("dinner-ok") === "1") setOk(true);
    } catch (_) {}
  }, []);

  const tryEnter = () => {
    if (entered.trim().toLowerCase() === PASSWORD) {
      setOk(true);
      try { window.sessionStorage?.setItem("dinner-ok", "1"); } catch (_) {}
    } else {
      setErr(true);
    }
  };

  return (
    <div className="wrap">
      <style>{siteCss}</style>

      <nav className="nav">
        <span className="mark">J · M</span>
        <div className="navlinks">
          <a href="/">← Home</a>
        </div>
      </nav>

      {!ok ? (
        <div className="gate">
          <span className="lock-badge">🔒</span>
          <h1 className="gate-title">A private invitation</h1>
          <p>This page is for dinner guests. Enter the password from your invite to see the details.</p>
          <div className="gate-row">
            <input
              type="password"
              placeholder="Password"
              value={entered}
              onChange={(e) => { setEntered(e.target.value); setErr(false); }}
              onKeyDown={(e) => e.key === "Enter" && tryEnter()}
            />
            <button className="btn solid" onClick={tryEnter}>Enter</button>
          </div>
          {err && <p className="err">That's not quite it. Try again?</p>}
        </div>
      ) : (
        <>
          <Section id="dinner">
            <p className="kicker">You're invited</p>
            <h2 className="h2">Dinner at La Casa di Nico</h2>
            <p className="lead">
              A warm Italian evening to celebrate together. Here is everything you need for the day.
            </p>

            <div className="feature-photo photo" data-label="La Casa di Nico">
              <img src={DINNER.photo} alt="La Casa di Nico restaurant" loading="lazy" onError={onImgErr} />
            </div>

            <div className="details" style={{ marginTop: "30px" }}>
              <Detail k="Where" v={`${DINNER.venue} · ${DINNER.venueNote}`} />
              <Detail k="When" v={DINNER.date} />
              <Detail k="Time" v={DINNER.time} />
              <Detail k="Table" v="One long table for fifteen of us" />
            </div>

            <div className="callout green">
              <p className="ct">A little note</p>
              <p>
                Dinner is fully taken care of, it is my treat. All I ask is that you carry a
                little something, about 300 shillings, in case you would like a juice or a soda.
              </p>
            </div>

            <div className="callout">
              <p className="ct">Before the day</p>
              <p>Take a moment to look through the menu so ordering on the evening is quick and easy.</p>
              <div className="menu-cta">
                <a className="btn solid" href={DINNER.menuPdf} target="_blank" rel="noreferrer">
                  View the menu (PDF)
                </a>
              </div>
            </div>
          </Section>

          <Section id="schedule">
            <p className="kicker">The evening</p>
            <h2 className="h2">How the evening flows</h2>
            <ol className="sched">
              {SCHEDULE.map((s, i) => (
                <li key={i}>
                  <span className="st">{s.t}</span>
                  <span className="sl">{s.label}{s.note && <span className="sn">{s.note}</span>}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="seating">
            <div className="banquet-wrap">
              <p className="kicker center">One long table</p>
              <h3 className="banquet-title">Fifteen of us, side by side</h3>
              <p className="banquet-note">Find your name, there's a tent card at your plate.</p>
              <div className="banquet">
                <div className="head-seat">
                  <span className="seat-no">Seat 1 · head of table</span>
                  <span className="seat-name">{HEAD}</span>
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

          <footer className="foot">
            <p className="foot-name">See you there</p>
            <p className="foot-line">With love, {HEAD}.</p>
            <a className="backlink" href="/">← Back to home</a>
          </footer>
        </>
      )}
    </div>
  );
}

export const Head = () => <title>Dinner · La Casa di Nico</title>;
