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
  public paises:any = [];
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
  public cores = [
    { borderColor: '#00BFFF', backgroundColor: '#00BFFF'}, //AR
    { borderColor: '#20c997', backgroundColor: '#20c997'}, //BR
    { borderColor: '#FF8C00', backgroundColor: '#FF8C00'}, //ES
    { borderColor: '#00008B', backgroundColor: '#00008B'}, //FR
    { borderColor: '#FF0000', backgroundColor: '#FF0000'}, //IT
    { borderColor: '#006400', backgroundColor: '#006400'}  //PT             
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
        let receitaVendasMes = currencyFormat.format(result.result.receitaVendasMes);
        this.cards[2].valorIni = receitaVendas;
        this.cards[2].valorFin = receitaVendasMes; 
        
        // Lucro Total
        let lucroFormat = currencyFormat.format(result.result.lucros);
        let lucroMesFormat = currencyFormat.format(result.result.lucrosMes);
        this.cards[3].valorIni = lucroFormat; 
        this.cards[3].valorFin = lucroMesFormat; 
      }
    });
  }

  getListaPaises(){
    this.servicoService.getListaPaises().subscribe((result:any) => {
      this.paises = result.paises; 
      this.setColors();
    });
  }

  setColors(){
    for(let i = 0; i < this.paises.length; i++){      
      this.paises[i].borderColor = this.cores[i].borderColor
      this.paises[i].backgroundColor = this.cores[i].backgroundColor
    }
  }

  getPaisNome(paisId){
    return this.paises.filter(p => p.id == paisId)[0]?.descricao;
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
    let filtros = {
      pais : this.filtroPais.value ?? [],
      categoria : this.filtroCategoria.value ?? [],
      tempoGuarda : this.filtroGuarda.value ?? [],
      tipo : this.filtroTipo.value ?? [],
      dataInicio : moment(this.range.value.start).format('YYYY-MM-DD').replace('Invalid date', ''),
      dataFim : moment(this.range.value.end).format('YYYY-MM-DD').replace('Invalid date', ''),
    }
      
    //GET DADOS DB
    this.servicoService.filtrarGrafico(filtros).subscribe((result: any) => {
      this.preparaDadosDB(result, filtros);      
    });
  }
  
  //AJUSTA RETORNO DO DB E MONTA DADOS PARA O GRAFICO
  preparaDadosDB(resultDB, filtro){
    let eixoX = Object.keys(resultDB.result);
    

    //VERIFICA TIPO DE AGRUPAMENTO
    let dInicio = moment(this.range.value.start)
    let dFim = moment(this.range.value.end)        
    let meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    let intervalo = dFim.diff(dInicio, 'days')
    let eixoXX = []

    if(intervalo <= 31){
      this.paises.forEach(p => {
        p.data = [];
        Object.keys(resultDB.result).forEach(filtro => {
          resultDB.result[filtro].filter(dia => dia.pais == p.descricao).length ? 
            p.data.push(parseInt(resultDB.result[filtro].filter(dia => dia.pais == p.descricao)[0].total)) : p.data.push(0)          
        })
      })
    }

    // Arrumar depois ... ou não
    if(intervalo > 31 && eixoX[1] != '2021'){
      eixoX.forEach(eixo => { eixoXX.push(meses[parseInt(eixo)-1]) })
      eixoX = eixoXX;

      this.paises.forEach(p => {
        p.data = [];
        Object.keys(resultDB.result).forEach(filtro => {
          console.log(resultDB.result[filtro])
          let cont = 0;
          resultDB.result[filtro].forEach(f => {
            f.pais == p.descricao ? cont += parseInt(f.total): 0            
          })
          p.data.push(cont)      
        })
      })
    }

    //Intervalo ANO
    if(eixoX[1] == '2021'){
      this.paises.forEach(p => {
        p.data = [];
        Object.keys(resultDB.result).forEach(filtro => {
          console.log(resultDB.result[filtro])
          let cont = 0;
          resultDB.result[filtro].forEach(f => {
            f.pais == p.descricao ? cont += parseInt(f.total): 0            
          })
          p.data.push(cont)      
        })
      })
    }
    
    //AJUSTA OBJETO DE DADOS PARA O PONTOS DO GRAFICO
    let dados:any = []
    this.paises.forEach(p => {        
      dados.push({ label : p.descricao, borderColor : p.borderColor, backgroundColor : p.backgroundColor, data : p.data })
    });

    //EXECUTA FILTRO DE PAISES SELECIONADOS    
    if(filtro.pais.length){
      const dadosFiltrados = []
      dados.forEach(d => {
        filtro.pais.findIndex(f => this.getPaisNome(f) == d.label) != -1 ? dadosFiltrados.push(d) : 0
      });

      dados = dadosFiltrados;
    }    

    //ATUALIZA GRAFICO    
    this.updateChart(this.chart, eixoX, dados)
  }

  updateChart(chart, eixoX, dados) {
    chart.data.labels = eixoX;    
    chart.data.datasets = [];
    for(let i = 0; i < dados.length; i++){
      chart.data.datasets.push(dados[i])
    }
    chart.update();
  }
}
