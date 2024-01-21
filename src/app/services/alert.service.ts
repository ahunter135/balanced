import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(
    private toast: ToastController,
  ) {}

  async createAndShowToast(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 550,
    });

    toast.present();
  }

}
