import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MinhaContaRoutingModule } from './minha-conta-routing.module';
import { MinhaContaComponent } from './minha-conta.component';
import { MeuEnderecoComponent } from './meu-endereco/meu-endereco.component';
import { MeuCartaoComponent } from './meu-cartao/meu-cartao.component';
import { AlterarSenhaComponent } from './alterar-senha/alterar-senha.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmacaoDialog } from 'src/app/shared/dialogs/confirm/confirmacao-dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MinhasComprasComponent } from './minhas-compras/minhas-compras.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MeusCuponsComponent } from './meus-cupons/meus-cupons.component';
import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
  declarations: [
    MinhaContaComponent, 
    MeuEnderecoComponent, 
    MeuCartaoComponent, 
    AlterarSenhaComponent,
    ConfirmacaoDialog,
    MinhasComprasComponent,
    MeusCuponsComponent
  ],
  imports: [
    CommonModule,
    MinhaContaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatStepperModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    NgxMaskModule.forRoot()    
  ]
})
export class MinhaContaModule { }
