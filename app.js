const confettiCanvas = document.getElementById("confetti");
const starsCanvas = document.getElementById("stars");
const confettiCtx = confettiCanvas.getContext("2d");
const starsCtx = starsCanvas.getContext("2d");

let pieces = [];
let stars = [];

function resize() {
  confettiCanvas.width = innerWidth;
  confettiCanvas.height = innerHeight;
  starsCanvas.width = innerWidth;
  starsCanvas.height = innerHeight;
}

function makeStars() {
  stars = Array.from({ length: 90 }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.6,
    a: Math.random(),
    s: 0.003 + Math.random() * 0.01,
  }));
}

function burst(count = 90) {
  const colors = ["#ff8ec8", "#ffd37a", "#9aeadc", "#cbb2fe", "#fff"];
  for (let i = 0; i < count; i += 1) {
    pieces.push({
      x: Math.random() * confettiCanvas.width,
      y: -12,
      w: 6 + Math.random() * 6,
      h: 3 + Math.random() * 4,
      color: colors[i % colors.length],
      vx: -2.4 + Math.random() * 4.8,
      vy: 2 + Math.random() * 3.2,
      rot: Math.random() * Math.PI,
      vr: -0.12 + Math.random() * 0.24,
    });
  }
}

function draw() {
  starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
  stars.forEach((star) => {
    star.a += star.s;
    starsCtx.globalAlpha = 0.25 + Math.abs(Math.sin(star.a)) * 0.7;
    starsCtx.fillStyle = "#fff7e8";
    starsCtx.beginPath();
    starsCtx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    starsCtx.fill();
  });

  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  pieces.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rot);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    confettiCtx.restore();
  });
  pieces = pieces.filter((p) => p.y < confettiCanvas.height + 24);
  requestAnimationFrame(draw);
}

addEventListener("resize", () => {
  resize();
  makeStars();
});
resize();
makeStars();
burst(120);
draw();

const cake = document.getElementById("cake");
const hint = document.getElementById("cakeHint");
const wish = document.getElementById("wish");
let lit = true;

cake.addEventListener("click", () => {
  if (lit) {
    cake.classList.add("blown");
    hint.classList.add("is-hidden");
    wish.classList.remove("is-hidden");
    burst(160);
    lit = false;
  } else {
    cake.classList.remove("blown");
    hint.classList.remove("is-hidden");
    hint.textContent = "Можно зажечь снова и загадать ещё одно";
    wish.classList.add("is-hidden");
    lit = true;
  }
});

document.getElementById("confettiBtn").addEventListener("click", () => burst(110));

document.querySelectorAll(".gift").forEach((gift) => {
  gift.addEventListener("click", () => {
    gift.classList.add("open");
    gift.querySelector(".gift-box").textContent = "✨";
    gift.querySelector(".gift-label").innerHTML =
      `<strong>${gift.dataset.title}</strong><br />${gift.dataset.text}`;
    burst(40);
  });
});

document.querySelectorAll(".balloon").forEach((balloon) => {
  balloon.addEventListener("click", () => {
    if (balloon.classList.contains("popped")) return;
    balloon.classList.add("popped");
    balloon.textContent = balloon.dataset.word;
    burst(28);
  });
});

document.querySelectorAll(".flip").forEach((card) => {
  card.addEventListener("click", () => card.classList.toggle("is-flipped"));
});

const letter =
  "Ани,\n\nспасибо, что ты есть. Пусть впереди будет год, в котором тебе спокойно, интересно и очень счастливо.\n\nС днём рождения 💛";
const letterBox = document.getElementById("letter");
let typing = false;

document.getElementById("envelope").addEventListener("click", () => {
  if (typing) return;
  typing = true;
  letterBox.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    letterBox.textContent += letter[i];
    i += 1;
    if (i >= letter.length) clearInterval(timer);
  }, 26);
});
