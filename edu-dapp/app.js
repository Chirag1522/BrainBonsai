class App {
  constructor() {
    this.wallet = walletManager.load();
    this.gas = 50;
    if (this.wallet) this.render();
  }

  go(id) {
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (id === 'ledger') this.renderLedger();
  }

  start() { this.go('wallet'); }

  createWallet() {
    const n = nameInput.value.trim();
    if (!n) return alert('Enter name');
    this.wallet = new Wallet(n);
    walletManager.save(this.wallet);
    this.render();
  }

  render() {
    wName.textContent = this.wallet.name;
    wAddr.textContent = this.wallet.addr;
    wBal.textContent = this.wallet.balance;
    this.go('dashboard');
  }

  setGas(g, btn) {
    this.gas = g;
    document.querySelectorAll('.gas button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    this.updateFee();
  }

  updateFee() {
    const fee = (21000 * this.gas) / 1e9;
    feeInfo.textContent = `Gas fee: ${fee.toFixed(6)} BON`;
    return fee;
  }

  review() {
    this.to = toAddr.value;
    this.amount = +amount.value;
    const fee = this.updateFee();
    if (this.wallet.balance < this.amount + fee) return alert('Low balance');
    confirmBox.innerHTML = `
      Send ${this.amount} BON<br>
      Gas: ${fee.toFixed(6)} BON
    `;
    this.go('confirm');
  }

  async execute() {
    await this.animateJourney();

    const tx = new Transaction(this.wallet.addr, this.to, this.amount, this.gas);
    blockchain.add(tx);
    this.wallet.balance -= this.amount + tx.gas;
    walletManager.save(this.wallet);

    receiptBox.innerHTML = `
      Hash: ${tx.hash}<br>
      Block: ${tx.block}<br>
      Gas paid: ${tx.gas.toFixed(6)} BON
    `;

    this.render();
    this.go('receipt');
  }

  async animateJourney() {
    journey.classList.remove('hidden');
    const nodes = document.querySelectorAll('.node');
    for (let i=0;i<nodes.length;i++) {
      nodes.forEach(n=>n.classList.remove('active'));
      nodes[i].classList.add('active');
      await new Promise(r=>setTimeout(r,700));
    }
    journey.classList.add('hidden');
  }

  renderLedger() {
    ledgerBody.innerHTML='';
    blockchain.all().forEach(tx=>{
      ledgerBody.innerHTML+=`
        <tr>
          <td>${tx.block}</td>
          <td>${tx.hash.slice(0,10)}…</td>
          <td>${tx.amount}</td>
          <td>${tx.gas.toFixed(6)}</td>
        </tr>`;
    });
  }
}

const app = new App();
