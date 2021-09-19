import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarrinhoComponent } from './itens-carrinho/carrinho.component';
import { IdentificacaoComponent } from './identificacao/identificacao.component';
import { CarrinhoDashComponent } from './dash/carrinho-dash.component';
import { EnderecoCartaoComponent } from './endereco-cartao/endereco-cartao.component';

const routes: Routes = [
  { path: '', component: CarrinhoDashComponent },
  { path: 'identificacao', component: IdentificacaoComponent },
  { path: 'pagamento', component: EnderecoCartaoComponent },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarrinhoRoutingModule { }
