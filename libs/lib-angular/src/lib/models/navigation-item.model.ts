export interface NavigationItemInterface {
  label?: string;

  iconClass?: string;

  routerLink?: string[];

  separatorAbove?: boolean;

  action?: () => void | Promise<void>;
}
