class Wallet {
  constructor(name) {
    this.name = name;
    this.addr = '0x' + crypto.randomUUID().replaceAll('-','').slice(0,40);
    this.balance = 1000;
  }
}

class WalletManager {
  save(w) { localStorage.setItem('wallet', JSON.stringify(w)); }
  load() { return JSON.parse(localStorage.getItem('wallet')); }
}

const walletManager = new WalletManager();
