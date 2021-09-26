import express from 'express';
import cors from 'cors';
import AuthRouter from './routes/auth.route';
import ClienteRouter from './routes/cliente.route';
import CupomRouter from './routes/cupom.route';
import PedidoRouter from './routes/pedido.route';

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
app.use((err:any, req:any, res:any, next:any) => {
    if (err instanceof SyntaxError) {
        return res.status(400).send({ status: 0, message: err.message }); // Bad request
    }
    next();
});

app.use('/cliente', ClienteRouter);
app.use('/pedido', PedidoRouter);
app.use('/cupom', CupomRouter);
app.use('/auth', AuthRouter);


app.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`);
});