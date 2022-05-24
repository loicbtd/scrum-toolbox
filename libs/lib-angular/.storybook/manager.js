import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    colorPrimary: '#575e6a',
    colorSecondary: '#007bc0',
    brandTitle: 'Scrum Toolbox UI Library',
    brandImage: 'https://upload.wikimedia.org/wikipedia/fr/b/be/Utbm.svg',
  }),
  a11y: {
    disable: true,
  },
  
});
