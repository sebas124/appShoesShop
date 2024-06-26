import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { orderBy } from 'firebase/firestore';
import { Order } from 'src/app/models/order.model';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.models'
import { CartService } from 'src/app/services/cart.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {

  @Input() order: Order;
  userOrder: User | null = null;
  productOrder1: Product | null = null;
  productOrder2: Product | null = null;
  productOrder3: Product | null = null;
  productOrder4: Product | null = null;
  productOrder5: Product | null = null;
  loading: boolean = false;
  constructor(private CartService: CartService) { }

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  user = {} as User;

  // =================== Formulario a enviar ==============
  formOrder = new FormGroup({
    id: new FormControl(''),
    idUser: new FormControl(''),
    status: new FormControl(''),
    priceTotal: new FormControl(''),
    idProduct1: new FormControl(''),
    quantity1: new FormControl(''),
    priceUni1: new FormControl(''),
    idProduct2: new FormControl(''),
    quantity2: new FormControl(''),
    priceUni2: new FormControl(''),
    idProduct3: new FormControl(''),
    quantity3: new FormControl(''),
    priceUni3: new FormControl(''),
    idProduct4: new FormControl(''),
    quantity4: new FormControl(''),
    priceUni4: new FormControl(''),
    idProduct5: new FormControl(''),
    quantity5: new FormControl(''),
    priceUni5: new FormControl(''),
    userOrder: new FormControl('')
  });

  async ngOnInit() {

    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.user = this.utilsSvc.getFormLocalStorage('user');
    if (this.order)
      this.formOrder.setValue(this.order);

    // Consultar info del usuario relacionado al pedido
    this.getUserInfo(this.formOrder.controls.idUser.value);

    // Consultar info del producto relacionado al pedido
    this.getProductInfo1(this.formOrder.controls.idProduct1.value);
    this.getProductInfo2(this.formOrder.controls.idProduct2.value);
    this.getProductInfo3(this.formOrder.controls.idProduct3.value);
    this.getProductInfo4(this.formOrder.controls.idProduct4.value);
    this.getProductInfo5(this.formOrder.controls.idProduct5.value);

    loading.dismiss();
  }

  getTotalOrder(priceUni: string, quantity: string) {
    return this.CartService.getTotalOrder(priceUni, quantity);
  }

  async getUserInfo(uid: string = '') {
    if (uid) {
      let path = `user/${uid}`;

      this.firebaseSvc.getDocument(path).then((user: User) => {
        this.userOrder = user;
      }).catch(error => {
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
      });
    }
  }

  // ============ Obtener Productos ==============
  getProductInfo1(idProduct: string = '') {
    if (idProduct) {
      //let path = `user/${this.user().uid}/products`
      let path = `user/caGOmbCPEcbdBSBbjhKG8FgfHDO2/products/${idProduct}`

      this.loading = true;

      this.firebaseSvc.getDocument(path).then((product: Product) => {
        this.productOrder1 = product;
      }).catch(error => {
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
      });
    }
  }

  getProductInfo2(idProduct: string = '') {
    if (idProduct) {
      let path = `user/caGOmbCPEcbdBSBbjhKG8FgfHDO2/products/${idProduct}`

      this.loading = true;

      this.firebaseSvc.getDocument(path).then((product: Product) => {
        this.productOrder2 = product;
      }).catch(error => {
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
      });
    }
  }
  getProductInfo3(idProduct: string = '') {
    if (idProduct) {
      let path = `user/caGOmbCPEcbdBSBbjhKG8FgfHDO2/products/${idProduct}`

      this.loading = true;

      this.firebaseSvc.getDocument(path).then((product: Product) => {
        this.productOrder3 = product;
      }).catch(error => {
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
      });
    }
  }

  getProductInfo4(idProduct: string = '') {
    if (idProduct) {
      let path = `user/caGOmbCPEcbdBSBbjhKG8FgfHDO2/products/${idProduct}`

      this.loading = true;

      this.firebaseSvc.getDocument(path).then((product: Product) => {
        this.productOrder4 = product;
      }).catch(error => {
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
      });
    }
  }

  getProductInfo5(idProduct: string = '') {
    if (idProduct) {

      let path = `user/caGOmbCPEcbdBSBbjhKG8FgfHDO2/products/${idProduct}`

      this.loading = true;

      this.firebaseSvc.getDocument(path).then((product: Product) => {
        this.productOrder5 = product;
      }).catch(error => {
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
      });
    }
  }
}
