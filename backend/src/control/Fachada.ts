import EntidadeDominio from '../model/entidade/entidadeDominio.model';
import IFachada from './IFachada';
import IDAO from '../model/dao/IDAO';
import IStrategy from '../model/strategy/IStrategy';

import EnderecoDAO from '../model/dao/enderecoDAO';
import CartaoDAO from '../model/dao/cartaoDAO';
import ClienteDAO from '../model/dao/clienteDao';
import ValidarCPF from '../model/strategy/cliente/ValidarCPF';
import ValidarDataNasc from '../model/strategy/cliente/ValidarDataNasc';
import ValidarExistenciaCliente from '../model/strategy/cliente/ValidarExistenciaCliente';
import ValidarDadosObrigatorios from '../model/strategy/cliente/ValidarDadosObrigatórios';
import ValidarCartao from '../model/strategy/cartao/ValidarCartao';
import ValidarEndereco from '../model/strategy/endereco/validarEndereco';
import CupomDAO from '../model/dao/cupomDAO';
import PaisDAO from '../model/dao/paisDAO';
import TipoDAO from '../model/dao/tipoDao';
import ProdutoDAO from '../model/dao/produtoDAO';
import PedidoDAO from '../model/dao/pedidoDAO';
import EstoqueDAO from '../model/dao/estoqueDAO';
import CategoriaDAO from '../model/dao/categoriaDAO';
import PagamentoDAO from '../model/dao/pagamentoDAO';
import VendaDAO from '../model/dao/vendaDAO';
import PedidoProdutoDAO from '../model/dao/pedidoProdutoDAO';
import PagamentoCartoesDAO from '../model/dao/pagamentoCartoesDAO';
import CupomClienteDAO from '../model/dao/cupomClienteDAO';

export default class Fachada implements IFachada {

    listaDaos?: Map<string, IDAO>;
    listaRegras?: Map<string, IStrategy[]>;

    constructor() {
        this.definirDAOS();
        this.definirRegras();
    }

    private definirDAOS() {
        this.listaDaos = new Map<string, IDAO>();
        this.listaDaos.set('Cliente', new ClienteDAO());
        this.listaDaos.set('Endereco', new EnderecoDAO());
        this.listaDaos.set('Cartao', new CartaoDAO());
        this.listaDaos.set('Cupom', new CupomDAO());
        this.listaDaos.set('Pais', new PaisDAO());
        this.listaDaos.set('TipoEndereco', new TipoDAO());
        this.listaDaos.set('TipoLogradouro', new TipoDAO());
        this.listaDaos.set('TipoResidencia', new TipoDAO());
        this.listaDaos.set('TipoTelefone', new TipoDAO());
        this.listaDaos.set('Produto', new ProdutoDAO());
        this.listaDaos.set('Categoria', new CategoriaDAO());
        this.listaDaos.set('Pedido', new PedidoDAO());
        this.listaDaos.set('Estoque', new EstoqueDAO());
        this.listaDaos.set('Pagamento', new PagamentoDAO());
        this.listaDaos.set('Venda', new VendaDAO());
        this.listaDaos.set('PedidoProduto', new PedidoProdutoDAO());
        this.listaDaos.set('PagamentoCartoes', new PagamentoCartoesDAO());
        this.listaDaos.set('CupomCliente', new CupomClienteDAO());
    }
    private definirRegras() {
        this.listaRegras = new Map<string, IStrategy[]>();

        // Strategys Cliente
        let validarCPF = new ValidarCPF();
        let validarDataNasc = new ValidarDataNasc();
        let validarExistencia = new ValidarExistenciaCliente();
        let validarDadosObrigatorios = new ValidarDadosObrigatorios();
        
        this.listaRegras.set('Cliente', [
            validarDadosObrigatorios,
            validarDataNasc, 
            validarCPF,
            validarExistencia,
        ]);

        // Strategys Cartão
        let validarCartao = new ValidarCartao();
        this.listaRegras.set('Cartao', [validarCartao]);

        // Strategys Endereço
        let validarEndereco = new ValidarEndereco();
        this.listaRegras.set('Endereco', [validarEndereco]);
    }
    async executarRegras(entidade: EntidadeDominio, altera: boolean): Promise<string> {
        let nomeClasse = entidade.constructor.name;
        let msg: string = 'Erro na execução das regras';

        if(!this.listaRegras?.has(nomeClasse)) return null!;

        for(const s of this.listaRegras!.get(nomeClasse)!) {
            msg = await s.processar(entidade, altera);
            if(msg != null) break;
        }
        return msg;
    }

    async cadastrar(entidade: EntidadeDominio):  Promise<string> {
        let nomeClasse = entidade.constructor.name;
        let mensagemRegras = await this.executarRegras(entidade, false);
        if(mensagemRegras) {
            return mensagemRegras;
        }

        let clienteNovo = await this.listaDaos?.get(nomeClasse)?.salvar(entidade)!;

        if(clienteNovo.error) {
            return clienteNovo.error!;
        }


        return clienteNovo?.id?.toString()!;
    }
    async alterar(entidade: EntidadeDominio): Promise<string> {
        let nomeClasse = entidade.constructor.name;
        let mensagemRegras = await this.executarRegras(entidade, true);

        console.log(nomeClasse);

        if(mensagemRegras) {
            return mensagemRegras;
        }

        let result = await this.listaDaos?.get(nomeClasse)?.alterar(entidade);
        
        if(result?.error) {
            return result.error!;
        }
        return null!;
    }
    async excluir(entidade: EntidadeDominio): Promise<string> {        
        let nomeClasse: string = entidade.constructor.name;
        let hasDeleted = await this.listaDaos?.get(nomeClasse)?.excluir(entidade);
        return hasDeleted ? null! : 'Não foi possível excluir';
    }
    async consultar(entidade: EntidadeDominio): Promise<EntidadeDominio[]> {
        let nomeClasse: string = entidade.constructor.name;
        return await this.listaDaos?.get(nomeClasse)?.consultar(entidade) ?? [];
    }

    async alterarSenha(entidadeDominio: EntidadeDominio) : Promise<string> {
        return (this.listaDaos?.get('Cliente') as ClienteDAO).alterarSenha(entidadeDominio);
    }
    async alterarClienteStatus(entidadeDominio: EntidadeDominio) : Promise<string> {
        return (this.listaDaos?.get('Cliente') as ClienteDAO).alterarStatus(entidadeDominio);
    }

    async login(entidade: EntidadeDominio) : Promise<string> {
        return (this.listaDaos?.get('Cliente') as ClienteDAO).login(entidade);
    }

}