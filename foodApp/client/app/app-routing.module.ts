import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisplayOrderComponent } from './display-order/display-order.component';

const routes: Routes = [
  {
    path:'',
    component:DisplayOrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
