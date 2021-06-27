import * as React from 'react';
import { render } from 'react-dom';
import { Application } from 'src/components/Application';
import 'assets/css/app.css';

render(<Application />, document.getElementById('root') as HTMLElement);
