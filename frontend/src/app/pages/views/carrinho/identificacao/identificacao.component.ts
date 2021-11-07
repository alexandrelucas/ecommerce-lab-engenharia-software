import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { Cartao } from 'src/app/shared/models/cartao.model';
import { Endereco } from 'src/app/shared/models/endereco.model';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import { CarrinhoService } from '../carrinho.service';
import { CarrinhoCupom } from 'src/app/shared/models/carrinhoCupom.model';
import { CarrinhoFrete } from 'src/app/shared/models/carrinhoFrete.model';
import { CarrinhoPagamento } from 'src/app/shared/models/carrinhoPagamento.model';

@Component({
  selector: 'app-identificacao',
  templateUrl: './identificacao.component.html',
  styleUrls: ['./identificacao.component.scss']
})
export class IdentificacaoComponent implements OnInit {
  
  public step: MatHorizontalStepper;

  public loginForm: FormGroup;
  public storage;
  public showLoad: boolean;
  public carrinhoCompra;

  constructor(
    private cliente: ClienteService,
    private formBuilder: FormBuilder,
    private carrinhoService: CarrinhoService
  ) { }
  
  ngOnInit(): void {
    this.storage = window.localStorage;
    this.getControlStepper();
    this.loadDadosCarrinho();
    this.loadFormLogin();
  }

  loadFormLogin(){
    this.loginForm = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'senha': ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
    });
  }

  loadDadosCarrinho(){
    this.carrinhoService.getLista().subscribe( ret => {
      this.carrinhoCompra = ret;
    });
  }

  getControlStepper(){
    this.carrinhoService.getControlStepper().subscribe( ret => {
      this.step = ret;
    })
  }

  onSubmit() {
    if(this.loginForm.valid) {
      this.showLoad = true;      

      this.cliente.login(this.loginForm.get('email').value, this.loginForm.get('senha').value).subscribe((res: any) => {        
        if(res.result) {
          this.storage.setItem('clienteId', JSON.stringify([...res.result.toString()]))
          this.carrinhoCompra.clienteId = res.result;
          this.carrinhoService.setAutenticado(true);
          this.carrinhoService.setLista(this.carrinhoCompra);
          this.step.next();
        } else {
          console.log("erro login")
          console.log(res.message);
        }
        this.showLoad = false;
      });
    }
  }
}
