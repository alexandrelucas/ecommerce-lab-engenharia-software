import IDAO from './IDAO';
import EntidadeDominio from '../entidade/entidadeDominio.model';
import PgDatabase from '../../db.config';
import Cliente from '../entidade/cliente.model';
import { Encrypt } from '../../utils/encrypt';

export default class ClienteDAO implements IDAO {
    tabela: string = 'clientes';
   
    async salvar(entidade: EntidadeDominio): Promise<EntidadeDominio> {
        if(entidade.hasId()) return null!;
        try {
            let cliente = entidade as Cliente;
            delete cliente.id;
            console.log(cliente);
            cliente.senha = await Encrypt.cryptPassword(cliente.senha!);
            let colunas = Object.keys(cliente).map((e) => `"${e}"`).reduce((prev, cur) => `${prev} , ${cur}`);
            let valores = Object.values(cliente).map((v) => `'${v}'`).reduce((prev, cur) => `${prev} , ${cur}`);
            let query = `INSERT INTO ${this.tabela} (${colunas}) VALUES (${valores}) RETURNING id`;
            let id = await PgDatabase.query(query);
            cliente.id = id.rows[0].id;
            return cliente;
        } catch (err: any) {
            return {error: 'ClienteDAO.salvar(): ' + err.toString()} as EntidadeDominio;
        }
    }
    async alterar(entidade: EntidadeDominio): Promise<EntidadeDominio> {
        if(!entidade.hasId()) return null!;

        let cliente = entidade as Cliente;
        delete cliente.senha;

        let dadosSQL = Object.entries(cliente).map((key, value) => {
            return `"${key[0]}" = '${key[1]}'`;
        }).reduce((pVal, cVal) => {
            return `${pVal} , ${cVal}`;
        });
        
        try {
            let query = await PgDatabase.query(`UPDATE ${this.tabela} SET ${dadosSQL} WHERE id = ${cliente.id}`);
            if(query.rowCount == 1) {
                return cliente;
            }
            return {error: 'Cliente inexistente'} as EntidadeDominio;
            
        } catch (err: any) {
            return {error: 'ClienteDAO.alterar(): ' + err.toString()} as EntidadeDominio;
        }
    }
    async excluir(entidade: EntidadeDominio): Promise<boolean> {
        if(entidade.hasId()) {
            let cliente = await PgDatabase.query(`DELETE FROM ${this.tabela} WHERE id = ${entidade.id}`);
            if(cliente.rowCount == 1) {
                return true;
            }
        }
        return false;
    }
    async consultar(entidade: EntidadeDominio) : Promise<Array<EntidadeDominio>> {
        let colunas:any = ['id', 'nome', 'email', 'dataNasc', 'cpf', 'tipoTelefoneId', 'telefone', 'sexo', 'email', 'inativado', 'classificacao'];
        colunas = colunas.map((e: string) => `"${e}"`).reduce((prev: string, cur: string) => `${prev} , ${cur}`);
        let query;
        let cliente = entidade as Cliente;

        if(cliente.cpf) {
            query = `SELECT ${colunas} FROM ${this.tabela} WHERE "cpf"='${cliente.cpf}';`;
        } else {
            query = entidade.hasId() ? `SELECT ${colunas} FROM ${this.tabela} WHERE id=${entidade.id}` : `SELECT ${colunas} FROM ${this.tabela} order by id`; 
        }
        console.log(query)

        try {
            let listaClientes = await PgDatabase.query(query);              
            console.log(listaClientes);
            let result:Array<EntidadeDominio> = listaClientes.rows;
            return result ?? [];    
        } catch(err: any) {
            return [];
        }
    }

    async alterarSenha(entidade: EntidadeDominio): Promise<string> {
        let cliente = entidade as Cliente;

        try {
            
            if(!cliente.senha || !cliente.novaSenha) return 'Senha atual ou nova senha não informada!';

            let query = `SELECT "senha" FROM ${this.tabela} WHERE id=${entidade.id};`;
            let senhaDoBanco: string = (await PgDatabase.query(query)).rows[0].senha;

            if(cliente.senha == cliente.novaSenha) {
                return 'A senha atual e a nova senha são identicas.';
            }
            
            if(await Encrypt.comparePassword(cliente.senha!,senhaDoBanco)) {
                let novaSenhaCriptografada = await Encrypt.cryptPassword(cliente.novaSenha!);
                let queryUPDATE = `UPDATE ${this.tabela} SET "senha" = '${novaSenhaCriptografada}' WHERE "id"='${cliente.id}';`;
                await PgDatabase.query(queryUPDATE);
                return null!;
            }

            return "A senha informada difere da senha cadastrada!";

        } catch (err: any) {
            return 'ClienteDAO.alterarSenha(): ' + err.toString();
        }
    }

    async alterarStatus(entidade: EntidadeDominio): Promise<string> {
        try {
            let cliente = entidade as Cliente;
            let queryUPDATE = `UPDATE ${this.tabela} SET "inativado" = '${cliente.inativado}' WHERE "id"='${cliente.id}';`;
            await PgDatabase.query(queryUPDATE);
            return null!;
        } catch (err: any) {
            return 'ClienteDAO.alterarStatus(): ' + err.toString();
        }
    }

    async login(entidade: EntidadeDominio): Promise<string> {
        try {
            let cliente = entidade as Cliente;
            
            let query = `SELECT "senha", "id" FROM ${this.tabela} WHERE email='${cliente.email}' AND inativado='false';`;
            let resultado:any = (await PgDatabase.query(query)).rows[0];
            let senhaDoBanco: string = resultado.senha;

            console.log(resultado);

            if(await Encrypt.comparePassword(cliente.senha!, senhaDoBanco)) {
                return resultado.id;
            }

        } catch (err: any) {
            return 'ClienteDAO.login(): ' + err.toString();
        }

        return null!;
    }
}