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
            status: 0,
            message: 'Cupom válido',
            cupomId: cupom.id,
            codigo: cupom.codigo,
            tipoCupom: cupom.tipoCupom,
            valorDesconto: cupom.valorDesconto
        });
    } else {
        res.send({
            status: 1,
            message: 'Cupom inválido'
        });
    }

    
});

// Lista todos os cupoms
CupomRouter.get('/todos', async (req, res) => {
    try {
        let listaCupons = await fachada.consultar(new Cupom()) as Array<Cupom>;
        res.status(200).json({status: 0, message: 'OK', listaCupons});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString(),
        })
    }
});

// Cadastra novo cupom
CupomRouter.post('/', async (req, res) => {
    try {
        let cupom = Object.assign(new Cupom(), req.body);
        let msg = await fachada.cadastrar(cupom);
        res.status(200).json({status: msg ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

// Altera cupom
CupomRouter.put('/:id', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let cupom = Object.assign(new Cupom(id), req.body);
        let msg = await fachada.alterar(cupom) ?? 'OK';
        res.status(200).json({status: msg ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

// Exclui cupom
CupomRouter.delete('/:id', async (req, res) => {
    try {
        let cupom = new Cupom();
        cupom.id = parseInt(req.params.id);
        let msg = await fachada.excluir(cupom);
        res.status(200).json({status: msg ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

export default CupomRouter;