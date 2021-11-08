import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Produto } from 'src/app/shared/models/produtos.model';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';

@Component({
  selector: 'app-cadastro-produto',
  templateUrl: './cadastro-produto.component.html',
  styleUrls: ['./cadastro-produto.component.scss']
})
export class CadastroProdutoComponent implements OnInit {

  @Input() produto: Produto;
  public produtoForm: FormGroup;
  public categorias = []
  public paises = []
  public selectProduto:any = {};

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private servicoService: SandBoxService
  ) { }

  ngOnInit(): void {    
    console.log(this.produto)
    this.carregaForm();

    if(this.produto){
      this.getProduto()
    }

    this.getListaCategorias();
    this.getListaPaises();
  }

  carregaForm(){
    this.produtoForm = this.formBuilder.group({
      categoriaId: [this.selectProduto?.categoriaId ?? 0],
      titulo: [this.selectProduto?.titulo ?? ''],
      codigo: [this.selectProduto?.codigo ?? ''],
      tipo: [this.selectProduto?.tipo ?? ''],
      paisId: [this.selectProduto?.paisId ?? 0],
      quantidadeML: [this.selectProduto?.quantidadeML ?? ''],
      teorAlcoolico: [this.selectProduto?.teorAlcoolico ?? ''],
      precoDe: [this.selectProduto?.precoDe ?? ''],
      precoPor: [this.selectProduto?.precoPor ?? ''],
      tempoGuarda: [this.selectProduto?.tempoGuarda ?? ''],
      imagem: [this.selectProduto?.imagem ?? ''],
      descricao: [this.selectProduto?.descricao ?? ''],
      peso: [0],
			comprimento: [0],
			altura: [0],
			largura: [0],
			diametro: [0],
			formato: [0]
    })
  }

  getProduto(){
    this.servicoService.getProduto(this.produto).subscribe((result:any) => {
      this.selectProduto = result.produto;
      console.log(result.produto)
      this.carregaForm();
    })
  }

  getListaCategorias(){
    this.servicoService.getListaCategorias().subscribe((result:any) => {
      this.categorias = result.categorias;      
    })
  }

  getListaPaises(){
    this.servicoService.getListaPaises().subscribe((result:any) => {
      this.paises = result.paises;      
    });
  }

  closeModal(){
    this.activeModal.close(this.selectProduto);
  }
}
