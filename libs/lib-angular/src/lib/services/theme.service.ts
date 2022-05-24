import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ThemeModel } from '../models/theme.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(@Inject(DOCUMENT) private readonly _document: Document) {}

  set theme(theme: ThemeModel) {
    this._document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    this._document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
    this._document.documentElement.style.setProperty('--primary-button-text-color', theme.primaryButtonTextColor);
    this._document.documentElement.style.setProperty(
      '--secondary-button-text-and-border-color',
      theme.secondaryButtonTextAndBorderColor
    );
    this._document.documentElement.style.setProperty('--link-color', theme.linkColor);

    this._document.documentElement.style.setProperty('--primary-color-shadow', theme.primaryColor + '80');
    this._document.documentElement.style.setProperty(
      '--secondary-button-color-shadow',
      theme.secondaryButtonTextAndBorderColor + '80'
    );
  }
}
