import Promise from 'bluebird';
import getFairnessButton from '../dom/get_fairness_button';
import getChangeSeedButton from '../dom/get_change_seed_button';
import getCloseModalButton from '../dom/get_close_modal_button';

const changeSeed = () => {
  return new Promise((resolve, reject) => {
    const fairnessButton = getFairnessButton() as HTMLButtonElement;

    if (!fairnessButton) {
      reject(new Error('fairness button not found'));
      return;
    }

    fairnessButton.click();

    // TODO: Get accurate timeout; waits for modal to open
    setTimeout(() => {
      const changeSeedButton = getChangeSeedButton() as HTMLButtonElement;
      const closeModalButton = getCloseModalButton() as HTMLButtonElement;

      if (!changeSeedButton || !closeModalButton) {
        reject(new Error('modal buttons not found'));
        return;
      }

      changeSeedButton.click();
      closeModalButton.click();

      resolve();
    }, 1000)
  });
};

export default changeSeed;
