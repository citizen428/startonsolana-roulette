import * as web3 from "@solana/web3.js";
import chalk from 'chalk';
import inquirer from 'inquirer';

import { airdropSOL, getWalletBalance, transferSOL } from './solana.js';
import { banner, getReturnAmount, randomNumber } from './helper.js'

const userWallet = web3.Keypair.generate();
const treasuryWallet = web3.Keypair.generate();

await airdropSOL(userWallet.publicKey, 5);
await airdropSOL(treasuryWallet.publicKey, 10);

async function gameExecution() {
  banner();

  let playerBalance = await getWalletBalance(userWallet.publicKey);
  console.log(chalk.yellow(`Your balance: ${playerBalance} SOL`))
  const prompt = await inquirer.prompt([
    {
      type: 'input',
      name: 'amount',
      message: 'What is the amount of SOL you want to stake?'
    },
    {
      type: 'input',
      name: 'ratio',
      message: 'What is the ratio of your staking?'
    }
  ]);

  console.log("\n");
  const formattedAmt = `${chalk.green(prompt['amount'])} SOL`;
  console.log(`You need to pay ${formattedAmt} to move forward.`);
  const returnAmt = getReturnAmount(prompt['amount'], prompt['ratio']);
  console.log(chalk.green(`You will get ${returnAmt} if you guess the correct number.`));
  console.log("\n");

  const guessPrompt = await inquirer.prompt({
    type: 'input',
    name: 'guess',
    message: 'Guess a random number between 1 and 5 (end inclusive)'
  });

  const signature = await transferSOL(userWallet, treasuryWallet, prompt['amount']);
  console.log(`Signature of payment for playing: ${signature}`);

  if (guessPrompt['guess'] == randomNumber(5)) {
    console.log('You guessed correctly!');
    const priceSig = await transferSOL(treasuryWallet, userWallet, returnAmt);
    console.log(`Signature of price payment: ${priceSig}`);
  } else {
    console.log('Better luck next time');
  }

  playerBalance = await getWalletBalance(userWallet.publicKey);
  console.log(chalk.yellow(`Your balance: ${playerBalance} SOL`))
}

gameExecution();
