import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  products: Product[]= [];

  pesos: String = '$';

  ngOnInit() {
  }

  user(): User{
    return this.utilsSvc.getFromLocalStorage('user');

  }

  ionViewWillEnter() {
    this.getProducts();
    
  }


  getProducts() {

    let path = `users/${this.user().uid}/products`;

  let sub =   this.firebaseSvc.getCollectionData(path).subscribe(
    {
     next: (res: any) => {
      console.log(res);
      this.products = res;
      sub.unsubscribe
     } 
    }
    )

  }

  signOut(){

    this.firebaseSvc.singOut();
  }


  async addUpdateProduct (product?: Product){

  let success = await this.utilsSvc.presentModal({
      component:AddUpdateProductComponent,
     cssClass: 'add-update-modal',
     componentProps: { product}
    })
    if (success) this.getProducts();
  }

//======== eliminar Producto=========
async deleteProduct(product: Product) {


  let path = `users/${this.user().uid}/products/${product.id}`

  const loading = await this.utilsSvc.loading();
  await loading.present();

  let imagePath = await this.firebaseSvc.getFilePath(product.image);
  await  this.firebaseSvc.deleteDocument(imagePath);

  this.firebaseSvc.deleteDocument(path).then(async res => {

this.products = this.products.filter(p=> p.id !== product.id)
 

    this.utilsSvc.presentToast({
      message: 'Productor eliminado Correctamente',
      duration: 1500,
      color: 'success',
      position: 'middle',
      icon: 'checkmark-circle-outline'
    })

  }).catch(error => {
    console.log(error);

    this.utilsSvc.presentToast({

      message: error.message,
      duration: 2500,
      color: 'primary',
      position: 'middle',
      icon: 'alert-circle-outline'
    })


  }).finally(() => {
    loading.dismiss();
  }
)



}


}
