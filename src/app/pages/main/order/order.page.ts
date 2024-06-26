import { Component, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CartService } from 'src/app/services/cart.service';
import { Order } from 'src/app/models/order.model';
import { OrderDetailComponent } from 'src/app/shared/components/order-detail/order-detail.component';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { where } from 'firebase/firestore';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  cartSvc = inject(CartService);

  userOrder: User | null = null;
  productOrder: Order | null = null;
  productOrderTmp: Order | null = null;
  order: Order[] = [];
  loading: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  // ================= Obtener datos del usuario ====================
  user(): User {
    return this.utilsSvc.getFormLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getOrders();
  }

  // ============ Obtener Pedidos ==============
  getOrders() {
    if (this.user().idRol == '1') {
      // Validar ruta dependiendo del rol: 1 => Admin / 2 => Cliente
      this.getOrdersAdmin();
    } else {
      this.getOrdersCustomer();
    }
  }

  getOrdersCustomer() {

    let path = `user/${this.user().uid}/order`;

    this.loading = true;
    let query = [];

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        res.forEach((data, key) => {

          let path = `user/${data.idUser}`;

          this.firebaseSvc.getDocument(path).then((user: User) => {
            res[key]['userOrder'] = user.name + ' ' + user.lastName;
          }).catch(error => {
            this.utilsSvc.presentToast({
              message: error.message,
              duration: 2500,
              color: 'primary',
              position: 'middle',
              icon: 'alert-circle-outline'
            })
          });

        });

        this.order = res;
        this.loading = false;
        sub.unsubscribe();
      }
    })
  }


  getOrdersAdmin() {

    // Consultar primero los usuarios
    let pathUsers = `user/`;
    this.loading = true;
    let query = [where('idRol', '>', '1')];

    let subUser = this.firebaseSvc.getCollectionData(pathUsers, query).subscribe({
      next: (resUser: any) => {

        const tmp = [];
        resUser.forEach((data, key) => {

          let pathOrders = `user/${data.uid}/order`;
          let subOrder = this.firebaseSvc.getCollectionData(pathOrders, []).subscribe({
            next: (resOrder: any) => {
              resOrder.forEach((valueOrder, keyOrder) => {
                resOrder[keyOrder]['userOrder'] = data.name + ' ' + data.lastName;
                tmp.push(resOrder[keyOrder]);
              });
              subOrder.unsubscribe();
            }
          })
        })
        this.order = tmp;
        this.loading = false;
        subUser.unsubscribe();
      }
    })
  }

  getQuantityTotal() {
    return this.order.reduce((total, ord) => total + ((parseInt(ord.quantity1) + 0) + (parseInt(ord.quantity2) + 0) + (parseInt(ord.quantity3) + 0) + (parseInt(ord.quantity4) + 0) + (parseInt(ord.quantity5) + 0)), 0);
  }

  // ================= Ver Detalles del Pedido =================
  async showDetailOrder(order?: Order) {
    let success = await this.utilsSvc.presentModal({
      component: OrderDetailComponent,
      cssClass: 'add-update-modal',
      componentProps: { order }
    })
    if (success) this.getOrders();
  }
}
