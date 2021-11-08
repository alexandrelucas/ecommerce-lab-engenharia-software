import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AvisoDialog } from 'src/app/shared/dialogs/aviso/aviso-dialog';
import { ConfirmacaoDialog } from 'src/app/shared/dialogs/confirm/confirmacao-dialog';
import { Endereco } from 'src/app/shared/models/endereco.model';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';
import { ClienteService } from 'src/app/shared/services/cliente.service';

@Component({
  selector: 'app-meu-endereco',
  templateUrl: './meu-endereco.component.html',
  styleUrls: ['./meu-endereco.component.scss']
})
export class MeuEnderecoComponent implements OnInit {

  @Input('endereco') endereco: Endereco;
  @Output() deleteEvent = new EventEmitter();
  
  public listaPaises: [];
  public meuEnderecoForm: FormGroup;
  public storage;
  public tipoEndereco = []
  public tipoLogradouro = []
  public clienteId: number;

  constructor(
    private formBuilder: FormBuilder, 
    private clienteService: ClienteService,
    private dialog: MatDialog,
    private servico: SandBoxService
  ) {
    this.storage = window.localStorage;
  }

  ngOnInit(): void {
    this.clienteId = JSON.parse(this.storage.getItem('clienteId'))[0];
    this.getListaPais();
    this.getTipoEndereco();
    this.getTipoLogradouro();
    
    this.meuEnderecoForm = this.formBuilder.group({
      id: [this.endereco.id],
      cep: [this.endereco.cep ?? '', [Validators.required]],
      numero: [this.endereco.numero ?? '', Validators.required],
      logradouro: [this.endereco.logradouro ?? '', Validators.required],
      complemento: [this.endereco.complemento ?? ''],
      bairro: [this.endereco.bairro ?? '', Validators.required],
      cidade: [this.endereco.cidade ?? '', Validators.required],
      uf: [this.endereco.uf ?? '', Validators.required],
      paisId: [this.endereco.paisId ?? '2', Validators.required],
      descricaoEndereco: [this.endereco.descricaoEndereco ?? '', Validators.required],
      tipoEnderecoId: [this.endereco.tipoEnderecoId ?? '2', Validators.required],
      tipoLogradouroId: [this.endereco.tipoLogradouroId ?? '5', Validators.required],
      clienteId: [this.clienteId]
    });

    
  }

  getListaPais() {
    this.servico.getListaPaises().subscribe((result: any) => {
      this.listaPaises = result.paises;
    });
  }

  getTipoEndereco(){
    this.servico.getTipoEndereco().subscribe( (result:any) => {      
      this.tipoEndereco = result.tipoEndereco;
    });
  }
  getTipoLogradouro(){
    this.servico.getTipoLogradouro().subscribe( (result:any) => {      
      this.tipoLogradouro = result.tipoLogradouro;
    });
  }
  // getTipoTelefone(){
  //   this.servico.getTipoTelefone().subscribe( (result:any) => {      
  //     this.tiposTelefone = result.tipoLogradouro;
  //   });
  // }

  aplicaCssErro(field, form){
    let touched = this[form].get(field).touched;      
    let isValid = touched ? ( this[form].get(field).valid ? 'is-valid' : 'is-invalid' ) : '';
    
    return field ? isValid : '';
  }

  onCEPChange() {
    let cep = this.meuEnderecoForm.get('cep');
    if(cep.valid) {
      this.clienteService.getViaCep(cep.value.toString().replace('-','')).subscribe((dados) => {
        this.meuEnderecoForm.get('logradouro').setValue(dados['logradouro']);
        this.meuEnderecoForm.get('cidade').setValue(dados['localidade']);
        this.meuEnderecoForm.get('bairro').setValue(dados['bairro']);
        this.meuEnderecoForm.get('complemento').setValue(dados['complemento']);
        this.meuEnderecoForm.get('uf').setValue(dados['uf']);
      });
    }
  }

  onDelete() {
    if(this.meuEnderecoForm.get('cep').invalid){
      this.emitDelete();
    }else{

      let modal = this.dialog.open(ConfirmacaoDialog, {
        data: {
          title: 'Exclusão',
          message: 'Deseja realmente excluir esse endereço?'        
        }
      });
      
      modal.afterClosed().subscribe( ret => {
        if(ret){        
          this.clienteService.deleteEndereco(this.meuEnderecoForm.get('id').value).subscribe( (result:any) => {     
            this.showModalSucesso('Info', `${result.message}`);
            this.emitDelete();
          });   
        }
      })
    }
  }

  onUpdate() {
    this.clienteService.updateEndereco(this.meuEnderecoForm.value, this.meuEnderecoForm.get('id').value).subscribe( (result: any) => {      
      console.log(result)
      this.showModalSucesso('Info', result.message);
    });
  }

  onValidate() {
    return this.meuEnderecoForm.invalid;
  }

  onSubmit() {
    this.clienteService.setEndereco(this.clienteId, this.meuEnderecoForm.value).subscribe( result => {
      // console.log(result)
      this.endereco = this.meuEnderecoForm.value;
      this.showModalSucesso('Info', 'Endereço criado com sucesso!');
    });
  }

  emitDelete(){
    this.deleteEvent.emit(this.endereco?.id);
  }

  showModalSucesso(title, message){
    this.dialog.open(AvisoDialog,{
      data: {
        title: title,
        message: message
      }
    });
  }
}
