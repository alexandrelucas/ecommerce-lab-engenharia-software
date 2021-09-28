import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Cartao } from 'src/app/shared/models/cartao.model';

@Component({
  selector: 'app-cartao',
  templateUrl: './cartao.component.html',
  styleUrls: ['./cartao.component.scss']
})
export class CartaoComponent implements OnInit {

  @Input() cartao: Cartao;
  public formCartao: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.loadCartao();
  }

  loadCartao(){
    //console.log(this.cartao)

    this.formCartao = this.formBuilder.group({
      id: [this.cartao.id],
      bandeira: [this.cartao.bandeira, Validators.required],
      nomeTitular: [this.cartao.nomeTitular, Validators.required],
      numero: [this.cartao.numero, Validators.required],
      cvv: [this.cartao.cvv, Validators.required],
      dataValidade: [this.cartao.dataValidade, Validators.required]
    });
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
  setBandeira(){
    //console.log(this.getCardFlag(this.formCartao.get('numero').value));
    let flag = this.getCardFlag(this.formCartao.get('numero').value)

    this.formCartao.patchValue({
      bandeira: flag
    });
  }

  closeModal(){    
    this.setBandeira();
    //console.log(this.formCartao.value)
    this.activeModal.close(this.formCartao.value);
  }
}
