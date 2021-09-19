import express from 'express';
import Cliente from '../model/entidade/cliente.model';
import fachada from '../instanciaFachada';
import EnderecoRouter from './endereco.route';
import CartaoRouter from './cartao.route';

const ClienteRouter = express.Router();

// Lista de Clientes
ClienteRouter.get('/todos', async (req, res) => {
    let listaClientes = await fachada.consultar(new Cliente()) as Array<Cliente>;
    res.json({status: 1, message: 'OK', listaClientes});
});

// Consulta de cliente por id
ClienteRouter.get('/:id', async (req, res) => {
    let id = parseInt(req.params.id);
    let cliente = (await fachada.consultar(new Cliente(id)))[0] as Cliente;
    res.json({status: 1, message: 'OK', cliente});
});

ClienteRouter.post('/', async (req, res) => {
    let cliente = Object.assign(new Cliente(), req.body);
    let msg = await fachada.cadastrar(cliente) ?? 'OK';
    res.json({status: msg ? 0:1, message: msg});
});

// Altera os dados do cliente
ClienteRouter.put('/:id', async (req, res) => {
    let id = parseInt(req.params.id);

    let cliente = Object.assign(new Cliente(id), req.body);
    let msg = await fachada.alterar(cliente) ?? 'OK';
    res.json({status: msg ? 0:1, message: msg});
});

// Excluir o cliente
ClienteRouter.delete('/:id', async (req, res) => {
    let cliente = new Cliente();
    cliente.id = parseInt(req.params.id);
    res.json({status: 1, message: await fachada.excluir(cliente)});
});

/* ##### ALTERAR SENHA #####  */
ClienteRouter.post('/:id/alterar-senha', async (req, res) => {
    let id = parseInt(req.params.id);
    let cliente: Cliente = Object.assign(new Cliente(id), req.body);
    let msg = await fachada.alterarSenha(cliente) ?? 'Ocorreu um problema desconhecido!';
    res.json({status: msg ? 1:0, message: msg});
});

/* ##### ALTERAR STATUS ATIVO INATIVO #####  */
ClienteRouter.post('/:id/alterar-status', async (req, res) => {
    let id = parseInt(req.params.id);
    let cliente: Cliente = Object.assign(new Cliente(id), req.body);
    let msg = await fachada.alterarClienteStatus(cliente) ?? 'Ocorreu um problema desconhecido!';
    res.json({status: msg ? 1:0, message: msg});
});


// Endereço Rota
ClienteRouter.use(EnderecoRouter);

// Cartão Rota
ClienteRouter.use(CartaoRouter);


export default ClienteRouter;