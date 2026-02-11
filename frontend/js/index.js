// ===============================
// CONFIG
// ===============================
const API = "http://127.0.0.1:8001";

// ===============================
// USER
// ===============================
function getUser() {
  const u = localStorage.getItem("bonsai_user");
  return u ? JSON.parse(u) : null;
}

// ===============================
// AUTH
// ===============================
async function handleCredentialResponse(response) {
  const res = await fetch(`${API}/api/auth/google/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: response.credential })
  });

  const data = await res.json();
  if (!data.success) throw new Error("Auth failed");

  localStorage.setItem("bonsai_user", JSON.stringify(data.user));
  renderUser(data.user);
}

// ===============================
// GAME STATE → BACKEND FORMAT
// ===============================
function buildSavePayload() {
  return {
    original_search_query: window.currentSearchQuery || "manual",

    search_results: window.searchResults || [],

    branches: window.tree.branches.map(b => ({
      start: b.start,
      end: b.end,
      length: b.length,
      maxLength: b.maxLength,
      angle: b.angle,
      thickness: b.thickness,
      generation: b.generation,
      isGrowing: b.isGrowing,
      growthSpeed: b.growthSpeed,
      nodeType: b.type,
      parentBranchId: b.parentId ?? null,
      searchResult: b.searchResult ?? null
    })),

    leaves: window.tree.leaves,
    fruits: window.tree.fruits,
    flowers: window.tree.flowers,
    flashcards: window.flashcards || [],

    camera_offset: {
      x: camera.offsetX,
      y: camera.offsetY
    }
  };
}

// ===============================
// SAVE GAME
// ===============================
async function saveGame() {
  const payload = buildSavePayload();

  const res = await fetch(`${API}/api/save-game-state`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!data.success) {
    console.error(data);
    alert("Save failed");
    return;
  }

  window.currentSessionId = data.session_id;
  setStatus("Saved 🌱");
}

// ===============================
// LOAD GAME
// ===============================
async function loadGame(sessionId) {
  const res = await fetch(`${API}/api/load-game-state`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId })
  });

  const data = await res.json();
  if (!data.success) {
    alert("Load failed");
    return;
  }

  restoreGameState(data.game_state);
}

// ===============================
// GAME SESSIONS LIST
// ===============================
async function fetchSessions() {
  const res = await fetch(`${API}/api/game-sessions`);
  const data = await res.json();
  return data.sessions || [];
}

// ===============================
// FLASHCARDS
// ===============================
async function createFlashcards(branchId) {
  const res = await fetch(`${API}/api/create-flashcards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ branch_id: branchId, count: 5 })
  });

  return await res.json();
}

// ===============================
// QUIZ
// ===============================
async function generateQuiz(flashcards) {
  const res = await fetch(`${API}/api/generate-quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ flashcards })
  });

  return await res.json();
}

// ===============================
// GROWTH
// ===============================
async function applyGrowth(sessionId, amount) {
  const user = getUser();

  const res = await fetch(
    `${API}/api/apply-growth?session_id=${sessionId}&growth_amount=${amount}&wallet_address=${user?.wallet_address || ""}`,
    { method: "POST" }
  );

  return await res.json();
}

// ===============================
// UI BINDINGS
// ===============================
function bindUI() {
  document.getElementById("saveBtn").onclick = saveGame;

  document.getElementById("loadBtn").onclick = async () => {
    const sessions = await fetchSessions();
    if (sessions.length) {
      loadGame(sessions[0].id); // latest
    }
  };
}

// ===============================
// INIT
// ===============================
window.onload = () => {
  bindUI();

  const saved = getUser();
  if (saved) renderUser(saved);

  google.accounts.id.initialize({
    client_id: "YOUR_GOOGLE_CLIENT_ID",
    callback: handleCredentialResponse
  });

  google.accounts.id.renderButton(
    document.getElementById("g_id_signin"),
    { theme: "outline", size: "medium" }
  );
};

window.checkAndMintByBranches = async function () {
    console.log("[MINT] checkAndMintByBranches called");

    if (!window.tree || !window.tree.branches) {
        console.warn("[MINT] Tree not ready");
        return;
    }

    const branchCount = window.tree.branches.length;
    console.log("[MINT] Branch count:", branchCount);

    const BRANCH_MINT_THRESHOLD = 8;

    if (window.tree.minted) {
        console.log("[MINT] Already minted");
        return;
    }

    if (branchCount < BRANCH_MINT_THRESHOLD) {
        console.log("[MINT] Threshold not reached");
        return;
    }

    const saved = localStorage.getItem("bonsai_user");
    if (!saved) {
        console.warn("[MINT] User not signed in");
        return;
    }

    const user = JSON.parse(saved);
    const topic = `Brain Bonsai – ${branchCount} Branches`;

    console.log("[MINT] Sending mint request…");

    const res = await fetch("http://127.0.0.1:8001/api/mint-now", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            wallet_address: user.wallet_address,
            topic
        })
    });

    const data = await res.json();

    if (data.success) {
        window.tree.minted = true;
        localStorage.setItem("bonsai_minted", "true");
        console.log("[MINT] ✅ Minted:", data.tx_hash);
        document.getElementById("status").innerText =
            "NFT minted 🎉 Check your wallet!";
    } else {
        console.error("[MINT] ❌ Mint failed:", data);
    }
};
