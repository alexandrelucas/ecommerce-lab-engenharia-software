import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AvisoDialog } from 'src/app/shared/dialogs/aviso/aviso-dialog';
import { ConfirmacaoDialog } from 'src/app/shared/dialogs/confirm/confirmacao-dialog';
import { Cartao } from 'src/app/shared/models/cartao.model';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { Endereco } from 'src/app/shared/models/endereco.model';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';
import { ClienteService } from 'src/app/shared/services/cliente.service';

@Component({
  selector: 'app-minha-conta',
  templateUrl: './minha-conta.component.html',
  styleUrls: ['./minha-conta.component.scss']
})
export class MinhaContaComponent implements OnInit {

  private storage;
  public dadosCliente: Cliente = new Cliente();
  public perfilForm: FormGroup;  
  public cardAtivo = 1;
  public showLoad: boolean;
  public clienteId: number;
  public tiposTelefone = []
  public bandeiras = {
    mastercard: 'Master Card',
    visa: 'Visa',
    diners: 'DinersClub',
    amex: 'American Express',
    discover: "Discover",
    hipercard: 'Hipercard',
    elo: 'Elo',
    novo: 'Novo Cartão'
  }

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private clienteService: ClienteService,
    private servico: SandBoxService,
    private router: Router
    ) {
      this.storage = window.localStorage;
      this.clienteId = JSON.parse(this.storage.getItem('clienteId'));
    }

  ngOnInit(): void {
    this.showLoad = true;
    this.getTipoTelefone();
    this.getCliente();  
    this.getEnderecos();
    this.getCartoes();

    // so pra ir pras minhas compras
    if(this.router.url.includes("#pedidos")) {
      this.cardAtivo = 4;
    }
  }

  getTipoTelefone(){
    this.servico.getTipoTelefone().subscribe( (result:any) => {      
      this.tiposTelefone = result.tipoTelefone;
    });
  }

  getCliente(){
    this.clienteService.getCliente(this.clienteId).subscribe( (result:any) => {
      this.carregaObjCliente(result.cliente);
    });
  }
  getEnderecos(){
    this.clienteService.getEndereco(this.clienteId).subscribe( (result:any) => {
      this.dadosCliente.endereco = result.endereco;
    });
  }
  getCartoes(){
    this.clienteService.getCartao(this.clienteId).subscribe( (result:any) => {      
      result.cartao.forEach(c => {
        c.bandeira = this.getCardFlag(c.numero);
        this.dadosCliente.cartao.push(new Cartao(c.id, c.nomeTitular, c.numero, c.cvv, c.bandeira, c.dataValidade));
      });
    });
  }

  carregaForm(){
    this.perfilForm = this.formBuilder.group({
      nome: [this.dadosCliente.nome ?? '', Validators.required],
      cpf: [this.dadosCliente.cpf],
      email: [this.dadosCliente.email],
      telefone: [this.dadosCliente.telefone ?? '', Validators.required],
      tipoTelefoneId: [this.dadosCliente.tipoTelefoneId ?? '0', Validators.required],
      sexo: [this.dadosCliente.sexo ?? '0', Validators.required],
      dataNasc: [this.dadosCliente.dataNasc ?? '', Validators.required]
    });
    this.showLoad = false;
    this.verificaCliente();
  }

  carregaObjCliente(dados){
    let dataTratada = new RegExp(/\d{4}-\d{2}-\d{2}/).exec(dados.dataNasc)[0].split('-');
    this.dadosCliente.nome = dados.nome;
    // this.dadosCliente.dataNasc = dados.dataNasc;
    this.dadosCliente.dataNasc = `${dataTratada[2]}/${dataTratada[1]}/${dataTratada[0]}`;
    this.dadosCliente.cpf = dados.cpf;
    this.dadosCliente.tipoTelefoneId = dados.tipoTelefoneId;
    this.dadosCliente.telefone = dados.telefone;
    this.dadosCliente.sexo = dados.sexo;
    this.dadosCliente.email = dados.email;
    this.dadosCliente.senha = dados.senha;

    this.carregaForm();      
  }

  verificaCliente(){
    if(!this.dadosCliente.cartao){
      this.dadosCliente.cartao = [];
    }
  }

  aplicaCssErro(field, form){
    let touched = this[form].get(field).touched;      
    let isValid = touched ? ( this[form].get(field).valid ? 'is-valid' : 'is-invalid' ) : '';
    
    return field ? isValid : '';
  }

  addEndereco(){
    let index = this.dadosCliente.endereco.length;
    this.dadosCliente.endereco.push(new Endereco(index, 'Novo Endereço', '2'));
  }
  
  /** PERFIL */
  onSubmitPerfil(){
    console.log(this.perfilForm.value);
    if(this.perfilForm.valid){      
      this.clienteService.updateCliente(this.clienteId, this.perfilForm.value).subscribe( (result: any) => {
        this.showModalSucesso('Info', 'Dados alterados com sucesso!');
      })
    }
  }

  showModalSucesso(title, message){
    this.dialog.open(AvisoDialog,{
      data: {
        title: title,
        message: message
      }
    });
  }  

  /** CARTÃO */
  addCartao(){
    if(!this.dadosCliente.cartao){
      this.dadosCliente.cartao = [];      
    }
    console.log(this.dadosCliente.cartao)

    let index = this.dadosCliente.cartao.length;
    this.dadosCliente.cartao.push(new Cartao(index, null, null, null, 'novo', null));    
  }

  onCartaoDeleted(cartaoId){
    let cartao = this.dadosCliente.cartao.findIndex(c => c.id == cartaoId);
    this.dadosCliente.cartao.splice(cartao, 1);
    
    this.updateStorage();
  }
  
  onCartaoAlterado(cartaoAlterado){    
    let idxCartao = this.dadosCliente.cartao.findIndex(c => c.id == cartaoAlterado.id);    
    this.dadosCliente.cartao[idxCartao] = cartaoAlterado;    
    this.showModalSucesso('Info', 'Cartão alterado com sucesso!');
  }

  /** STORAGE */
  updateStorage(){     
    this.storage.setItem('cliente', JSON.stringify(this.dadosCliente));
  }

  /** ENDEREÇO */
  onEnderecoDeleted(id: number) {    
    let indexEnd = this.dadosCliente.endereco.findIndex(e => e.id == id);
    this.dadosCliente.endereco.splice(indexEnd, 1);      
  }

  getCardFlag(cardnumber){    
    cardnumber.replace(/[^0-9]+/g, '');

    let cards = {
        visa      : /^4[0-9]{12}(?:[0-9]{3})/,
        mastercard : /^5[1-5][0-9]{14}/,
        diners    : /^3(?:0[0-5]|[68][0-9])[0-9]{11}/,
        amex      : /^3[47][0-9]{13}/,
        discover  : /^6(?:011|5[0-9]{2})[0-9]{12}/,
        hipercard  : /^(606282\d{10}(\d{3})?)|(3841\d{15})/,
        elo        : /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})/,
        jcb        : /^(?:2131|1800|35\d{3})\d{11}/,       
        aura      : /^(5078\d{2})(\d{2})(\d{11})$/     
    };

    for (var flag in cards) {
        if(cards[flag].test(cardnumber)) {
            return flag;
        }
    }

    return false;
  }
}
