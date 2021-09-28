import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Cartao } from 'src/app/shared/models/cartao.model';
import { Endereco } from 'src/app/shared/models/endereco.model';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import { CarrinhoService } from '../carrinho.service';
import { CartaoComponent } from '../dialogs/cartao/cartao.component';
import { EnderecoComponent } from '../dialogs/endereco/endereco.component';

@Component({
  selector: 'app-endereco-cartao',
  templateUrl: './endereco-cartao.component.html',
  styleUrls: ['./endereco-cartao.component.scss']
})


export class EnderecoCartaoComponent implements OnInit {
  
  public formEndereco: FormGroup;
  public formCartao: FormGroup;   
    
  public enderecoTroca;
  public cartaoTroca;
  public cartaoAdicional: boolean;
  public setCartaoAdd: boolean;

  public pagamento = {
    cartaoPrincipal: {
      idCartao: 0,
      valorAPagar: 0,
    },    
    segundoCartao: {
      idCartao: 0,
      valorAPagar: 0
    },
    obs: null,
    doisCartoes: false
  }
  public cartoesPagamento = []

  public carrinho:any = {
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
    clienteId: null,    
  }

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private carrinhoService: CarrinhoService,
    private cliente: ClienteService    
  ) {}

  ngOnInit(): void {
    this.loadCarrinho();    
    this.loadFormEndereco();
    this.loadFormCartao();
  }

  loadCarrinho(){
    this.carrinhoService.getLista().subscribe(ret => {
      if(ret){
        this.carrinho = ret;
        if(this.carrinho.clienteId){
          this.getCliente();
          this.getCartao();
        }
      }
    });
  }

  getCliente(){    
    this.cliente.getEndereco(this.carrinho.clienteId).subscribe( (ret:any) => {
      if(ret.status == 0){
        this.carrinho.enderecos = ret.endereco;
        this.setEnderecoEntrega();
      }else{
        this.carrinho.enderecoEntrega = new Endereco();
      }
    });
  }

  getCartao(){
    this.cliente.getCartao(this.carrinho.clienteId).subscribe( (ret:any) => {
      if(ret.status == 0){
        this.carrinho.cartoes = ret.cartao;
        this.carrinho.cartoes.forEach(c => c.bandeira = this.getCardFlag(c.numero));
        this.setCartaoPagamento();
      }else{
        this.carrinho.cartaoPagamento = new Cartao();
      }
    });
  }

  setEnderecoEntrega(){
    if(this.carrinho.enderecoEntrega?.id == undefined){
      let entrega = this.carrinho.enderecos.filter(end => end.tipoEndereco == 'entrega')[0];
      this.carrinho.enderecoEntrega = entrega ? entrega : this.carrinho.enderecos[0];
    }
  }

  setCartaoPagamento(){
    if(this.carrinho.cartaoPagamento?.id == undefined){
      this.carrinho.cartaoPagamento = this.carrinho.cartoes[0];      
    }
  }
  
  loadFormEndereco(){
    this.formEndereco = this.formBuilder.group({
      id: [this.carrinho.enderecoEntrega.id ?? ''],
      cep: [this.carrinho.enderecoEntrega.cep ?? '', [Validators.required]],
      numero: [this.carrinho.enderecoEntrega.numero ?? '', Validators.required],
      logradouro: [this.carrinho.enderecoEntrega.logradouro ?? '', Validators.required],
      complemento: [this.carrinho.enderecoEntrega.complemento ?? ''],
      bairro: [this.carrinho.enderecoEntrega.bairro ?? '', Validators.required],
      cidade: [this.carrinho.enderecoEntrega.cidade ?? '', Validators.required],
      uf: [this.carrinho.enderecoEntrega.uf ?? '', Validators.required],
      pais: ['Brasil', Validators.required],
      descricaoEndereco: [this.carrinho.enderecoEntrega.descricaoEndereco ?? '', Validators.required],
      tipoEnderecoId: [this.carrinho.enderecoEntrega.tipoEnderecoId ?? '', Validators.required],
      tipoLogradouroId: [this.carrinho.enderecoEntrega.tipoLogradouroId ?? '', Validators.required]
    });
  }
  
  loadFormCartao(){
    this.formCartao = this.formBuilder.group({
      id: [this.carrinho.cartaoPagamento.id ?? ''],
      bandeira: [this.carrinho.cartaoPagamento.bandeira ?? '', Validators.required],
      nomeTitular: [this.carrinho.cartaoPagamento.nomeTitular ?? '', Validators.required],
      numero: [this.carrinho.cartaoPagamento.numero ?? '', Validators.required],
      cvv: [this.carrinho.cartaoPagamento.cvv ?? '', Validators.required],
      dataValidade: [this.carrinho.cartaoPagamento.dataValidade ?? '', Validators.required]
    });
  }

  showModalEndereco(tipo: boolean){
    /** TIPO: 
     * true = Edita  
     * false = Cadastra
     * */

    let modalRef = this.modalService.open(EnderecoComponent);
    modalRef.componentInstance.endereco = tipo ? this.carrinho.enderecoEntrega : new Endereco();

    modalRef.result.then(result => {
      if(!result.id){
        this.cliente.setEndereco(this.carrinho.clienteId, result).subscribe((res:any) => {
          result.id = res.message;
        });
        this.carrinho.enderecos.push(result);
      }else{        
        this.cliente.updateEndereco(result, this.carrinho.clienteId).subscribe( (res: any) => {      
          console.log(res)
        });

        this.carrinho.enderecos[this.carrinho.enderecos.findIndex( e => e.id == result.id)] = result;
        this.carrinho.enderecoEntrega = result;        
      }

      if(!this.carrinho.enderecoEntrega){
        this.carrinho.enderecoEntrega = result;
      }
    });
  }

  showModalCartao(tipo: boolean){
    /** TIPO: 
     * true = Edita  
     * false = Cadastra
     * */

    let modalRef = this.modalService.open(CartaoComponent);
    modalRef.componentInstance.cartao = tipo ? this.carrinho.cartaoPagamento : new Cartao();

    modalRef.result.then(result => {
      if(!result.id){        
        this.cliente.setCartao(this.carrinho.clienteId, result).subscribe((res:any) => {          
          result.id = res.message;
        });
        this.carrinho.cartoes.push(result);
      }else{
        this.cliente.updateCartao(result, this.carrinho.clienteId).subscribe( (res: any) => {      
          console.log(res)
        });

        this.carrinho.cartoes[this.carrinho.cartoes.findIndex( c => c.id == result.id)] = result;
        this.carrinho.cartaoPagamento = result;
      }

      if(!this.carrinho.cartaoPagamento){
        this.carrinho.cartaoPagamento = result;
      }
      console.log(this.carrinho);
    });
  }

  showModalTroca(modal){
    this.modalService.open(modal);
  }

  setTrocaEndereco(){
    this.modalService.dismissAll();
    let idx = this.carrinho.enderecos.findIndex( e => e.id == this.enderecoTroca);
    this.carrinho.enderecoEntrega = this.carrinho.enderecos[idx];    
  }

  setTrocaCartao(){
    this.modalService.dismissAll();
    let idx = this.carrinho.cartoes.findIndex( c => c.id == this.cartaoTroca);
    this.carrinho.cartaoPagamento = this.carrinho.cartoes[idx];
  }

  setCarrinho(){    
    this.pagamento.cartaoPrincipal.idCartao = this.carrinho.cartaoPagamento.id;
    this.pagamento.cartaoPrincipal.valorAPagar = this.carrinho.valorTotal;
    let dados = this.carrinho;
    dados.pagamento = this.pagamento;

    this.carrinhoService.setLista(dados);
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

  addSegundoCartao(){
    if(this.pagamento.segundoCartao.valorAPagar > 10){
      this.pagamento.obs = null;
      this.setCartaoAdd = true;
      this.pagamento.doisCartoes = true;
      this.pagamento.cartaoPrincipal.valorAPagar = this.carrinho.valorTotal - this.pagamento.segundoCartao.valorAPagar;
    }else{
      this.pagamento.obs = 'O valor não pode ser menor que R$ 10,00';
    }
  }
}