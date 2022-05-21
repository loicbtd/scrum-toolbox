import { Meta, Story } from '@storybook/angular';

import { MenuItem, NavigationComponent } from './navigation';

export default {
  title: 'Navigation',
  component: NavigationComponent,
  argTypes: {
    leftNavigationExpanded: {
      description: 'Expand/collapse the left navigation',
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
} as Meta;

export const Default: Story = (args) => ({
  props: {
    ...args,
    leftNavigationItems: [
      { label: 'Product backlog', iconClass: 'fa-solid fa-clipboard-list', routerLink: '#' },
      { label: 'Sprint backlog', iconClass: 'fa-solid fa-list-check', routerLink: '#' },
      { label: 'Team', iconClass: 'fa-solid fa-user', routerLink: '#' },
      { label: 'Sprint backlog', iconClass: 'fa-solid fa-chart-line', routerLink: '#' },
    ] as MenuItem[],
  },
});
