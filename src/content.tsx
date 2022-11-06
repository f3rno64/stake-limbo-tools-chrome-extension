import React from 'react';

import Sidebar from './components/Sidebar';
import { createAndAppendRoot } from './util';

const root = createAndAppendRoot();

root.render(
  <React.StrictMode>
    <Sidebar />
  </React.StrictMode>
);

export default {};
