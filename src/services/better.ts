import _reverse from 'lodash/reverse';
import _isEmpty from 'lodash/isEmpty';
import _isFinite from 'lodash/isFinite';
import _debounce from 'lodash/debounce';
import { STAKE_INPUTS, STAKE_BUTTONS } from '../constants';
import { HistoricalBet } from '../types';
import { playBeep } from '../util';
import {
  getInput, getButton, setInputValue, clickButton, watchElementAttribute,
  getPastBets
} from '../dom';

let isHuntingMultiplier = false;
let stopHuntCallback = () => {};
let huntEndCallbacks = [] as Function[];
let huntBets = [] as HistoricalBet[];

// TODO: Refactor this
let debouncedOnPastBetsUpdated = () => {};

const betConfig = {
  amount: 0,
  multiplier: 0
}

const setBetConfig = (config) => {
  const { amount, multiplier } = config;

  if (_isFinite(amount)) {
    betConfig.amount = amount;
  }

  if (_isFinite(multiplier)) {
    betConfig.multiplier = multiplier;
  }
}

const bet = () => {
  const { amount, multiplier } = betConfig;

  const inputMultiplier = getInput(STAKE_INPUTS.MULTIPLIER);
  const buttonBet = getButton(STAKE_BUTTONS.BET);
  const inputBet = getInput(STAKE_INPUTS.BET);

  if (!inputMultiplier || !buttonBet || !inputBet) {
    throw new Error('cannot bet, inputs/button missing');
  }

  setInputValue(inputMultiplier, multiplier);
  setInputValue(inputBet, amount);
  clickButton(buttonBet);
};

// The bet button is disabled on bet, and re-enabled on result
const watchBetButtonDisabled = (callback) => {
  const et = new EventTarget();
  const buttonBet = getButton(STAKE_BUTTONS.BET);

  if (!buttonBet) {
    throw new Error('bet button not found');
  }

  const observer = watchElementAttribute(buttonBet, 'disabled', (disabled) => {
    const isDisabled = typeof disabled === 'string';

    et.dispatchEvent(new CustomEvent('change', { detail: isDisabled }));
  });

  const listener = (e: CustomEventInit) => {
    const { detail: isDisabled } = e;

    callback(isDisabled);
  };

  et.addEventListener('change', listener);

  const disconnect = () => {
    et.removeEventListener('change', listener);
    observer.disconnect();
  };

  return disconnect;
};

const betForMultiplierHunt = () => {
  betConfig.amount = 0;
  betConfig.multiplier = 1.01;

  bet();
};

const startMultiplierHunt = ({
  huntMultiplier, huntStreakLength, huntMinOccurences
}) => {
  if (isHuntingMultiplier) {
    throw new Error('already hunting multiplier');
  } else {
    isHuntingMultiplier = true;
  }

  huntBets = [];

  // TODO: Is there a better way?
  const pastBetsContainer = document.querySelector('.past-bets');

  if (!pastBetsContainer) {
    throw new Error('past bets container element missing from dom');
  }

  const onPastBetsUpdated = () => {
    huntBets = getPastBets(betConfig.amount);

    if (_isEmpty(huntBets)) {
      return;
    }

    const streakBets = huntBets.slice(0, huntStreakLength);
    const huntSuccessStreakBets = streakBets.filter(({ multiplier }) => (
      multiplier >= huntMultiplier
    ));

    const minOccurencesFulfilled = (
      huntSuccessStreakBets.length >= huntMinOccurences
    );

    if (minOccurencesFulfilled) {
      stopMultiplierHunt();
      playBeep();
    } else {
      betForMultiplierHunt();
    }
  };

  debouncedOnPastBetsUpdated = _debounce(onPastBetsUpdated, 50);

  // Called for all past bet elements, as per stake react render
  pastBetsContainer.addEventListener(
    'DOMNodeInserted', debouncedOnPastBetsUpdated
  );

  betForMultiplierHunt();
};

const stopMultiplierHunt = () => {
  if (!isHuntingMultiplier) {
    throw new Error('not hunting multiplier');
  }

  // TODO: Refactor this
  const pastBetsContainer = document.querySelector('.past-bets');

  if (!pastBetsContainer) {
    throw new Error('past bets container element missing from dom');
  }

  pastBetsContainer.removeEventListener(
    'DOMNodeInserted', debouncedOnPastBetsUpdated
  );

  isHuntingMultiplier = false;
  stopHuntCallback();

  huntEndCallbacks.forEach((cb) => cb(_reverse(huntBets)));
};

const getIsHuntingMultiplier = () => isHuntingMultiplier;

const registerHuntEndCallback = (cb) => {
  huntEndCallbacks.push(cb);
};

export {
  registerHuntEndCallback,
  getIsHuntingMultiplier,
  startMultiplierHunt,
  stopMultiplierHunt,
  setBetConfig,
  bet
};
