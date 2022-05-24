import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { AppNavigationContainerComponent } from './app-navigation-container.component';
import { AppNavigationContainerModule } from './app-navigation-container.module';

export default {
  title: 'App navigation container',
  component: AppNavigationContainerComponent,
  decorators: [
    moduleMetadata({
      imports: [AppNavigationContainerModule],
    }),
  ],
  argTypes: {
    navigationExpanded: {
      description: 'Expand the left navigation',
      control: {
        type: 'boolean',
      },
    },
    navigationItems: {
      description: 'Navigation items',
    },
    navigationBarContent: {
      description: 'Navigation bar content',
    },
  },
  args: {
    navigationExpanded: true,
    navigationItems: [
      { label: 'Product backlog', iconClass: 'fa-solid fa-clipboard-list', routerLink: ['#'] },
      { label: 'Sprint backlog', iconClass: 'fa-solid fa-list-check', routerLink: ['#'] },
      { label: 'Team', iconClass: 'fa-solid fa-user', routerLink: ['#'] },
      { label: 'Sprint backlog', iconClass: 'fa-solid fa-chart-line', routerLink: ['#'] },
    ],
    navigationBarContent: 'Navigation bar content',
    appContent: 'Application content',
  },
} as Meta;

export const Default: Story = (args) => ({
  props: args,
  navigationExpanded: false,
  template: `
    <app-navigation-container
      [(navigationExpanded)]="navigationExpanded"
      [navigationItems]="navigationItems"
    >
     <ng-container navigationBarContent>${args['navigationBarContent']}</ng-container>
     <ng-container appContent>${args['appContent']}</ng-container>
    </app-navigation-container>
  `,
});
