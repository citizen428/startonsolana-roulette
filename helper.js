import chalk from 'chalk';
import figlet from "figlet";

function banner() {
  console.log(chalk.green(figlet.textSync('Much roulette, so wow\n')));
  console.log(chalk.yellow('The max bidding amount is 2 SOL\n\n'));
};

function getReturnAmount(amount, ratio) {
  return amount * ratio;
}

function randomNumber(max) {
  return Math.floor(Math.random() * max + 1)
}

export { banner, getReturnAmount, randomNumber };
