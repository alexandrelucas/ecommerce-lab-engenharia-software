import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { Cartao } from 'src/app/shared/models/cartao.model';
import { Endereco } from 'src/app/shared/models/endereco.model';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import { CarrinhoService } from '../carrinho.service';

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
  public carrinho = {
    valorTotal: 0,
    valorCompras: 0,
    valorFrete: 0,
    cupomDesconto: 0,
    listaFrete: [],
    infoCupom: '',
    cupom: '',
    listaCompras: [],
    enderecos: [],
    enderecoEntrega: new Endereco(),
    cartoes: [],
    cartaoPagamento: new Cartao(),
    pagamento: {
      metodo: '',
      qtdParcelas: null,
      valorParcela: 0
    },
    clienteId: null
  }

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
      this.carrinho = ret;
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
        console.log(res.result)

        if(res.result) {
          this.storage.setItem('clienteId', JSON.stringify([...res.result.toString()]))
          this.carrinho.clienteId = res.result;
          this.carrinhoService.setAutenticado(true);
          this.carrinhoService.setLista(this.carrinho);
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
