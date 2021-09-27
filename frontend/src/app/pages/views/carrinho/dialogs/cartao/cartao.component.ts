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
    this.formCartao = this.formBuilder.group({
      id: [this.cartao.id],
      bandeira: [this.cartao.bandeira, Validators.required],
      nomeTitular: [this.cartao.nomeTitular, Validators.required],
      numero: [this.cartao.numero, Validators.required],
      cvv: [this.cartao.cvv, Validators.required],
      dataValidade: [this.cartao.dataValidade, Validators.required]
    });
  }

  closeModal(){
    this.activeModal.close(this.formCartao.value);
  }
}
