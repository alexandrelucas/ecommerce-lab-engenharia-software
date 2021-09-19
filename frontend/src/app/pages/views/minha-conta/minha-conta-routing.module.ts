import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MinhaContaComponent } from './minha-conta.component';

const routes: Routes = [
  { path:'', component: MinhaContaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MinhaContaRoutingModule { }
