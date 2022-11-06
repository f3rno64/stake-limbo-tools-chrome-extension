import watchElementAttributeCallback from './callback';

const watchElementAttribute = (
  e: HTMLElement,
  attribute: string,
  onChange: (value: string | null) => void
) => {
  const observer = new MutationObserver(
    watchElementAttributeCallback.bind(null, attribute, () => {
      onChange(e.getAttribute(attribute));
    })
  );

  observer.observe(e, { attributes: true });

  return observer;
};

export default watchElementAttribute;
