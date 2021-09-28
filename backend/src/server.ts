import express from 'express';
import cors from 'cors';
import AuthRouter from './routes/auth.route';
import ClienteRouter from './routes/cliente.route';
import CupomRouter from './routes/cupom.route';
import PedidoRouter from './routes/pedido.route';
import PaisRouter from './routes/pais.route';
import TipoRouter from './routes/tipos.route';
import ProdutoRouter from './routes/produto.route';
import EstoqueRouter from './routes/estoque.route';
import VendaRouter from './routes/vendas.route';

const app = express();
const port = 3000;

app.use(cors());
app.use('/', express.urlencoded({extended: true}));
app.use('/', express.json());

// Header
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  });
// Parser
app.use((err:any, req:any, res:any, next:any) => {
    if (err instanceof SyntaxError) {
        return res.status(400).send({ status: 1, message: err.message });
    }
    next();
});

app.use('/cliente', ClienteRouter);
app.use('/pedido', PedidoRouter);
app.use('/cupom', CupomRouter);
app.use('/auth', AuthRouter);
app.use('/pais', PaisRouter);
app.use('/tipo', TipoRouter);
app.use('/produto', ProdutoRouter);
app.use('/estoque', EstoqueRouter);
app.use('/venda', VendaRouter);


app.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`);
});