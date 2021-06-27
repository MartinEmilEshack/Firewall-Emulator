import * as React from 'react';
import { Renderer } from 'src/controllers/Renderer';
import { TabPages } from './TabPages';

export const Application: React.FC = () => {
	Renderer.send('global-data-setter');
	return <TabPages />;
};
