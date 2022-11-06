const getInput = (name: string) => (
  document.querySelector(`input[data-test="${name}"]`) as HTMLInputElement
);

export default getInput;
