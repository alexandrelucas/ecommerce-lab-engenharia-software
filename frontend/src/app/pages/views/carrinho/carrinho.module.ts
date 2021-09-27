import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarrinhoRoutingModule } from './carrinho-routing.module';
import { CarrinhoComponent } from './itens-carrinho/carrinho.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskModule } from 'ngx-mask';
import { IdentificacaoComponent } from './identificacao/identificacao.component';
import { PagamentoComponent } from './pagamento/pagamento.component';
import { CarrinhoDashComponent } from './dash/carrinho-dash.component';
import { EnderecoCartaoComponent } from './endereco-cartao/endereco-cartao.component';
import { EnderecoComponent } from './dialogs/endereco/endereco.component';
import { CartaoComponent } from './dialogs/cartao/cartao.component';
import { ResultadoComponent } from './pagamento/resultado/resultado.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [CarrinhoComponent, IdentificacaoComponent, PagamentoComponent, CarrinhoDashComponent, EnderecoCartaoComponent, EnderecoComponent, CartaoComponent, ResultadoComponent],
  imports: [
    CommonModule,
    CarrinhoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    NgxMaskModule.forRoot()
  ]
})
export class CarrinhoModule { }
