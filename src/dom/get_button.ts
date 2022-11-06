const getButton = (name: string) => (
  document.querySelector(`button[data-test="${name}"]`) as HTMLButtonElement
);

export default getButton;
