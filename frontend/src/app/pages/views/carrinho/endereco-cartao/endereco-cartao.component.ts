import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CarrinhoCupom } from 'src/app/shared/models/carrinhoCupom.model';
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
  public cupomForm: FormGroup;

  public enderecoTroca;
  public cartaoTroca;
  public cartaoAdicional: boolean;
  public setCartaoAdd: boolean;
  
  public infoCupom = '';
  
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

  public carrinhoCompra:any = {}

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private carrinhoService: CarrinhoService,
    private servicoService: SandBoxService,
    private cliente: ClienteService    
  ) {}

  ngOnInit(): void {     
    this.loadCarrinho();    
    this.loadForms();
  }

  loadCarrinho(){
    this.carrinhoService.getLista().subscribe(ret => {      
      if(ret){
        this.carrinhoCompra = ret;

        if(this.carrinhoCompra.clienteId != undefined){
          this.getCliente();
          this.getCartao();
        }        
      }
    });
  }

  getCliente(){
    this.cliente.getEndereco(this.carrinhoCompra.clienteId).subscribe( (ret:any) => {      
      if(ret.status == 0){        
        this.carrinhoCompra.enderecos = ret.endereco;
        this.setEnderecoEntrega();
      }else{
        this.carrinhoCompra.enderecoEntrega = new Endereco();
      }
    });
  }

  getCartao(){
    this.cliente.getCartao(this.carrinhoCompra.clienteId).subscribe( (ret:any) => {
      if(ret.status == 0){
        this.carrinhoCompra.cartoes = ret.cartao;
        this.carrinhoCompra.cartoes.forEach(c => c.bandeira = this.getCardFlag(c.numero));
        this.setCartaoPagamento();
      }else{
        this.carrinhoCompra.cartaoPagamento = new Cartao();
      }
    });
  }

  setEnderecoEntrega(){
    if(this.carrinhoCompra.enderecoEntrega?.id == undefined){
      let entrega = this.carrinhoCompra.enderecos.filter(end => end.tipoEndereco == 'entrega')[0];
      this.carrinhoCompra.enderecoEntrega = entrega ? entrega : this.carrinhoCompra.enderecos[0];
    }
  }

  setCartaoPagamento(){
    if(this.carrinhoCompra.cartaoPagamento?.id == undefined){
      this.carrinhoCompra.cartaoPagamento = this.carrinhoCompra.cartoes[0];      
    }
  }
  
  loadForms(){
    this.formEndereco = this.formBuilder.group({
      id: [this.carrinhoCompra.enderecoEntrega?.id ?? ''],
      cep: [this.carrinhoCompra.enderecoEntrega?.cep ?? '', [Validators.required]],
      numero: [this.carrinhoCompra.enderecoEntrega?.numero ?? '', Validators.required],
      logradouro: [this.carrinhoCompra.enderecoEntrega?.logradouro ?? '', Validators.required],
      complemento: [this.carrinhoCompra.enderecoEntrega?.complemento ?? ''],
      bairro: [this.carrinhoCompra.enderecoEntrega?.bairro ?? '', Validators.required],
      cidade: [this.carrinhoCompra.enderecoEntrega?.cidade ?? '', Validators.required],
      uf: [this.carrinhoCompra.enderecoEntrega?.uf ?? '', Validators.required],
      pais: ['Brasil', Validators.required],
      descricaoEndereco: [this.carrinhoCompra.enderecoEntrega?.descricaoEndereco ?? '', Validators.required],
      tipoEnderecoId: [this.carrinhoCompra.enderecoEntrega?.tipoEnderecoId ?? '', Validators.required],
      tipoLogradouroId: [this.carrinhoCompra.enderecoEntrega?.tipoLogradouroId ?? '', Validators.required]
    });

    this.formCartao = this.formBuilder.group({
      id: [this.carrinhoCompra.cartaoPagamento?.id ?? ''],
      bandeira: [this.carrinhoCompra.cartaoPagamento?.bandeira ?? '', Validators.required],
      nomeTitular: [this.carrinhoCompra.cartaoPagamento?.nomeTitular ?? '', Validators.required],
      numero: [this.carrinhoCompra.cartaoPagamento?.numero ?? '', Validators.required],
      cvv: [this.carrinhoCompra.cartaoPagamento?.cvv ?? '', Validators.required],
      dataValidade: [this.carrinhoCompra.cartaoPagamento?.dataValidade ?? '', Validators.required]
    });

    this.cupomForm = this.formBuilder.group({      
      cupom: ['', Validators.required]
    });
  }    

  validaCupom(cupom){
    if(this.carrinhoCompra.cupons == undefined){
      this.carrinhoCompra.cupons = [];
    }

    if(!cupom){
      return this.infoCupom = 'Insira um cupom';
    }

    let idxCupom = this.carrinhoCompra.cupons.findIndex(c => c.codigoCupom == cupom);
    if(idxCupom != -1){      
      this.carrinhoCompra.cupons.splice(idxCupom, 1)
      this.updateValorCompras();
      return this.infoCupom = 'Cupom removido';
    }

    this.servicoService.validaCupom(cupom, this.carrinhoCompra.clienteId).subscribe((ret:any) => {      
      if(ret.status == 0){
        this.carrinhoCompra.cupons.push(new CarrinhoCupom(ret.cupom.id, ret.cupom.valorDesconto, ret.cupom.codigo));        
        this.carrinhoCompra.valorDescontos += ret.cupom.valorDesconto;        
        this.updateValorCompras();
      }
      this.infoCupom = ret.message;
    });
  }

  updateValorCompras(){    
    this.getTotalCupons();
    let valorCompras = this.carrinhoCompra.valorCompras;
    let valorFrete = parseFloat(this.carrinhoCompra.frete?.valorFrete);
    let valorDescontos = this.carrinhoCompra.valorDescontos
    this.carrinhoCompra.valorTotal = ((valorCompras + valorFrete) - valorDescontos) > 0 ? ((valorCompras + valorFrete) - valorDescontos) : 0;    
    return this.carrinhoCompra.valorTotal;
  }
  getTotalCupons(){
    let valorCupons = 0;    
    this.carrinhoCompra.cupons?.forEach(cp => {      
      valorCupons += cp.valorCupomDesconto;
    });    
    this.carrinhoCompra.valorDescontos = valorCupons;
  }

  showModalEndereco(tipo: boolean){
    /** TIPO: 
     * true = Edita  
     * false = Cadastra
     * */

    let modalRef = this.modalService.open(EnderecoComponent);
    modalRef.componentInstance.endereco = tipo ? this.carrinhoCompra.enderecoEntrega : new Endereco();

    modalRef.result.then(result => {
      if(!result.id){
        this.cliente.setEndereco(this.carrinhoCompra.clienteId, result).subscribe((res:any) => {
          result.id = res.message;
        });
        this.carrinhoCompra.enderecos.push(result);
      }else{        
        this.cliente.updateEndereco(result, this.carrinhoCompra.clienteId).subscribe( (res: any) => {      
          console.log(res)
        });

        this.carrinhoCompra.enderecos[this.carrinhoCompra.enderecos.findIndex( e => e.id == result.id)] = result;
        this.carrinhoCompra.enderecoEntrega = result;        
      }

      if(!this.carrinhoCompra.enderecoEntrega){
        this.carrinhoCompra.enderecoEntrega = result;
      }
    });
  }

  showModalCartao(tipo: boolean){
    /** TIPO: 
     * true = Edita  
     * false = Cadastra
     * */

    let modalRef = this.modalService.open(CartaoComponent);
    modalRef.componentInstance.cartao = tipo ? this.carrinhoCompra.cartaoPagamento : new Cartao();

    modalRef.result.then(result => {
      if(!result.id){        
        this.cliente.setCartao(this.carrinhoCompra.clienteId, result).subscribe((res:any) => {          
          result.id = res.message;
        });
        this.carrinhoCompra.cartoes.push(result);
      }else{
        this.cliente.updateCartao(result, this.carrinhoCompra.clienteId).subscribe( (res: any) => {      
          console.log(res)
        });

        this.carrinhoCompra.cartoes[this.carrinhoCompra.cartoes.findIndex( c => c.id == result.id)] = result;
        this.carrinhoCompra.cartaoPagamento = result;
      }

      if(!this.carrinhoCompra.cartaoPagamento){
        this.carrinhoCompra.cartaoPagamento = result;
      }
      console.log(this.carrinhoCompra);
    });
  }

  showModalTroca(modal){
    this.modalService.open(modal);
  }

  setTrocaEndereco(){
    this.modalService.dismissAll();
    let idx = this.carrinhoCompra.enderecos.findIndex( e => e.id == this.enderecoTroca);
    this.carrinhoCompra.enderecoEntrega = this.carrinhoCompra.enderecos[idx];    
  }

  setTrocaCartao(){
    this.modalService.dismissAll();
    let idx = this.carrinhoCompra.cartoes.findIndex( c => c.id == this.cartaoTroca);
    this.carrinhoCompra.cartaoPagamento = this.carrinhoCompra.cartoes[idx];
  }

  setCarrinho(){
    console.log(this.pagamento)
    if(!this.carrinhoCompra.pagamento){
      this.carrinhoCompra.pagamento = {}
    }
      
    console.log(this.carrinhoCompra)
    if(this.pagamento.doisCartoes){
      this.carrinhoCompra.pagamento = this.pagamento;
      this.carrinhoCompra.pagamento.segundoCartao.idCartao = parseInt(this.carrinhoCompra.pagamento.segundoCartao.idCartao);      
    }else{
      this.carrinhoCompra.pagamento.cartaoPrincipal = {}
      this.carrinhoCompra.pagamento.cartaoPrincipal.idCartao = this.carrinhoCompra.cartaoPagamento.id;
      this.carrinhoCompra.pagamento.cartaoPrincipal.valorAPagar = this.carrinhoCompra.valorTotal;
      this.carrinhoCompra.pagamento.doisCartoes = false;
    }
    
    this.carrinhoService.setLista(this.carrinhoCompra);
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
    if(this.pagamento.segundoCartao.valorAPagar < 10){
      return this.pagamento.obs = 'O valor não pode ser menor que R$ 10,00';
    }
    console.log(this.carrinhoCompra)

    this.pagamento.obs = null;
    this.setCartaoAdd = true;
    this.pagamento.doisCartoes = true;
    this.pagamento.cartaoPrincipal.valorAPagar = this.carrinhoCompra.valorTotal - this.pagamento.segundoCartao.valorAPagar; 
    this.pagamento.cartaoPrincipal.idCartao = this.carrinhoCompra.cartaoPagamento.id;    
    console.log(this.pagamento);
  }
}