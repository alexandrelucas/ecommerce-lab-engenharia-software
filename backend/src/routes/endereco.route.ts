import express from 'express';
import fachada from '../instanciaFachada';
import Endereco from '../model/entidade/endereco.model';

const EnderecoRouter = express.Router();

/* ##### ENDEREÇO #####  */
//Consultar endereços por Id cliente
EnderecoRouter.get('/:id/endereco', async (req, res) => {
    let clienteId = parseInt(req.params.id);
    let endereco = (await fachada.consultar(new Endereco(null!, clienteId))) as Endereco[];
    res.json({status: 1, message: 'OK', endereco});
});

// Criar novo endereço
EnderecoRouter.post('/:id/endereco', async (req, res) => {
    let clienteId = parseInt(req.params.id);
    let endereco = Object.assign(new Endereco(null!, clienteId), req.body);
    let msg = await fachada.cadastrar(endereco) ?? 'OK';
    console.log(msg);
    res.json({status: msg ? 0:1, message: msg});
});

// Altera o endereço do cliente
EnderecoRouter.put('/endereco/:id', async (req, res) => {
    let id = parseInt(req.params.id);
    let endereco = Object.assign(new Endereco(id), req.body);
    let msg = await fachada.alterar(endereco) ?? 'OK';
    res.json({status: msg ? 0:1, message: msg});
});

// Excluir o endereço do cliente
EnderecoRouter.delete('/endereco/:id', async (req, res) => {
    let endereco = new Endereco();
    endereco.id = parseInt(req.params.id);
    res.json({status: 1, message: await fachada.excluir(endereco)});
});


export default EnderecoRouter;