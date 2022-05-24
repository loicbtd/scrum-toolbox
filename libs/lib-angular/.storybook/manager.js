import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    colorPrimary: '#1a2752',
    colorSecondary: '#4a5ea1',
    brandTitle: `${require('../../../package.json')
      .name.split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ')} Storybook ${require('../../../package.json').version}`,
  }),
});
