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
  products: any = [];
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
          console.log(this.products);
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
      .approved((p: CdvPurchase.Transaction) => {
        // Handle the product deliverable
        if (
          p.products[0].id === this.premium_id ||
          p.products[0].id === this.premium_yearly_id
        ) {
          this.userService.updatePremiumStatus(true);
        }

        return p.verify();
      })
      .productUpdated((p: CdvPurchase.Product) => {
        this.userService.updatePremiumStatus(p.owned);
      })
      .verified((p: any) => p.finish())
      .unverified((p: any) => p.finish())
      .finished(() => {
        if (this.loader) {
          this.loader.dismiss();
        }
      });

    this.store.restorePurchases();
  }

  async startPurchase(flag: string) {
    let foundProduct;
    for (let i = 0; i < this.products.length; i++) {
      console.log(this.products);
      if (this.products[i].id == flag) {
        foundProduct = this.products[i];
        break;
      }
    }

    this.purchase(foundProduct);
  }

  async purchase(product: CdvPurchase.Product) {
    this.loader = await this.loadingCtrl.create({
      message: 'Loading...',
    });

    await this.loader.present();
    console.log(product);
    let offer = product.getOffer()!;
    if (offer) {
      this.store
        .order(offer)
        .then(
          (p) => {
            // Purchase in progress!
          },
          (e) => {
            this.loader.dismiss();
            this.presentAlert('Failed', `Failed to purchase: ${e}`);
          }
        )
        .finally(() => {
          this.loader.dismiss();
        });
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
