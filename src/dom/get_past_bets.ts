import { HistoricalBet } from '../types';

const getPastBets = (lastBetAmount: number): HistoricalBet[] => (([
  ...document.querySelectorAll('.past-bets button')
] as HTMLElement[]).map((e: HTMLElement, index: number) => {
  const multiplier = +e.innerText.slice(0, -1);
  const won = e.classList.contains('variant-success');

  return {
    amount: index === 0 ? lastBetAmount : 0,
    multiplier,
    won
  };
}));

export default getPastBets;
