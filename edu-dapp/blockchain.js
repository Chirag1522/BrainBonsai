class Transaction {
  constructor(from, to, amount, gasPrice) {
    this.hash = '0x' + crypto.randomUUID().replaceAll('-','');
    this.amount = amount;
    this.gas = (21000 * gasPrice) / 1e9;
    this.block = null;
  }
}

class Blockchain {
  constructor() {
    this.block = 1;
    this.txs = [];
  }

  add(tx) {
    tx.block = this.block;
    this.txs.push(tx);
    if (this.txs.length % 4 === 0) this.block++;
  }

  all() {
    return this.txs;
  }
}

const blockchain = new Blockchain();
