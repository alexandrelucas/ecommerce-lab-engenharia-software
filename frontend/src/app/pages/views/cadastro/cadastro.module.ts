import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CadastroRoutingModule } from './cadastro-routing.module';
import { CadastroComponent } from './cadastro.component';
import { EnderecoComponent } from './endereco/endereco.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    CadastroComponent,
    EnderecoComponent,
  ],
  imports: [
    CommonModule,    
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    CadastroRoutingModule,
    MatStepperModule,
    MatIconModule,
    NgxMaskModule.forRoot(),
  ]
})
export class CadastroModule { }
