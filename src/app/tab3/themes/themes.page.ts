import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AppIcon } from '@capacitor-community/app-icon';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.page.html',
  styleUrls: ['./themes.page.scss'],
})
export class ThemesPage implements OnInit {
  logos: Array<number> = [];
  activeIcon: number = 0;
  logoCount = 19;
  themes = [
    { value: '#00eabb', darkText: false },
    { value: '#9aecc2', darkText: true },
    { value: '#ffc409', darkText: false },
    { value: '#222428', darkText: false },
    { value: '#ffb3ba', darkText: false },
    { value: '#4b3832', darkText: false },
    { value: '#ffeead', darkText: true },
    { value: '#ffaaa5', darkText: false },
    { value: '#8b9dc3', darkText: false },
    { value: '#666547', darkText: false },
    { value: '#b2d8d8', darkText: true },
    { value: '#004c4c', darkText: false },
    { value: '#dfe3ee', darkText: true },
    { value: '#fb2e01', darkText: false },
    { value: '#bae1ff', darkText: true },
    { value: '#be9b7b', darkText: false },
  ];
  activeTheme: string;
  constructor() {}

  ngOnInit() {
    for (let i = 0; i < this.logoCount; i++) {
      this.logos.push(i);
    }
    this.getTheme();
    this.getName();
  }

  async getTheme() {
    const currentTheme = await Preferences.get({ key: 'theme' });

    if (currentTheme.value) {
      this.activeTheme = JSON.parse(currentTheme.value).value;
    }
  }

  async chooseTheme(theme: any) {
    await Preferences.set({ key: 'theme', value: JSON.stringify(theme) });
    this.activeTheme = theme.value;
    const htmlEl = document.querySelector('html');
    if (htmlEl) {
      htmlEl.style.setProperty('--ion-color-primary', theme.value);
      htmlEl.style.setProperty(
        '--ion-color-primary-contrast',
        theme.darkText ? '#000000' : '#FFFFFF'
      );
    }
  }

  async chooseIcon(logo: number) {
    this.changeIcon('logo' + logo);
    this.activeIcon = logo;
  }

  changeIcon = async (iconName: string) => {
    await AppIcon.change({ name: iconName, suppressNotification: true });
  };

  getName = async () => {
    const { value } = await AppIcon.getName();
    if (value) {
      const numOnly = value.replace(/\D/g, '');
      this.activeIcon = parseInt(numOnly);
    }
  };

  resetIcon = async () => {
    const disable: string[] = ['logo' + this.activeIcon]; // all added aliaces names
    await AppIcon.reset({ suppressNotification: true, disable });
  };
}
