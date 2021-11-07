import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';
import { Produto } from 'src/app/shared/models/produtos.model';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class ProdutosComponent implements OnInit {

  public categorias = []
  public paises = []
  displayedColumns: string[] = ['codigo', 'titulo', 'tipo', 'categoriaId', 'tempoGuarda', 'quantidadeML', 'paisId', 'acoes'];
  dataSource: MatTableDataSource<Produto>;

  constructor(
    private servicoService: SandBoxService
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
      console.log(result)
      this.carregaListaProdutos();
    });
  }

  carregaListaProdutos(){
    this.servicoService.getListaProdutos().subscribe((result:any) => {      
      this.dataSource = result.produtos;
    })
  }


  getPaisNome(paisId){
    return this.paises.filter(p => p.id == paisId)[0].descricao;
  }
  getCategoriaNome(categoriaId){
    return this.categorias.filter(c => c.id == categoriaId)[0].descricao;
  }
}
