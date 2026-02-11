(function(){
const API_BASE_URL = (() => {
    const origin = window.location.origin || "";
    const isLocalHost = /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(origin);
    if (!origin || origin === "null" || origin.startsWith("file:")) {
        return "http://localhost:8001";
    }
    return isLocalHost ? "http://localhost:8001" : "";
})();
// expose globally for other frontend modules
window.API_BASE_URL = API_BASE_URL;

window.mintCredential = async function() {
    const saved = localStorage.getItem('bonsai_user');
    if (!saved) return alert('Please sign in before minting.');
    const user = JSON.parse(saved);

    // Prefer current session id if available
    let gardenId = window.game && window.game.currentSessionId ? window.game.currentSessionId : null;

    if (!gardenId) {
        gardenId = prompt('Enter your Garden ID to mint (you can use demo IDs from /api/debug/gardens):');
        if (!gardenId) return;
    }

    try {
        showMintOverlay();

        const res = await fetch(`${API_BASE_URL}/api/mint-credential/${encodeURIComponent(gardenId)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await res.json();
        if (!res.ok) {
            console.error('Mint failed:', data);
            hideMintOverlay();
            return alert('Minting failed: ' + (data.detail || data.error || JSON.stringify(data)));
        }

        // If backend returned tx_hash, show it
        if (data.credential && data.credential.tx_hash) {
            const tx = data.credential.tx_hash;
            alert('Mint successful! Tx: ' + tx);
        } else if (data.credential && data.credential.name) {
            // success with metadata
            setTimeout(() => {
                // open NFTs modal after animation
                if (typeof openNftModal === 'function') openNftModal();
            }, 1400);
        }

    } catch (err) {
        console.error('Mint exception:', err);
        alert('Minting request failed. See console for details.');
    } finally {
        // hide overlay after a short delay to allow animation
        setTimeout(hideMintOverlay, 4200);
    }
};

function showMintOverlay() {
    const overlay = document.getElementById('mintOverlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
}

function hideMintOverlay() {
    const overlay = document.getElementById('mintOverlay');
    if (!overlay) return;
    overlay.style.display = 'none';
}

})();

// More visually pleasing mint animation used for automatic mints
window.showBeautifulMintAnimation = function() {
    const overlay = document.getElementById('mintOverlay');
    if (!overlay) return;
    overlay.style.display = 'flex';

    // Add a transient particle canvas
    let canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.pointerEvents = 'none';
    overlay.appendChild(canvas);
    canvas.width = overlay.clientWidth;
    canvas.height = overlay.clientHeight;
    const ctx = canvas.getContext('2d');

    const particles = [];
    for (let i=0;i<36;i++) {
        particles.push({
            x: canvas.width/2 + (Math.random()-0.5)*80,
            y: canvas.height/2 + 30 + (Math.random()-0.5)*40,
            vx: (Math.random()-0.5)*6,
            vy: -6 - Math.random()*6,
            life: 80 + Math.random()*40,
            size: 6 + Math.random()*6,
            hue: 160 + Math.random()*60
        });
    }

    let t = 0;
    const raf = () => {
        t++;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.35; p.life -= 1;
            ctx.beginPath();
            ctx.fillStyle = `hsl(${p.hue} 70% 60% / ${Math.max(0, p.life/120)})`;
            ctx.shadowColor = `hsl(${p.hue} 70% 60%)`;
            ctx.shadowBlur = 12;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
            ctx.fill();
        });
        if (t < 160) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Keep overlay for animation duration, then cleanup
    setTimeout(() => {
        overlay.style.display = 'none';
        if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
        if (typeof openNftModal === 'function') openNftModal();
    }, 3800);
};

// Mint directly to a wallet without garden/session
window.mintNow = async function(wallet_address, topic) {
    if (!wallet_address) return null;
    try {
        showMintOverlay();
        const res = await fetch(`${window.API_BASE_URL}/api/mint-now`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wallet_address, topic })
        });
        const data = await res.json();
        if (res.ok) {
            // play beautiful animation
            if (window.showBeautifulMintAnimation) window.showBeautifulMintAnimation();
            return data;
        } else {
            console.error('mint-now failed', data);
            hideMintOverlay();
            return null;
        }
    } catch (e) {
        console.error('mintNow error', e);
        hideMintOverlay();
        return null;
    }
};
