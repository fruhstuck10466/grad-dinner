import React from "react";

// Section wrapper, image fallback, and site styles.
// Used by both src/pages/index.js (landing) and src/pages/dinner.js.
// Sections render visible from first paint — no scroll animation, so nothing
// can get stuck invisible on any device.

export function Section({ id, children }) {
  return (
    <section id={id} className="sec">
      {children}
    </section>
  );
}

export const onImgErr = (e) => {
  e.currentTarget.style.display = "none";
  e.currentTarget.parentElement.classList.add("broken");
};

export const siteCss = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..500&family=Inter:wght@300;400;500;600;700&display=swap');

.wrap{
  --bg:#FFFFFF; --ink:#0F1A13; --muted:#5A665C;
  --green:#16E35B; --green2:#0BC94D; --accent:#0C8F3D;
  --panel:#F4F8F4; --panel2:#EDF3ED; --line:#E4EBE4;
  --display:'Fraunces',Georgia,serif; --body:'Inter',system-ui,sans-serif;
  background:var(--bg); color:var(--ink);
  font-family:var(--body); line-height:1.6;
  overflow-x:hidden; -webkit-font-smoothing:antialiased;
}
.wrap *{box-sizing:border-box}
a{color:inherit;text-decoration:none}

/* display headings share a family; sizes differ for hierarchy */
.grad-name,.h2,.banquet-title,.foot-name,.gate-title{
  font-family:var(--display);font-weight:500;color:var(--ink);margin:0;line-height:1.12;letter-spacing:-.01em;
}
.grad-name{font-size:clamp(48px,9vw,94px);letter-spacing:-.025em}
.h2{font-size:clamp(29px,4.6vw,44px)}
.banquet-title{font-size:clamp(23px,3.4vw,31px)}
.gate-title{font-size:clamp(27px,4vw,35px)}
.foot-name{font-size:clamp(25px,3.4vw,33px)}

.nav{
  position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;
  padding:16px clamp(20px,5vw,64px);
  background:rgba(255,255,255,.82);backdrop-filter:blur(10px);
  border-bottom:1px solid var(--line);
}
.mark{font-family:var(--display);font-weight:600;letter-spacing:.14em;color:var(--accent);font-size:16px}
.navlinks{display:flex;gap:clamp(14px,3vw,34px);font-size:13.5px;color:var(--muted)}
.navlinks a{transition:color .2s}
.navlinks a:hover{color:var(--accent)}

.hero{
  min-height:90vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;padding:80px clamp(20px,5vw,40px) 64px;
  background:
    radial-gradient(120% 80% at 50% -12%, rgba(22,227,92,.22), transparent 60%),
    radial-gradient(60% 44% at 12% 108%, rgba(22,227,92,.12), transparent 55%),
    radial-gradient(60% 44% at 88% 110%, rgba(22,227,92,.12), transparent 55%);
}
.badge{display:inline-block;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);
  border:1.5px solid rgba(22,227,92,.5);border-radius:999px;padding:8px 18px;background:rgba(22,227,92,.07);margin:0 0 26px}
.flourish{width:70px;height:4px;border-radius:4px;background:linear-gradient(90deg,var(--green),var(--green2));margin:22px auto 0}
.degree{font-family:var(--display);font-style:italic;color:var(--ink);font-size:clamp(16px,2.4vw,21px);margin:18px 0 0}
.school{color:var(--muted);font-size:13.5px;letter-spacing:.02em;margin:8px 0 0}
.hero-intro{max-width:580px;color:var(--muted);font-size:16px;margin:22px auto 0;font-weight:300}
.hero-meta{
  display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:center;
  margin:26px 0 32px;font-size:13px;letter-spacing:.04em;color:var(--ink)
}
.hero-meta i{width:4px;height:4px;border-radius:50%;background:var(--green);display:inline-block}

.btn{display:inline-block;cursor:pointer;font-family:var(--body);font-size:13px;font-weight:600;
  text-transform:uppercase;letter-spacing:.06em;border-radius:999px;
  transition:transform .18s, box-shadow .2s, background .2s, filter .2s;border:none}
.btn.ghost{padding:13px 26px;border:1.5px solid var(--green);color:var(--ink);background:transparent}
.btn.ghost:hover{background:rgba(22,227,92,.12);transform:translateY(-2px)}
.btn.solid{padding:13px 26px;background:var(--green);color:#04240F;box-shadow:0 6px 20px rgba(22,227,92,.35)}
.btn.solid:hover:not(:disabled){filter:brightness(1.06);transform:translateY(-2px);box-shadow:0 10px 28px rgba(22,227,92,.45)}
.btn.solid:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}

.sec{
  max-width:1000px;margin:0 auto;padding:clamp(70px,10vw,120px) clamp(20px,5vw,40px);
}
.kicker{font-size:11.5px;letter-spacing:.26em;text-transform:uppercase;color:var(--accent);margin:0 0 12px}
.kicker.center{text-align:center}
.h2{margin:0 0 6px}
.lead{max-width:600px;color:var(--muted);font-weight:300;margin:14px 0 0;font-size:16px}

.photo{position:relative}
.photo.broken::after{content:"📷  " attr(data-label);position:absolute;inset:0;display:flex;
  align-items:center;justify-content:center;color:var(--muted);font-size:12px;letter-spacing:.08em}

/* wide feature photo (restaurant, venue, etc.) */
.feature-photo{margin:30px 0 0;aspect-ratio:16/9;border-radius:18px;overflow:hidden;
  background:linear-gradient(135deg,var(--panel2),var(--panel));border:1px solid var(--line);
  box-shadow:0 16px 40px rgba(15,26,19,.06)}
.feature-photo img{width:100%;height:100%;object-fit:cover;display:block}

/* journey */
.journey{list-style:none;margin:40px 0 0;padding:0}
.journey li{display:grid;grid-template-columns:132px 1fr;gap:26px;align-items:center;
  padding:24px 0;border-top:1px solid var(--line)}
.journey li:last-child{border-bottom:1px solid var(--line)}
.jimg{width:132px;height:132px;border-radius:14px;overflow:hidden;
  background:linear-gradient(135deg,var(--panel2),var(--panel));border:1px solid var(--line)}
.jimg img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .25s}
.jimg img:hover{transform:scale(1.05)}
.jyear{font-family:var(--display);font-weight:600;color:var(--accent);font-size:17px}
.jtext h3{font-family:var(--display);margin:4px 0 6px;font-size:21px;font-weight:500;color:var(--ink)}
.jtext p{margin:0;color:var(--muted);font-weight:300;font-size:15px}

/* details rows */
.details{background:var(--panel);border-radius:16px;padding:26px;border:1px solid var(--line);box-shadow:0 10px 30px rgba(15,26,19,.05)}
.dt{padding:12px 0;border-bottom:1px dashed var(--line)}
.dt:last-child{border-bottom:none}
.dt-k{display:block;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);margin-bottom:3px}
.dt-v{font-size:15px}

/* banquet */
.banquet-wrap{margin:8px 0 0}
.banquet-title{text-align:center;margin:6px 0 0}
.banquet-note{text-align:center;color:var(--muted);font-weight:300;font-size:14px;margin:8px 0 0}
.banquet{margin:34px 0 0}
.head-seat{max-width:250px;margin:0 auto 14px;text-align:center;background:var(--green);color:#04240F;
  border-radius:14px;padding:16px 18px;box-shadow:0 10px 26px rgba(22,227,92,.32)}
.head-seat .seat-no{display:block;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;opacity:.8}
.head-seat .seat-name{display:block;font-family:var(--display);font-size:23px;font-weight:600;margin:2px 0 0}
.head-seat .seat-role{display:block;font-size:12px;font-style:italic;opacity:.85}
.banquet-body{display:grid;grid-template-columns:1fr 46px 1fr;gap:18px;align-items:stretch}
.side{display:flex;flex-direction:column;gap:12px}
.side.left{align-items:flex-end}
.side.right{align-items:flex-start}
.table-strip{border-radius:16px;border:1px solid rgba(22,227,92,.32);
  background:linear-gradient(180deg,rgba(22,227,92,.16),rgba(22,227,92,.05))}
.tent{width:min(230px,100%);background:var(--panel);border:1px solid var(--line);
  border-radius:12px;padding:13px 15px;position:relative;transition:transform .18s,border-color .18s,box-shadow .18s}
.tent::before{content:"";position:absolute;top:0;left:16px;right:16px;height:3px;
  background:var(--green);border-radius:0 0 3px 3px;opacity:.6}
.tent:hover{transform:translateY(-2px);border-color:var(--green);box-shadow:0 8px 18px rgba(22,227,92,.16)}
.tent.r{text-align:right}
.tent .seat-no{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent)}
.tent .seat-name{display:block;font-family:var(--display);font-size:17px;font-weight:500;margin-top:2px}

/* advice composer */
.composer{background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:26px;margin:34px 0 0;box-shadow:0 10px 30px rgba(15,26,19,.05)}
.afield{margin:0 0 20px}
.afield-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:8px}
.afield-label{font-family:var(--display);font-size:19px;font-weight:500}
.starter{display:block;width:100%;text-align:left;cursor:pointer;font-family:var(--display);font-style:italic;
  color:var(--muted);background:#fff;border:1px dashed rgba(22,227,92,.5);
  border-radius:10px;padding:10px 14px;font-size:15px;margin-bottom:9px;transition:all .16s}
.starter:hover{color:var(--ink);border-color:var(--green);background:rgba(22,227,92,.06)}
.ta{width:100%;font-family:var(--body);font-size:15px;color:var(--ink);background:#fff;
  border:1px solid var(--line);border-radius:12px;padding:12px 14px;resize:vertical}
.ta:focus{outline:none;border-color:var(--green)}
.ta::placeholder{color:#9aa89e}
.copy{cursor:pointer;font-family:var(--body);font-size:11.5px;padding:6px 12px;border-radius:999px;
  background:transparent;color:var(--ink);border:1px solid rgba(22,227,92,.55);transition:all .18s;white-space:nowrap}
.copy:hover{background:rgba(22,227,92,.12)}
.composer-foot{display:flex;gap:12px;margin:6px 0 0;align-items:center;justify-content:space-between;flex-wrap:wrap}
.tiny{font-size:12px;color:var(--muted)}

.filter-row{display:flex;flex-wrap:wrap;gap:8px;margin:40px 0 20px}
.fbtn{cursor:pointer;font-family:var(--body);font-size:12.5px;padding:7px 14px;border-radius:999px;background:transparent;color:var(--muted);border:1px solid var(--line)}
.fbtn.on{color:var(--accent);border-color:var(--green)}
.empty{color:var(--muted);font-style:italic;padding:30px 0}

.wall{columns:3;column-gap:16px}
.note{break-inside:avoid;margin:0 0 16px;background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:20px;box-shadow:0 6px 18px rgba(15,26,19,.04)}
.note-tag{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent)}
.note blockquote{margin:10px 0 12px;font-family:var(--display);font-size:18px;line-height:1.45;font-style:italic;color:var(--ink)}
.note figcaption{color:var(--muted);font-size:13px;font-style:italic}

/* gift */
.gift{max-width:440px;margin:36px 0 0;background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:28px;position:relative;box-shadow:0 10px 30px rgba(15,26,19,.05)}
.gift-badge{position:absolute;top:-11px;left:24px;background:var(--green);color:#04240F;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;padding:5px 12px;border-radius:999px}
.gift-row{display:flex;align-items:baseline;gap:12px;padding:16px 0}
.gift-k{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);flex:1}
.gift-v{font-family:var(--display);font-size:24px;font-weight:500;letter-spacing:.01em}
.gift-name{margin:6px 0 0;color:var(--muted);font-size:13px;font-style:italic}
.gift-alt{max-width:440px;margin:16px 0 0;font-size:14.5px;color:var(--muted);line-height:1.6}
.gift-alt a{color:var(--accent);text-decoration:underline}

/* schedule */
.sched{list-style:none;margin:26px 0 0;padding:0}
.sched li{display:grid;grid-template-columns:100px 1fr;gap:18px;padding:16px 0;border-top:1px solid var(--line)}
.sched li:last-child{border-bottom:1px solid var(--line)}
.sched .st{font-family:var(--display);font-weight:600;color:var(--accent);font-size:15px}
.sched .sl{font-size:16px;font-weight:500}
.sched .sn{display:block;color:var(--muted);font-weight:300;font-size:13.5px;margin-top:2px}

/* callouts + menu cta */
.callout{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:22px 24px;margin:24px 0 0}
.callout.green{background:rgba(22,227,92,.08);border-color:rgba(22,227,92,.3)}
.callout .ct{font-weight:700;text-transform:uppercase;letter-spacing:.05em;font-size:11.5px;color:var(--accent);margin:0 0 8px}
.callout p{margin:0;color:var(--ink);font-size:15px;line-height:1.6}
.menu-cta{margin:16px 0 0}

/* password gate */
.gate{min-height:80vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;padding:40px 24px;max-width:480px;margin:0 auto;
  background:radial-gradient(120% 70% at 50% 0%, rgba(22,227,92,.16), transparent 60%)}
.lock-badge{font-size:30px;margin-bottom:6px}
.gate p{color:var(--muted);font-size:15px;margin:10px 0 22px;max-width:360px}
.gate-row{display:flex;gap:10px;width:100%;max-width:360px}
.gate input{flex:1;font-family:var(--body);font-size:15px;color:var(--ink);background:#fff;
  border:1px solid var(--line);border-radius:12px;padding:13px 15px}
.gate input:focus{outline:none;border-color:var(--green)}
.gate .err{color:#c0392b;font-size:13px;margin-top:14px}

/* footer + backlink */
.foot{text-align:center;padding:84px 20px;border-top:1px solid var(--line);margin-top:40px;
  background:radial-gradient(120% 160% at 50% 130%, rgba(22,227,92,.24), transparent 62%)}
.foot-name{margin:0}
.foot-line{color:var(--muted);font-weight:300;margin:12px 0 0}
.backlink{display:inline-block;margin:22px 0 0;font-size:13px;color:var(--accent);
  border-bottom:1px solid rgba(22,227,92,.4);padding-bottom:2px}

/* lightbox */
.lightbox{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;
  padding:24px;background:rgba(8,20,12,.86);backdrop-filter:blur(4px);cursor:zoom-out;animation:lbfade .18s ease}
@keyframes lbfade{from{opacity:0}to{opacity:1}}
.lb-fig{margin:0;max-width:min(920px,92vw);cursor:default}
.lb-fig img{width:100%;max-height:80vh;object-fit:contain;border-radius:12px;display:block;box-shadow:0 20px 60px rgba(0,0,0,.5)}
.lb-fig figcaption{color:#EDF3ED;text-align:center;margin:14px 0 0;font-size:14px;font-family:var(--display)}
.lb-fig figcaption b{color:var(--green)}
.lb-close{position:absolute;top:20px;right:24px;width:42px;height:42px;border-radius:50%;
  background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.25);font-size:16px;cursor:pointer;transition:background .18s}
.lb-close:hover{background:rgba(255,255,255,.22)}

@media(max-width:760px){
  .navlinks{display:none}
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
  .btn,.tent,.jimg img{transition:none}
}
`;
