import { Injectable } from '@angular/core';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import 'cordova-plugin-purchase';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class InAppPurchaseService {
  premium_id;
  premium_yearly_id;
  products: any;
  store: CdvPurchase.Store;

  loader: any;
  constructor(
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private userService: UserService,
    private alertCtrl: AlertController
  ) {
    this.premium_yearly_id = this.platform.is('ios')
      ? 'premium_yearly'
      : 'premium_yearly';
    this.premium_id = this.platform.is('ios') ? 'premium_sub' : 'premium_sub';

    this.platform.ready().then(() => {
      if (this.platform.is('mobile')) {
        this.store = CdvPurchase.store;

        this.registerProducts();

        this.setupListeners();

        this.store.initialize([
          this.platform.is('ios')
            ? CdvPurchase.Platform.APPLE_APPSTORE
            : CdvPurchase.Platform.GOOGLE_PLAY,
        ]);
        this.store.ready(() => {
          this.products = this.store.products;
        });
      } else if (this.platform.is('desktop')) {
        // Eventually will want to add stripe as a web purchase
      }
    });
  }

  registerProducts() {
    this.store.register([
      {
        type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
        id: this.premium_id,
        platform: this.platform.is('ios')
          ? CdvPurchase.Platform.APPLE_APPSTORE
          : CdvPurchase.Platform.GOOGLE_PLAY,
      },
      {
        type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
        id: this.premium_yearly_id,
        platform: this.platform.is('ios')
          ? CdvPurchase.Platform.APPLE_APPSTORE
          : CdvPurchase.Platform.GOOGLE_PLAY,
      },
    ]);
  }

  setupListeners() {
    this.store
      .when()
      .approved((p: any) => {
        // Handle the product deliverable
        if (p.id === this.premium_id || p.id === this.premium_yearly_id) {
          this.userService.updatePremiumStatus(p.owned);
        }

        return p.verify();
      })
      .verified((p: any) => p.finish())
      .finished(() => {
        if (this.loader) {
          this.loader.dismiss();
        }
      });
  }

  async startPurchase(flag: string) {
    console.log(this.products);
    for (let i = 0; i < this.products.length; i++) {}
  }

  async purchase(product: CdvPurchase.Product) {
    this.loader = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 12000,
    });

    await this.loader.present();
    let offer = product.getOffer()!;
    if (offer) {
      this.store.order(offer).then(
        (p) => {
          // Purchase in progress!
        },
        (e) => {
          this.loader.dismiss();
          this.presentAlert('Failed', `Failed to purchase: ${e}`);
        }
      );
    }
  }

  restore() {
    this.store.restorePurchases();
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
