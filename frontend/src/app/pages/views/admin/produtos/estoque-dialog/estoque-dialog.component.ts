import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';
import * as moment from 'moment';

@Component({
  selector: 'app-estoque-dialog',
  templateUrl: './estoque-dialog.component.html',
  styleUrls: ['./estoque-dialog.component.scss']
})
export class EstoqueDialogComponent implements OnInit {

  @Input() produto: any;
  estoqueForm:FormGroup;


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private servico: SandBoxService  
  ) { }

  ngOnInit(): void {
    console.log(this.produto)
    this.estoqueForm = this.formBuilder.group({
      quantidade: ['', [Validators.required, Validators.pattern('[1-9][0-9]*')]],
      valorCusto: ['', Validators.required]
    })    
  }

  aplicaCssErro(field, form){
    let touched = this[form].get(field).touched;
    let isValid = touched ? ( this[form].get(field).valid ? 'is-valid' : 'is-invalid' ) : '';
    
    return field ? isValid : '';
  }
  verificarErro(field){    
    const listErros = this.estoqueForm.get(field).errors;
    if(listErros){
      if(listErros['required']){
        return listErros['required'] ? 'Quantidade obrigatória' : '';
      }
      if(listErros['pattern']){
        return listErros['pattern'] ? 'A quantidade não pode ser 0' : '';
      }
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  adicionarEstoque(){
    let produto = {
      "quantidade": parseInt(this.estoqueForm.get('quantidade').value),
      "fornecedor": "Vino",
      "valorCusto": parseFloat(this.estoqueForm.get('valorCusto').value),
      "dataEntrada": moment(new Date()).format('YYYY-MM-DD'),
      "produtoId": this.produto.id
    }
    console.log(produto)
    this.servico.addEstoqueProduto(produto).subscribe((result:any) => {
      this.activeModal.close();
      console.log(result)
    })
  }  
}
