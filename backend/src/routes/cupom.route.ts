import express from "express";
import Cupom from "../model/entidade/cupom.model";
import fachada from '../instanciaFachada';

const CupomRouter = express.Router();

// Validar cupom
CupomRouter.get('/validar', async (req, res) => {
    let codigo = req.query.codigo;

    let cupom = {
        id: 1,
        codigo: 'VINO2021',
        valorDesconto: 20,
        tipoCupom: 'Primeira compra'
    } as Cupom;
    
    if(cupom.codigo == codigo) {
        res.send({
            status: 1,
            message: 'Cupom válido',
            cupomId: cupom.id,
            codigo: cupom.codigo,
            tipoCupom: cupom.tipoCupom,
            valorDesconto: cupom.valorDesconto
        });
    } else {
        res.send({
            status: 0,
            message: 'Cupom inválido'
        });
    }

    
});

// Lista todos os cupoms
CupomRouter.get('/todos', async (req, res) => {
    res.send({message: 'OK'})
});

// Cadastra novo cupom
CupomRouter.post('/', async (req, res) => {
    res.send({message: 'Cupom cadastrado com sucesso!'})
});

// Altera cupom
CupomRouter.put('/:id', async (req, res) => {
    res.send({message: 'Cupom alterado com sucesso!'})
});

// Exclui cupom
CupomRouter.delete('/:id', async (req, res) => {
    res.send({message: 'Cupom excluído com sucesso!'})
});

export default CupomRouter;