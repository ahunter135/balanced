import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AppIcon } from '@capacitor-community/app-icon';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.page.html',
  styleUrls: ['./themes.page.scss'],
})
export class ThemesPage implements OnInit {
  logos: Array<number> = [];
  activeIcon: number = 0;
  logoCount = 20;
  isAndroid = false;
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
    { value: '#FFD4DD', darkText: true },
  ];
  activeTheme: string;
  constructor(private platform: Platform) {}

  ngOnInit() {
    this.isAndroid = this.platform.is('android');
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

  shadeColor(color: string, amount: number): string {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt((R * (1 - amount)).toString());
    G = parseInt((G * (1 - amount)).toString());
    B = parseInt((B * (1 - amount)).toString());

    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;

    const RR =
      R.toString(16).length === 1 ? '0' + R.toString(16) : R.toString(16);
    const GG =
      G.toString(16).length === 1 ? '0' + G.toString(16) : G.toString(16);
    const BB =
      B.toString(16).length === 1 ? '0' + B.toString(16) : B.toString(16);

    return '#' + RR + GG + BB;
  }

  async chooseTheme(theme: any) {
    await Preferences.set({ key: 'theme', value: JSON.stringify(theme) });
    this.activeTheme = theme.value;
    const htmlEl = document.querySelector('html');
    if (htmlEl) {
      const shade = this.shadeColor(theme.value, 0.5);
      htmlEl.style.setProperty('--ion-color-primary', theme.value);
      htmlEl.style.setProperty('--ion-color-primary-shade', shade);
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
    const disable: string[] = ['logo' + this.activeIcon]; // all added aliaces names

    await AppIcon.change({
      name: iconName,
      suppressNotification: true,
      disable,
    });
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
    this.getName();
  };
}
