const BEEP_LENGTH_MS = 100;

const playBeep = () => {
  const context = new AudioContext();
  const o = context.createOscillator();

  o.type = 'sine';
  o.frequency.value = 880;

  o.connect(context.destination);
  o.start();

  setTimeout(() => {
    o.stop();
  }, BEEP_LENGTH_MS);
}

export default playBeep;
