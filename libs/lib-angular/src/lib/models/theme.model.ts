export class ThemeModel {
  applicationLogoSource: string;

  primaryColor: string;

  secondaryColor: string;

  primaryButtonTextColor: string;

  secondaryButtonTextAndBorderColor: string;

  linkColor: string;

  public constructor(attributes?: Partial<ThemeModel>) {
    Object.assign(this, attributes);
  }
}
