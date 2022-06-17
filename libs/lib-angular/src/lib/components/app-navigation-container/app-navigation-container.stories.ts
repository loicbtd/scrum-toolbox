import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { NavigationItemInterface } from '../../models/navigation-item.model';
import { AppNavigationContainerComponent, AppNavigationContainerModule } from './app-navigation-container.component';

export default {
  title: 'App navigation container',
  component: AppNavigationContainerComponent,
  decorators: [
    moduleMetadata({
      imports: [AppNavigationContainerModule],
    }),
  ],
  argTypes: {
    desktopNavigationExpanded: {
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    desktopNavigationExpanded: true,
    navigationItems: [
      { label: 'Lorem ipsum', iconClass: 'fa-solid fa-clipboard-list', routerLink: ['#'] },
      { label: 'Lorem ipsum dolor sit amet, consectetur', iconClass: 'fa-solid fa-list-check', routerLink: ['#'] },
      { label: 'mco laboris nisi', iconClass: 'fa-solid fa-user', routerLink: ['#'] },
      { label: 'mco laboris nisi ut aliquip ex ea ', iconClass: 'fa-solid fa-chart-line', routerLink: ['#'] },
    ] as NavigationItemInterface[],
    avatarNavigationItems: [
      { label: 'Lorem ipsum', iconClass: 'fa-solid fa-clipboard-list', routerLink: ['#'] },
      { label: 'Lorem ipsum dolor sit amet, consectetur', iconClass: 'fa-solid fa-list-check', routerLink: ['#'] },
      { label: 'mco laboris nisi', iconClass: 'fa-solid fa-user', routerLink: ['#'] },
      { label: 'mco laboris nisi ut aliquip ex ea ', iconClass: 'fa-solid fa-chart-line', routerLink: ['#'] },
    ] as NavigationItemInterface[],
    navigationBarContent: 'Navigation bar content',
    appContent: 'Application content',
    logoImageSource: 'https://cdn.pixabay.com/photo/2018/08/18/13/27/browser-3614768_960_720.png',
    avatarImageSource: 'https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png',
    username: 'Firstname LASTNAME',
  },
} as Meta;

export const Default: Story = (args) => {
  return {
    props: { ...args },
    desktopNavigationExpanded: false,
    template: `
    <app-navigation-container
      [(desktopNavigationExpanded)]="desktopNavigationExpanded"
      [navigationItems]="navigationItems"
      [avatarNavigationItems]="avatarNavigationItems"
      [logoImageSource]="logoImageSource"
      [avatarImageSource]="avatarImageSource"
      [username]="username"
    >
     <ng-container navigationBarContent>${args['navigationBarContent']}</ng-container>
     <ng-container>${args['appContent']}</ng-container>
    </app-navigation-container>
  `,
  };
};
