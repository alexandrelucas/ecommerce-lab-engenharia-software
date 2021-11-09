import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
Chart.register(...registerables);
import * as moment from 'moment';
import DashboardDados from 'src/app/shared/models/dashboard.model';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('vendas', {static: true}) vendas: ElementRef;
  @ViewChild('trocas', {static: true}) trocas: ElementRef;
      
  public chart: Chart;
  public paises = [];
  public categorias = [];
  public tempoGuarda = [2, 3, 4, 5, 6];
  public tipo = ['Tinto', 'Branco'];
  public filtroGrafico = []
  public cards = [
    { icon: 'fas fa-shopping-cart', background: 'A', title: 'Pedidos recebidos', valorIni: '486', subTitle: 'Pedidos concluídos', valorFin: '351' },
    { icon: 'fas fa-tags', background: 'B', title: 'Vendas totais', valorIni: '1641', subTitle: 'Este mês', valorFin: '213' },
    { icon: 'fas fa-retweet', background: 'C', title: 'Receita', valorIni: 'R$ 12.532,00', subTitle: 'Este mês', valorFin: 'R$ 5.032' },
    { icon: 'fas fa-coins', background: 'D', title: 'Lucro total', valorIni: 'R$ 6.562,00', subTitle: 'Este mês', valorFin: 'R$ 542' },
  ]

  filtroPais = new FormControl();
  filtroCategoria = new FormControl();
  filtroTipo = new FormControl();
  filtroGuarda = new FormControl();
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(
    private formBuilder: FormBuilder,
    private servicoService: SandBoxService
  ) { }

  ngOnInit(): void {
    this.getDadosDashBoard();
    this.getListaPaises();
    this.getListaCategorias(); 
    this.gerarGraficoVendas();
    this.gerarGraficoPesquisa();    
  }

  getDadosDashBoard() {
    this.servicoService.getDashboard().subscribe((result: any) => {
      if(result.result) {
        const currencyFormat = Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'});

        // Pedidos recebidos
        this.cards[0].valorIni = result.result.totalPedidos;
        this.cards[0].valorFin = result.result.totalPedidosConcluidos;

        // Vendas Totais
        this.cards[1].valorIni = `${result.result.numeroVendas}`; 
        this.cards[1].valorFin = `${result.result.numeroVendasMes}`; 
        
        
        // Receita
        let receitaVendas = currencyFormat.format(result.result.receitaVendas);
        this.cards[2].valorIni = receitaVendas;
        this.cards[2].valorFin = `${result.result.receitaVendasMes}`; 
        
        // Lucro Total
        let lucroFormat = currencyFormat.format(result.result.lucros);
        this.cards[3].valorIni = lucroFormat; 
        this.cards[3].valorFin = `${result.result.lucrosMes}`; 
      }
    });
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
    this.chart = new Chart(this.vendas.nativeElement, {
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
    console.log(moment(this.range.value.start).format('YYYY-MM-DD').replace('Invalid date', ''))
    console.log(moment(this.range.value.end).format('YYYY-MM-DD').replace('Invalid date', ''))

    let filtro = {
      pais : this.filtroPais.value ?? [],
      categoria : this.filtroCategoria.value ?? [],
      tempoGuarda : this.filtroGuarda.value ?? [],
      tipo : this.filtroTipo.value ?? [],
      dataInicio : moment(this.range.value.start).format('YYYY-MM-DD').replace('Invalid date', ''),
      dataFim : moment(this.range.value.end).format('YYYY-MM-DD').replace('Invalid date', ''),
    }

    console.log(filtro);
      
    this.servicoService.filtrarGrafico(filtro).subscribe((result: any) => {
      
      //console.log(Object.keys(result.result))

      let eixoX = Object.keys(result.result);
      //this.filtroGrafico = result.resultado;

      this.paises.forEach(p => { 
        console.log(p)
        console.log(result.result);
      })
      

      this.atualizandoDadosGrafico();
    });
  }

  atualizandoDadosGrafico(){
    let eixoX = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio"];
    let datasets = [
      {
        label: 'Portugues',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [29, 41, 56, 34, 36],
      },
      {
        label: 'Frances',
        borderColor: '#FFCC00',
        backgroundColor: '#FFCC00',
        data: [26, 38, 31, 19, 56],
      },
    ]

    this.addData(this.chart, eixoX, datasets)
  }

  addData(chart, label, dataSet) {    
    chart.data.labels = label;    
    chart.data.datasets = dataSet;   
    chart.update();
  }
}

