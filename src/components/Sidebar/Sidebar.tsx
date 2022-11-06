import { useState, useCallback, FormEvent } from 'react';
import _isEmpty from 'lodash/isEmpty';
import _reverse from 'lodash/reverse';
import _noop from 'lodash/noop';
import _sum from 'lodash/sum';

import Label from '../Label';
import Input from '../Input';
import Button from '../Button';

import { changeSeed } from '../../util';
import { HistoricalBet } from '../../types';
import {
  startMultiplierHunt,
  stopMultiplierHunt,
  registerHuntEndCallback
} from '../../services/better';

import S from './Sidebar.module.scss';

const Sidebar = () => {
  const [huntBets, setHuntBets] = useState<HistoricalBet[]>([]);
  const [huntMultiplier, setHuntMultiplier] = useState<string>('1');
  const [huntMinOccurences, setHuntMinOccurences] = useState<string>('1');
  const [huntStreakLength, setHuntStreakLength] = useState<string>('5');
  const [isHuntingMultiplier, setIsHuntingMultiplier] = useState<boolean>(false);

  const onStartHuntMultiplier = useCallback(() => {
    registerHuntEndCallback((bets) => {
      setIsHuntingMultiplier(false);
      setHuntBets(bets);
    });

    setIsHuntingMultiplier(true);

    startMultiplierHunt({
      huntMultiplier: +huntMultiplier,
      huntStreakLength: +huntStreakLength,
      huntMinOccurences: +huntMinOccurences
    });
  }, [huntMultiplier, huntStreakLength, huntMinOccurences]);

  const onStopHuntMultiplier = () => {
    setIsHuntingMultiplier(false);
    stopMultiplierHunt();
  };

  const huntBetSpreads = huntBets
    .map(({ multiplier }, index) => (
      multiplier < +huntMultiplier
        ? -1
        : huntBets
          .slice(index + 1)
          .findIndex(({ multiplier: m }) => m > +huntMultiplier)
    ))
    .map(s => s === -1 ? -1 : s + 1)
    .filter(s => s !== -1);

  const avgHuntBetSpread = _isEmpty(huntBetSpreads)
    ? 0
    : _sum(huntBetSpreads) / huntBetSpreads.length;

  return (
    <div className={S.slb_sidebar}>
      <Label>Hunt Multiplier</Label>
      <Input
        type='text'
        value={huntMultiplier}
        onChange={(e: FormEvent<HTMLInputElement>) => (
          setHuntMultiplier(e.currentTarget.value)
        )}
      />

      <Label>Hunt Streak Min Occurences</Label>
      <Input
        type='text'
        value={huntMinOccurences}
        onChange={(e: FormEvent<HTMLInputElement>) => (
          setHuntMinOccurences(e.currentTarget.value)
        )}
      />

      <Label>Hunt Streak Length</Label>
      <Input
        type='text'
        value={huntStreakLength}
        onChange={(e: FormEvent<HTMLInputElement>) => (
          setHuntStreakLength(e.currentTarget.value)
        )}
      />

      <Button
        onClick={isHuntingMultiplier
          ? onStopHuntMultiplier
          : onStartHuntMultiplier
        }
      >{isHuntingMultiplier ? 'Stop Hunt' : 'Start Hunt'}</Button>

      <Button onClick={changeSeed}>Change Seed</Button>

      <div>
        <div>
          <p>Target multipliers spread</p>
          <p>{Math.ceil(avgHuntBetSpread)}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
