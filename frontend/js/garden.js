const canvas = document.getElementById("gardenCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let cloudOffset = 0;

// Added "leafPositions" to store static offsets for each tree's foliage
const trees = [
  { id: "ml", name: "Machine Learning", x: 300, y: canvas.height - 80, size: 70 },
  { id: "python", name: "Python", x: 650, y: canvas.height - 110, size: 85 },
  { id: "dsa", name: "DSA", x: 1000, y: canvas.height - 70, size: 75 }
];

function drawEnvironment() {
  // 1. Sun Glow (Static)
  ctx.fillStyle = "rgba(255, 230, 0, 0.1)";
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 100, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffde00";
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 100, 30, 0, Math.PI * 2);
  ctx.fill();

  // 2. Animated Clouds (Moving)
  cloudOffset += 0.3;
  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  for (let i = 0; i < 4; i++) {
    let cx = ((i * 500 + cloudOffset) % (canvas.width + 300)) - 150;
    ctx.beginPath();
    ctx.arc(cx, 120 + (i * 10), 35, 0, Math.PI * 2);
    ctx.arc(cx + 45, 120 + (i * 10), 50, 0, Math.PI * 2);
    ctx.arc(cx + 90, 120 + (i * 10), 35, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Pretty Layered Grass (Moving)
  ctx.fillStyle = "#064e3b"; 
  ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
  
  for (let i = 0; i < canvas.width; i += 5) {
    ctx.strokeStyle = i % 15 === 0 ? "#10b981" : "#059669";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(i, canvas.height - 40);
    const sway = Math.sin(cloudOffset * 0.05 + i) * 4; // Gentle grass sway
    ctx.lineTo(i + sway, canvas.height - 75);
    ctx.stroke();
  }
}

// Fixed static leaf clusters
function drawFoliage(x, y, seed) {
  const leafColors = ["#166534", "#15803d", "#22c55e"];
  // Use a simple deterministic loop based on the branch position 
  // so leaves stay in the same place every frame
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = leafColors[i % 3];
    ctx.beginPath();
    // Using fixed offsets instead of Math.random() inside the loop
    const ox = Math.sin(x + i) * 20; 
    const oy = Math.cos(y + i) * 20;
    ctx.arc(x + ox, y + oy, 14, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawDecoration(x, y, typeSeed) {
  if (typeSeed > 0.5) {
    // Static Apple
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.fillRect(x - 1, y - 11, 2, 4);
  } else {
    // Static Flower
    ctx.fillStyle = "#f472b6";
    for(let i=0; i<5; i++) {
        ctx.beginPath();
        ctx.arc(x + Math.cos(i) * 6, y + Math.sin(i) * 6, 5, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawTree(tree) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000"; 

  // Trunk
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.moveTo(tree.x, tree.y);
  ctx.lineTo(tree.x, tree.y - tree.size);
  ctx.stroke();

  // Deterministic Branching
  const drawBranch = (bx, by, len, angle, width) => {
    if (len < 18) {
      drawFoliage(bx, by);
      // Determine if apple or flower based on final position (static)
      const decoSeed = Math.abs(Math.sin(bx + by));
      if (decoSeed > 0.8) drawDecoration(bx, by, decoSeed % 1);
      return;
    };

    ctx.lineWidth = width;
    const nextX = bx + Math.cos(angle) * len;
    const nextY = by + Math.sin(angle) * len;

    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(nextX, nextY);
    ctx.stroke();

    drawBranch(nextX, nextY, len * 0.72, angle - 0.45, width * 0.7);
    drawBranch(nextX, nextY, len * 0.72, angle + 0.45, width * 0.7);
  };

  drawBranch(tree.x, tree.y - tree.size, tree.size * 0.8, -Math.PI/2 - 0.3, 12);
  drawBranch(tree.x, tree.y - tree.size, tree.size * 0.8, -Math.PI/2 + 0.3, 12);

  // Label
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 16px Inter";
  ctx.textAlign = "center";
  ctx.fillText(tree.name, tree.x, tree.y + 45);
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawEnvironment();
  trees.forEach(drawTree);
  requestAnimationFrame(animate);
}

// Initialization
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

animate();

// ===============================
// NEW TREE BUTTON HANDLER
// ===============================
const newTreeBtn = document.getElementById("newTreeBtn");

if (newTreeBtn) {
  newTreeBtn.addEventListener("click", () => {
    // Redirect to editor → new tree
    window.location.href = "/";
  });
}
