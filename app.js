
alert("JS loaded");
// ========= Simple screen router (show/hide sections) =========
const screens = {
  landing: document.getElementById("screen-landing"),
  main: document.getElementById("screen-main"),
  note: document.getElementById("screen-love-note"),
  gifts: document.getElementById("screen-gifts"),
  valentine: document.getElementById("screen-valentine"),
  thanks: document.getElementById("screen-thanks"),
};

const pages = {
  story: document.getElementById("page-story"),
  moments: document.getElementById("page-moments"),
};

function showScreen(name){
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}

function showPage(pageName){
  Object.values(pages).forEach(p => p.classList.remove("active"));
  pages[pageName].classList.add("active");

  document.querySelectorAll("[data-nav]").forEach(a => {
    a.classList.toggle("active", a.getAttribute("data-nav") === pageName);
  });
getElementById("landing heart").forEach

// ========= Landing -> Main =========
document.getElementById("landingHeart").addEventListener("click", () => {
  showScreen("main");
  location.hash = "#story";
  showPage("story");
});

// ========= Navbar links =========
function handleHash(){
  const h = (location.hash || "#story").replace("#", "").toLowerCase();
  if (h === "moments") showPage("moments");
  else showPage("story");
}
window.addEventListener("hashchange", handleHash);
handleHash();

// ========= Navbar heart -> Love Note =========
document.getElementById("navHeart").addEventListener("click", () => {
  showScreen("note");
});

// Back from note -> main
document.getElementById("backToMain").addEventListener("click", () => {
  showScreen("main");
});

// Note heart -> gifts
document.getElementById("toGifts").addEventListener("click", () => {
  showScreen("gifts");
});

// Back gifts -> note
document.getElementById("backToNote").addEventListener("click", () => {
  showScreen("note");
});

// ========= Gifts logic (must select all 5) + confetti pop =========
const giftBoxes = Array.from(document.querySelectorAll(".gift-box"));
const submitGifts = document.getElementById("submitGifts");

function updateSubmit(){
  const selectedCount = giftBoxes.filter(b => b.classList.contains("selected")).length;
  submitGifts.disabled = selectedCount !== giftBoxes.length;
}

giftBoxes.forEach(box => {
  box.addEventListener("click", () => {
    // open animation
    box.classList.add("open");

    // toggle selection
    box.classList.toggle("selected");

    // pop confetti when selecting (only when becoming selected)
    if (box.classList.contains("selected")) burstConfetti();

    updateSubmit();
  });
});
updateSubmit();

submitGifts.addEventListener("click", () => {
  showScreen("valentine");
  prepareNoButtonEvasion();
});

// ========= Valentine No button runs away =========
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const statusLine = document.getElementById("statusLine");

function rand(min, max){ return Math.random() * (max - min) + min; }

function prepareNoButtonEvasion(){
  // reset position each time we enter
  noBtn.style.position = "relative";
  noBtn.style.left = "0px";
  noBtn.style.top = "0px";
  statusLine.textContent = "";
}

function moveNoAway(){
  const dx = rand(-140, 140);
  const dy = rand(-90, 90);
  noBtn.style.left = `${dx}px`;
  noBtn.style.top = `${dy}px`;
}

noBtn.addEventListener("mouseenter", moveNoAway);
noBtn.addEventListener("click", moveNoAway);

// ========= YES: show thanks + (optional) notify admin =========
yesBtn.addEventListener("click", async () => {
  statusLine.textContent = "Sending your answer… 💗";

  // ---- OPTIONAL ADMIN NOTIFY ----
  // Replace ADMIN_WEBHOOK_URL with a real endpoint if you want notifications.
  // Examples: Formspree, Web3Forms, Firebase, your PHP endpoint, etc.
  const ADMIN_WEBHOOK_URL = ""; // <-- leave blank for now

  try{
    if (ADMIN_WEBHOOK_URL){
      await fetch(ADMIN_WEBHOOK_URL, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          event: "VALENTINE_YES",
          name: "Ginny",
          time: new Date().toISOString()
        })
      });
    }
    statusLine.textContent = "";
  }catch(e){
    // even if notify fails, we still continue
    statusLine.textContent = "Sent 💗";
  }

  showScreen("thanks");
});

// Restart
document.getElementById("restart").addEventListener("click", () => {
  // Reset everything
  giftBoxes.forEach(b => b.classList.remove("open", "selected"));
  updateSubmit();
  showScreen("landing");
  location.hash = "";
});

// ========= Confetti (simple canvas) =========
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let confettiParticles = [];
let confettiRunning = false;

function resizeCanvas(){
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function burstConfetti(){
  const count = 110;
  for (let i=0; i<count; i++){
    confettiParticles.push({
      x: window.innerWidth/2 + rand(-120, 120),
      y: window.innerHeight/2 + rand(-80, 80),
      vx: rand(-4.5, 4.5),
      vy: rand(-7.5, -1.5),
      g: rand(0.10, 0.22),
      r: rand(2.5, 5.5),
      life: rand(45, 85),
      rot: rand(0, Math.PI*2),
      vr: rand(-0.2, 0.2),
      // random bright-ish color
      color: `hsl(${Math.floor(rand(0,360))} 90% 60%)`
    });
  }
  if (!confettiRunning){
    confettiRunning = true;
    requestAnimationFrame(tickConfetti);
  }
}

function tickConfetti(){
  ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

  confettiParticles.forEach(p => {
    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life -= 1;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.r, -p.r, p.r*2.2, p.r*1.1);
    ctx.restore();
  });

  confettiParticles = confettiParticles.filter(p => p.life > 0 && p.y < window.innerHeight + 80);

  if (confettiParticles.length > 0){
    requestAnimationFrame(tickConfetti);
  }else{
    confettiRunning = false;
    ctx.clearRect(0,0,window.innerWidth, window.innerHeight);
  }
}
