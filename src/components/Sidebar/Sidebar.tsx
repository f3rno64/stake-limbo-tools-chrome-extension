import { useState, useCallback, FormEvent } from 'react';
import _isEmpty from 'lodash/isEmpty';
import _reverse from 'lodash/reverse';
import _defer from 'lodash/defer';
import _noop from 'lodash/noop';

import Label from '../Label';
import Input from '../Input';
import Button from '../Button';

import { changeSeed } from '../../util';
import {
  bet,
  setBetConfig,
  setRepeatHunt,
  startMultiplierHunt,
  stopMultiplierHunt,
  setHuntEndCallback
} from '../../services/better';

import S from './Sidebar.module.scss';

const Sidebar = () => {
  const [huntMultiplier, setHuntMultiplier] = useState<string>('1');
  const [huntStreakLength, setHuntStreakLength] = useState<string>('5');
  const [huntMinOccurences, setHuntMinOccurences] = useState<string>('1');
  const [isHuntingMultiplier, setIsHuntingMultiplier] = useState<boolean>(false);

  const onStartHuntMultiplier = useCallback(() => {
    setHuntEndCallback((_, repeat) => {
      setIsHuntingMultiplier(false);

      setBetConfig({
        multiplier: 2,
        amount: 0.000001
      });

      bet();

      if (repeat) {
        _defer(() => onStartHuntMultiplier());
      }
    });

    setRepeatHunt(true);
    setIsHuntingMultiplier(true);

    startMultiplierHunt({
      huntMultiplier: +huntMultiplier,
      huntStreakLength: +huntStreakLength,
      huntMinOccurences: +huntMinOccurences
    });
  }, [huntMultiplier, huntStreakLength, huntMinOccurences]);

  const onStopHuntMultiplier = () => {
    setIsHuntingMultiplier(false);
    setRepeatHunt(false);
    stopMultiplierHunt();
  };

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
    </div>
  );
};

export default Sidebar;
