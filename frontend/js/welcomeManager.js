/**
 * WelcomeManager controls the onboarding animation and seed selection workflow.
 * Polished blockchain-only experience 🌱
 */
class WelcomeManager {
    constructor(game, searchManager) {
        this.game = game;
        this.searchManager = searchManager;
        this.animationFrameId = null;
        this.promptElement = null;
        this.resetState();
    }

    resetState() {
        this.state = {
            isActive: false,
            hasShownPrompt: false,
            originalPanY: 0,
            targetPanY: 0
        };
    }

    startSequence() {
        this.cancelAnimation();
        this.removePrompt();

        this.state.isActive = true;
        this.state.hasShownPrompt = false;
        this.state.originalPanY = this.game.cameraOffset.y;
        this.state.targetPanY = -this.game.height * 0.6;

        this.animateTo(this.state.targetPanY, () => this.showSeedSelection());
    }

    async handleSeedSelect(seed) {
        this.removePrompt();

        // Animate camera back
        this.state.targetPanY = this.state.originalPanY;
        this.animateBackToOrigin();

        if (!seed) return;

        // Existing growth logic remains untouched
        const results = await this.searchManager.fetchInitialResults(seed);
        if (results.length > 0) {
            this.game.triggerFirstGrowth();
        }
        // Plant seed on backend to create a garden and persist session id
        try {
            const apiBase = window.API_BASE_URL || (window.location.origin && /localhost|127\.0\.0\.1/.test(window.location.origin) ? 'http://localhost:8001' : '');

            // Map UI seed labels to backend Web3Seed enum values
            const seedMap = {
                'Blockchain Fundamentals': 'Blockchain Fundamentals',
                'Smart Contracts (Solidity)': 'Smart Contracts',
                'Smart Contracts': 'Smart Contracts',
                'DeFi Protocols': 'DeFi Basics',
                'DeFi Basics': 'DeFi Basics',
                'Ethereum & EVM': 'Blockchain Fundamentals',
                'Web3 Security': 'Web3 Security',
                'NFTs & Token Standards': 'NFTs & Digital Ownership',
                'NFTs & Digital Ownership': 'NFTs & Digital Ownership'
            };

            const mapped = seedMap[seed] || seed;

            const res = await fetch(`${apiBase}/api/plant-seed`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ seed: { value: mapped } })
            });

            const data = await res.json();
            if (res.ok && data.success && data.garden) {
                // set current session id so minting is automatic
                this.game.currentSessionId = data.garden.id;
                try { localStorage.setItem('bonsai_garden', JSON.stringify(data.garden)); } catch(e){}
                this.game.updateStatus(`Planted '${mapped}' — Garden #${data.garden.id}`);
                // Also log the maturity immediately upon successful planting
        console.log(`%c[Brain Bonsai] Seed Planted: ${mapped}`, "color: #00d2ff; font-weight: bold;");
            } else {
                console.warn('plant-seed failed', data);
            }
        } catch (err) {
            console.warn('Error planting seed:', err);
        }
    }

    reset() {
        this.cancelAnimation();
        this.removePrompt();
        this.resetState();
    }

    animateTo(targetY, onComplete) {
        if (!this.state.isActive) return;

        const currentY = this.game.cameraOffset.y;
        const diff = targetY - currentY;

        if (Math.abs(diff) > 1) {
            this.game.cameraOffset.y += diff * 0.05;
            this.animationFrameId = requestAnimationFrame(() =>
                this.animateTo(targetY, onComplete)
            );
        } else {
            this.game.cameraOffset.y = targetY;
            if (typeof onComplete === 'function') onComplete();
        }
    }

    animateBackToOrigin() {
        const currentY = this.game.cameraOffset.y;
        const diff = this.state.targetPanY - currentY;

        if (Math.abs(diff) > 1) {
            this.game.cameraOffset.y += diff * 0.05;
            this.animationFrameId = requestAnimationFrame(() =>
                this.animateBackToOrigin()
            );
        } else {
            this.game.cameraOffset.y = this.state.targetPanY;
            this.state.isActive = false;
        }
    }

    showSeedSelection() {
        if (this.state.hasShownPrompt) return;
        this.state.hasShownPrompt = true;

        const prompt = document.createElement('div');
        prompt.id = 'welcomePrompt';
        prompt.innerHTML = `
            <div class="welcome-prompt-content elegant">
                <h2>Plant Your Web3 Seed 🌱</h2>
                <p class="subtitle">
                    Every seed grows into verifiable on-chain knowledge.
                </p>

                <div class="seed-grid">
                    <button class="seed-card" data-seed="Blockchain Fundamentals">
                        <span class="seed-title">Blockchain Fundamentals</span>
                        <span class="seed-desc">Blocks, consensus, decentralization</span>
                    </button>

                    <button class="seed-card" data-seed="Smart Contracts (Solidity)">
                        <span class="seed-title">Smart Contracts</span>
                        <span class="seed-desc">Solidity, EVM execution</span>
                    </button>

                    <button class="seed-card" data-seed="DeFi Protocols">
                        <span class="seed-title">DeFi Protocols</span>
                        <span class="seed-desc">AMMs, lending, yield</span>
                    </button>

                    <button class="seed-card" data-seed="Ethereum & EVM">
                        <span class="seed-title">Ethereum & EVM</span>
                        <span class="seed-desc">Gas, opcodes, tooling</span>
                    </button>

                    <button class="seed-card" data-seed="Web3 Security">
                        <span class="seed-title">Web3 Security</span>
                        <span class="seed-desc">Audits, exploits, safety</span>
                    </button>

                    <button class="seed-card" data-seed="NFTs & Token Standards">
                        <span class="seed-title">NFTs & Tokens</span>
                        <span class="seed-desc">ERC-20, ERC-721, ERC-1155</span>
                    </button>
                </div>
            </div>
        `;

        const container = this.game.canvas.parentElement;
        container.appendChild(prompt);
        this.promptElement = prompt;

        const buttons = prompt.querySelectorAll('.seed-card');
        buttons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const seed = btn.getAttribute('data-seed');
                await this.handleSeedSelect(seed);
            });
        });
    }

    removePrompt() {
        if (this.promptElement) {
            this.promptElement.remove();
            this.promptElement = null;
        }
    }

    cancelAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}
