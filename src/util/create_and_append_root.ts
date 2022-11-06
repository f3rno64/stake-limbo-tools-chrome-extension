import { createRoot } from 'react-dom/client';

const createAndAppendRoot = () => {
  const body = document.querySelector('body');

  if (!body) {
    throw new Error('body not found');
  }

  const rootElm = document.createElement('div');

  body.appendChild(rootElm);

  return createRoot(rootElm);
};

export default createAndAppendRoot;
