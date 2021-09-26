import express from 'express';
import Cliente from '../model/entidade/cliente.model';
import fachada from '../instanciaFachada';
import EnderecoRouter from './endereco.route';
import CartaoRouter from './cartao.route';

const ClienteRouter = express.Router();

// Lista de Clientes
ClienteRouter.get('/todos', async (req, res) => {
    try {
        let listaClientes = await fachada.consultar(new Cliente()) as Array<Cliente>;
        res.status(200).json({status: 1, message: 'OK', listaClientes});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString(),
        })
    }
    
});

// Consulta de cliente por id
ClienteRouter.get('/:id', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let cliente = (await fachada.consultar(new Cliente(id)))[0] as Cliente;
        res.status(200).json({status: 1, message: 'OK', cliente});
    } catch (e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString(),
        })
    }
    
});

// Cadastrar os dados do cliente
ClienteRouter.post('/', async (req, res) => {
    try {
        let cliente = Object.assign(new Cliente(), req.body);
        let msg = await fachada.cadastrar(cliente) ?? 'OK';

        if(Number.parseInt(msg)) {
            res.status(200).json({status: 1, message: msg});
        } else {
            res.status(400).json({status: 0, message: msg});
        }

    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    } 
});

// Altera os dados do cliente
ClienteRouter.put('/:id', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let cliente = Object.assign(new Cliente(id), req.body);
        let msg = await fachada.alterar(cliente) ?? 'OK';
        res.status(200).json({status: msg ? 0:1, message: msg});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

// Excluir o cliente
ClienteRouter.delete('/:id', async (req, res) => {
    try {
        let cliente = new Cliente();
        cliente.id = parseInt(req.params.id);
        res.status(200).json({status: 1, message: await fachada.excluir(cliente)});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

/* ##### ALTERAR SENHA #####  */
ClienteRouter.post('/:id/alterar-senha', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let cliente: Cliente = Object.assign(new Cliente(id), req.body);
        let msg = await fachada.alterarSenha(cliente) ?? 'Ocorreu um problema desconhecido!';
        res.status(200).json({status: msg ? 1:0, message: msg});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

/* ##### ALTERAR STATUS ATIVO INATIVO #####  */
ClienteRouter.post('/:id/alterar-status', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let cliente: Cliente = Object.assign(new Cliente(id), req.body);
        let msg = await fachada.alterarClienteStatus(cliente) ?? 'Ocorreu um problema desconhecido!';
        res.status(200).json({status: msg ? 1:0, message: msg});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});


// Endereço Rota
ClienteRouter.use(EnderecoRouter);

// Cartão Rota
ClienteRouter.use(CartaoRouter);


export default ClienteRouter;