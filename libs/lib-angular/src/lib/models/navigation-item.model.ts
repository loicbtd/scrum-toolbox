export class NavigationItemModel {
  label?: string;

  iconClass?: string;

  routerLink?: string[] = ['#'];

  separatorAbove? = false;

  action: () => void = () => null;

  public constructor(attributes?: Partial<NavigationItemModel>) {
    Object.assign(this, attributes);
  }
}
