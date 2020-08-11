const Arweave = require('arweave/node');

const arweave = Arweave.init({
  // host: 'perma.online', // ARCA Community Gateway
  host: 'arweave.net', // Arweave Gateway
  port: 443,
  protocol: 'https',
  timeout: 600000,
});

exports.getAddressForWallet = async (wallet) => {
  return arweave.wallets.jwkToAddress(wallet);
};

exports.generateWallet = async () => {
  const walletPrivateKey = await arweave.wallets.generate();
  const walletPublicKey = await this.getAddressForWallet(walletPrivateKey);
  return { walletPrivateKey, walletPublicKey };
};
