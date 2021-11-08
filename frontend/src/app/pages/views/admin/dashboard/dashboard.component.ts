import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import * as moment from 'moment';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('vendas', {static: true}) vendas: ElementRef;
  @ViewChild('trocas', {static: true}) trocas: ElementRef;
      
  public paises = [];
  public categorias = [];
  public tempoGuarda = [2, 3, 4, 5, 6]
  public tipo = ['Tinto', 'Branco']

  filtroPais = new FormControl();
  filtroCategoria = new FormControl();
  filtroTipo = new FormControl();
  filtroGuarda = new FormControl();
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  
  public chart: Chart;
  public vendasDeVinho = [
    { pais: 'PT', dataVenda: '2021-10-01', produtoId: 1, preco: 123.9 },
    { pais: 'PT', dataVenda: '2021-10-01', produtoId: 1, preco: 123.9 },
    { pais: 'PT', dataVenda: '2021-10-02', produtoId: 1, preco: 123.9 },
    { pais: 'PT', dataVenda: '2021-10-02', produtoId: 1, preco: 123.9 },
    { pais: 'PT', dataVenda: '2021-10-05', produtoId: 1, preco: 123.9 },
    { pais: 'PT', dataVenda: '2021-10-05', produtoId: 1, preco: 123.9 },
    { pais: 'PT', dataVenda: '2021-10-05', produtoId: 1, preco: 123.9 },
    { pais: 'PT', dataVenda: '2021-10-10', produtoId: 1, preco: 123.9 },
    { pais: 'CH', dataVenda: '2021-10-10', produtoId: 2, preco: 33.9 },
    { pais: 'CH', dataVenda: '2021-10-01', produtoId: 2, preco: 33.9 },
    { pais: 'CH', dataVenda: '2021-10-01', produtoId: 2, preco: 33.9 },
    { pais: 'CH', dataVenda: '2021-10-01', produtoId: 2, preco: 33.9 },
    { pais: 'CH', dataVenda: '2021-10-03', produtoId: 2, preco: 33.9 },
    { pais: 'CH', dataVenda: '2021-10-03', produtoId: 2, preco: 33.9 },
    { pais: 'CH', dataVenda: '2021-10-05', produtoId: 2, preco: 33.9 },
    { pais: 'FR', dataVenda: '2021-10-01', produtoId: 3, preco: 59.1 },
    { pais: 'FR', dataVenda: '2021-10-01', produtoId: 3, preco: 59.1 },
    { pais: 'FR', dataVenda: '2021-10-02', produtoId: 3, preco: 59.1 },
    { pais: 'FR', dataVenda: '2021-10-02', produtoId: 3, preco: 59.1 },
    { pais: 'FR', dataVenda: '2021-10-02', produtoId: 3, preco: 59.1 },
    { pais: 'FR', dataVenda: '2021-10-05', produtoId: 3, preco: 59.1 },
    { pais: 'FR', dataVenda: '2021-10-04', produtoId: 3, preco: 59.1 },
    { pais: 'FR', dataVenda: '2021-10-10', produtoId: 3, preco: 59.1 },
    { pais: 'FR', dataVenda: '2021-10-11', produtoId: 3, preco: 59.1 },
  ]  
  public cards = [
    { icon: 'fas fa-shopping-cart', background: 'A', title: 'Pedidos recebidos', valorIni: '486', subTitle: 'Pedidos concluídos', valorFin: '351' },
    { icon: 'fas fa-tags', background: 'B', title: 'Vendas totais', valorIni: '1641', subTitle: 'Este mês', valorFin: '213' },
    { icon: 'fas fa-retweet', background: 'C', title: 'Receita', valorIni: 'R$ 12.532,00', subTitle: 'Este mês', valorFin: 'R$ 5.032' },
    { icon: 'fas fa-coins', background: 'D', title: 'Lucro total', valorIni: 'R$ 6.562,00', subTitle: 'Este mês', valorFin: 'R$ 542' },
  ]

  constructor(
    private formBuilder: FormBuilder,
    private servicoService: SandBoxService
  ) { }

  ngOnInit(): void {
    this.getListaPaises();
    this.getListaCategorias(); 
    this.gerarGraficoVendas();
    this.gerarGraficoPesquisa();    
  } 

  getListaPaises(){
    this.servicoService.getListaPaises().subscribe((result:any) => {
      this.paises = result.paises;      
    });
  }

  getPaisNome(paisId){
    return this.paises.filter(p => p.id == paisId)[0].descricao;
  }

  getCategoriaNome(categoriaId){
    return this.categorias.filter(c => c.id == categoriaId)[0].descricao;
  }

  getListaCategorias(){
    this.servicoService.getListaCategorias().subscribe((result:any) => {
      this.categorias = result.categorias;      
    })
  }
  
  gerarGraficoVendas(){
    new Chart(this.vendas.nativeElement, {
      type: 'line',
      data: {
        labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro"],
        datasets: [
          {
            label: 'Portugues',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [32, 29, 35, 41, 56, 28, 34, 36, 29],
          }
        ]
      }
    });
  }

  gerarGraficoPesquisa(){
    new Chart(this.trocas.nativeElement, {
      type: 'doughnut',      
      data: {        
        labels: ["Excelente", "Muito Bom", "Regular", "Insatisfatório"],
        datasets: [
          {
            label: 'Vendas no período',
            data: [302, 100, 30, 12],  
            backgroundColor: [
              '#20c997',
              'rgb(54, 162, 235)',            
              'rgb(255, 205, 86)',
              'rgb(255, 99, 132)',
            ],            
            hoverOffset: 4
          }          
        ]        
      },
      options: {
        maintainAspectRatio: false,
      }
    });
  }

  filtrarGrafico(){
    // console.log(this.filtroPais.value)
    // console.log(this.filtroCategoria.value)
    // console.log(this.filtroTipo.value)
    // console.log(this.filtroGuarda.value)
    // console.log(moment(this.range.value.start).format('YYYY-MM-DD'))
    // console.log(moment(this.range.value.end).format('YYYY-MM-DD'))

    let filtro = {
      pais : this.filtroPais.value ?? [],
      categoria : this.filtroCategoria.value ?? [],
      tempoGuarda : this.filtroGuarda.value ?? [],
      tipo : this.filtroTipo.value ?? [],
      dataInicio : moment(this.range.value.start).format('YYYY-MM-DD'),
      dataFim : moment(this.range.value.end).format('YYYY-MM-DD'),
    }

    console.log(filtro)
  }
}

