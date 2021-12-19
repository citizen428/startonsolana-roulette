import * as web3 from "@solana/web3.js";

function web3Connection() {
  const network = "http://127.0.0.1:8899";
  return new web3.Connection(network, "confirmed")
}

async function airdropSOL(publicKey, amount) {
  const connection = web3Connection();
  try {
    const fromAirDropSignature = await connection.requestAirdrop(
      publicKey,
      amount * web3.LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(fromAirDropSignature);
  } catch (err) {
    console.log(err);
  }
}

async function getWalletBalance(publicKey) {
  try {
    const walletBalance = await web3Connection().getBalance(publicKey);
    return walletBalance / web3.LAMPORTS_PER_SOL;
  } catch (err) {
    console.log(err);
  }
}

async function transferSOL(from, to, transferAmt) {
  const connection = web3Connection();
  try {
    const transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to.publicKey,
        lamports: transferAmt * web3.LAMPORTS_PER_SOL
      })
    );

    const signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [from]
    )

    return signature;
  } catch (err) {
    console.log(err);
  }
}

export { airdropSOL, getWalletBalance, transferSOL };
