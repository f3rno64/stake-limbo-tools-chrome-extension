const setInputValue = (input: HTMLInputElement, value: string | number) => {
  const event = new Event('input', {
    bubbles: true
  });

  input.value = `${value}`;
  input.dispatchEvent(event);
};

export default setInputValue;
