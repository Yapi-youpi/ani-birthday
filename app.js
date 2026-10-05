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

function burst(count = 90, originX, originY) {
  const colors = ["#ff8ec8", "#ffd37a", "#9aeadc", "#cbb2fe", "#fff"];
  const fromX = originX ?? Math.random() * confettiCanvas.width;
  const fromY = originY ?? -12;
  const explode = originX !== undefined;
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = explode ? 2 + Math.random() * 6 : 2 + Math.random() * 3.2;
    pieces.push({
      x: explode ? fromX : Math.random() * confettiCanvas.width,
      y: fromY,
      w: 6 + Math.random() * 6,
      h: 3 + Math.random() * 4,
      color: colors[i % colors.length],
      vx: explode ? Math.cos(angle) * speed : -2.4 + Math.random() * 4.8,
      vy: explode ? Math.sin(angle) * speed : speed,
      rot: Math.random() * Math.PI,
      vr: -0.12 + Math.random() * 0.24,
    });
  }
}

function fireworks() {
  [0.2, 0.5, 0.78].forEach((part, i) => {
    setTimeout(() => {
      burst(70, innerWidth * part, innerHeight * (0.22 + Math.random() * 0.2));
    }, i * 220);
  });
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
    p.vy += 0.04;
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

const heartMarks = ["💛", "💗", "✨", "🤍"];
document.addEventListener("click", (event) => {
  const heart = document.createElement("span");
  heart.className = "float-heart";
  heart.textContent = heartMarks[Math.floor(Math.random() * heartMarks.length)];
  heart.style.left = `${event.clientX - 10}px`;
  heart.style.top = `${event.clientY - 12}px`;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 950);
});

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
    fireworks();
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
document.getElementById("fireworksBtn").addEventListener("click", fireworks);

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

const wishes = [
  "Пусть рядом будут свои люди.",
  "Пусть работа приносит лёгкость, а не только дедлайны.",
  "Пусть путешествие случится просто так.",
  "Пусть тело будет здоровым, а сон — глубоким.",
  "Пусть сбудется то, о чём пока шепчешь только себе.",
  "Пусть этот год запомнится смехом.",
];
const wheel = document.getElementById("wheelDisk");
const spinText = document.getElementById("spinText");
let spinning = false;
let wheelAngle = 0;

document.getElementById("spinBtn").addEventListener("click", () => {
  if (spinning) return;
  spinning = true;
  const index = Math.floor(Math.random() * wishes.length);
  wheelAngle += 360 * 5 + index * (360 / wishes.length);
  wheel.style.transform = `rotate(${wheelAngle}deg)`;
  spinText.textContent = "Крутится...";
  setTimeout(() => {
    spinText.textContent = wishes[index];
    burst(60);
    spinning = false;
  }, 2400);
});

const vase = document.getElementById("vase");
const bouquetWish = document.getElementById("bouquetWish");
const picked = [];

document.querySelectorAll(".flower").forEach((flower) => {
  flower.addEventListener("click", () => {
    if (flower.classList.contains("picked")) return;
    flower.classList.add("picked");
    picked.push(flower.dataset.flower);
    vase.textContent = `🏺 ${picked.join(" ")}`;
    if (picked.length === 5) {
      bouquetWish.textContent = "Букет собран. Аня, пусть в жизни будет так же ярко.";
      burst(90);
    }
  });
});

document.querySelectorAll(".flip").forEach((card) => {
  card.addEventListener("click", () => card.classList.toggle("is-flipped"));
});

const letter =
  "Аня,\n\nспасибо, что ты есть. Пусть впереди будет год, в котором тебе спокойно, интересно и очень счастливо.\n\nС днём рождения 💛";
const letterBox = document.getElementById("letterPaper");
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
