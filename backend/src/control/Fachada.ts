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
    }
    private definirRegras() {
        this.listaRegras = new Map<string, IStrategy[]>();

        // Strategys Cliente
        let validarCPF = new ValidarCPF();
        let validarDataNasc = new ValidarDataNasc();
        let validarExistencia = new ValidarExistenciaCliente();
        let validarDadosObrigatorios = new ValidarDadosObrigatorios();
        this.listaRegras.set('Cliente', [validarCPF, validarDataNasc, validarDadosObrigatorios]);


        // Strategys Cartão
        let validarCartao = new ValidarCartao();
        this.listaRegras.set('Cartao', [validarCartao]);

        // Strategys Endereço
        let validarEndereco = new ValidarEndereco();
        this.listaRegras.set('Endereco', [validarEndereco]);
    }
    executarRegras(entidade: EntidadeDominio): string[] {
        let nomeClasse = entidade.constructor.name;
        let listaMsg: string[];

        if(this.listaRegras) {
           this.listaRegras.get(nomeClasse)?.forEach(async (s) => {
              let m = s.processar(entidade);

              if(m) {
                  if(!listaMsg) listaMsg = new Array<string>();
                  listaMsg.push(m); 
              }
           });
        }
        return listaMsg!;
    }

    async cadastrar(entidade: EntidadeDominio):  Promise<string[]> {
        let nomeClasse = entidade.constructor.name;
        let mensagemRegras = this.executarRegras(entidade);
        
        if(mensagemRegras) {
            return mensagemRegras;
        }

        let clienteNovo = await this.listaDaos?.get(nomeClasse)?.salvar(entidade);
        return [clienteNovo?.id?.toString() ?? null!];
    }
    async alterar(entidade: EntidadeDominio): Promise<string[]> {
        let nomeClasse = entidade.constructor.name;
        let mensagemRegras = this.executarRegras(entidade);


        if(mensagemRegras) {
            // return mensagemRegras;
        }

        await this.listaDaos?.get(nomeClasse)?.alterar(entidade);
        return null!;
    }
    async excluir(entidade: EntidadeDominio): Promise<string> {        
        let nomeClasse: string = entidade.constructor.name;
        let hasDeleted = await this.listaDaos?.get(nomeClasse)?.excluir(entidade);
        return hasDeleted ? 'Excluido com sucesso!' : 'Erro ao excluir';
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