import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';
import { Produto } from 'src/app/shared/models/produtos.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CadastroProdutoComponent } from './dialog/cadastro-produto.component';
import { EstoqueDialogComponent } from './estoque-dialog/estoque-dialog.component';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class ProdutosComponent implements OnInit {

  public categorias = []
  public paises = []
  public produtoSelecionado;
  public listaProdutos: Array<Produto> = []  
  dataSource: MatTableDataSource<Produto>; 

  displayedColumns: string[] = ['codigo', 'titulo', 'tipo', 'categoriaId', 'tempoGuarda', 'quantidadeML', 'paisId', 'inativado', 'acoes'];

  constructor(
    private servicoService: SandBoxService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void { 
    this.getListaCategorias();
  }

  getListaCategorias(){
    this.servicoService.getListaCategorias().subscribe((result:any) => {
      this.categorias = result.categorias
      this.getListaPaises()      
    })
  }

  getListaPaises(){
    this.servicoService.getListaPaises().subscribe((result:any) => {
      this.paises = result.paises;      
      this.carregaListaProdutos();
    });
  }

  carregaListaProdutos(){
    this.servicoService.getListaProdutos().subscribe((result:any) => {
      this.listaProdutos = result.produtos;
      this.dataSource = new MatTableDataSource(this.listaProdutos);
    })
  }

  getPaisNome(paisId){
    return this.paises.filter(p => p.id == paisId)[0].descricao;
  }

  getCategoriaNome(categoriaId){
    return this.categorias.filter(c => c.id == categoriaId)[0].descricao;
  }

  onInativoChange(event) {    
    let index = this.listaProdutos.findIndex(p => p.id == event.target.id);
    this.listaProdutos[index].inativado = event.target.checked;
  }

  showCadastroModal(produto?: any) {
    const modalRef = this.modalService.open(CadastroProdutoComponent);    
    modalRef.componentInstance.produto = produto;
    
    modalRef.result.then((result:any) => {
      if(result.id == -1){
        //SET PRODUTO
        this.servicoService.setProduto(result).subscribe((result:any) => {
          console.log('Criado com sucesso')
          this.carregaListaProdutos();
        });
      }else{
        //UPDATE PRODUTO
        this.servicoService.updateProduto(result.id, result).subscribe((result:any) => {          
          this.carregaListaProdutos();
        });
      }
    });
  }

  addEstoqueModal(produto) {
    this.modalService.open(EstoqueDialogComponent);
  }

  showModalExcluiProduto(content, produto){
    this.produtoSelecionado = produto;

    this.modalService.open(content, {
      windowClass: 'modal-compra'
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteProduto(){
    this.modalService.dismissAll();    
    this.servicoService.deleteProduto(this.produtoSelecionado.id).subscribe((result:any) => {      
      this.carregaListaProdutos();
    });
  }
}
