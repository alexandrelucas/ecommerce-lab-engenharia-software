CREATE TABLE public."administrador"
(
    id serial NOT NULL,
    login character varying(255) NOT NULL,
    senha character varying(255) NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE public."administrador"
    OWNER to postgres;

CREATE TABLE public."tipoTelefone"
(
    id serial NOT NULL,
    descricao character varying(30) NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE public."tipoTelefone"
    OWNER to postgres;

CREATE TABLE public."tipoLogradouro"
(
    id serial NOT NULL,
    descricao character varying(30) NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE public."tipoLogradouro"
    OWNER to postgres;

CREATE TABLE public."tipoEndereco"
(
    id serial NOT NULL,
    descricao character varying(30) NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE public."tipoEndereco"
    OWNER to postgres;

CREATE TABLE public."tipoResidencia"
(
    id serial NOT NULL,
    descricao character varying(30) NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE public."tipoResidencia"
    OWNER to postgres;

CREATE TABLE public."pais"
(
    id serial NOT NULL,
    sigla character varying(2) NOT NULL,
    descricao character varying(255) NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE public."pais"
    OWNER to postgres;

CREATE TABLE public."clientes"
(
    id serial NOT NULL,
    nome character varying(50) NOT NULL,
    cpf character varying(14) NOT NULL,
    telefone character varying(20) NOT NULL,
    sexo character varying(1) NOT NULL,
    "dataNasc" date NOT NULL,
    email character varying(255) NOT NULL,
    senha character varying(255) NOT NULL,
    inativado boolean NOT NULL DEFAULT FALSE,
    classificacao integer NOT NULL DEFAULT 5,
    "tipoTelefoneId" integer,
    PRIMARY KEY (id),
    CONSTRAINT "FK_CLI_TPTEL" FOREIGN KEY ("tipoTelefoneId")
        REFERENCES public."tipoTelefone" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE public."clientes"
    OWNER to postgres;

CREATE TABLE public."cartoesCredito"
(
    id serial NOT NULL,
    "nomeTitular" character varying(255) NOT NULL,
    numero character varying(32) NOT NULL,
    cvv character varying(4) NOT NULL,
    "dataValidade" character varying(20) NOT NULL,
    "clienteId" integer NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT "FK_CC_CLI" FOREIGN KEY ("clienteId")
        REFERENCES public."clientes" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE public."cartoesCredito"
    OWNER to postgres;

CREATE TABLE public."enderecos"
(
    id serial NOT NULL,
    cep character varying(10) NOT NULL,
    logradouro character varying(255) NOT NULL,
    numero character varying(30) NOT NULL,
    bairro character varying(50) NOT NULL,
    complemento character varying(30) NOT NULL,
    cidade character varying(255) NOT NULL,
    descricaoEndereco character varying(255) NOT NULL,
    uf character varying(2) NOT NULL,
    "tipoEnderecoId" integer NOT NULL,
    "tipoResidenciaId" integer NOT NULL,
    "tipoLogradouroId" integer NOT NULL,
    "paisId" integer NOT NULL,
    "clienteId" integer NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT "FK_END_TPEND" FOREIGN KEY ("tipoEnderecoId")
        REFERENCES public."tipoEndereco" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "FK_END_TPLOG" FOREIGN KEY ("tipoLogradouroId")
        REFERENCES public."tipoLogradouro" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "FK_END_TPRES" FOREIGN KEY ("tipoResidenciaId")
        REFERENCES public."tipoResidencia" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "FK_END_PAIS" FOREIGN KEY ("paisId")
        REFERENCES public."pais" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "FK_END_CLI" FOREIGN KEY ("clienteId")
        REFERENCES public."clientes" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE public."enderecos"
    OWNER to postgres;

CREATE TABLE public."categorias"
(
    id serial NOT NULL,
    descricao character varying(50) NOT NULL,
    "margemLucro" double precision NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE public."categorias"
    OWNER to postgres;

CREATE TABLE public."produtos"
(
    id serial NOT NULL,
    codigo character varying(25) NOT NULL,
    titulo character varying(50) NOT NULL,
    descricao character varying(255) NOT NULL,
    imagem character varying(255) NOT NULL,
    "precoDe" double precision NOT NULL,
    "precoPor" double precision,
    "quantidadeML" double precision,
    "tempoGuarda" integer,
    "teorAlcoolico" double precision,
    tipo character varying(255) NOT NULL,
    peso double precision NOT NULL,
    comprimento double precision NOT NULL,
    altura double precision NOT NULL,
    largura double precision NOT NULL,
    diametro double precision NOT NULL,
    formato character varying(255) NOT NULL,
    "paisId" integer NOT NULL,
    "categoriaId" integer NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT "FK_PRD_PAIS" FOREIGN KEY ("paisId")
        REFERENCES public."pais" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "FK_PRD_CAT" FOREIGN KEY ("categoriaId")
        REFERENCES public."categorias" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE public."produtos"
    OWNER to postgres;

CREATE TABLE public."cupons"
(
    id serial NOT NULL,
    "tipoCupom" character varying(255) NOT NULL,
    "valorDesconto" double precision NOT NULL,
    codigo character varying(255) NOT NULL,
    validade date NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE public."cupons"
    OWNER to postgres;

CREATE TABLE public."estoque"
(
    id serial NOT NULL,
    quantidade integer NOT NULL,
    fornecedor character varying(255) NOT NULL,
    "valorCusto" double precision NOT NULL,
    "dataEntrada" date NOT NULL,
    "produtoId" integer NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT "UN_EST_PRD_ID" UNIQUE ("produtoId"),
    CONSTRAINT "FK_EST_PRD" FOREIGN KEY ("produtoId")
        REFERENCES public."produtos" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE public."estoque"
    OWNER to postgres;

CREATE TABLE public."pagamentos"
(
    id serial NOT NULL,
    "dataPagamento" date NOT NULL,
    status integer NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE public."pagamentos"
    OWNER to postgres;

CREATE TABLE public."pagamentosCartoes"
(
    id serial NOT NULL,
    "pagamentoId" integer NOT NULL,
    "cartaoId" integer NOT NULL,
    valor double precision NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT "FK_PAG" FOREIGN KEY ("pagamentoId")
        REFERENCES public."pagamentos" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "FK_CARTAO" FOREIGN KEY ("cartaoId")
        REFERENCES public."cartoesCredito" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE public."pagamentosCartoes"
    OWNER to postgres;

CREATE TABLE public."pedidos"
(
    id serial NOT NULL,
    codigo character varying(255) NOT NULL,
    status integer NOT NULL DEFAULT 0,
    "valorFrete" double precision NOT NULL,
    transportadora character varying(255) NOT NULL,
    "valorSubTotal" double precision NOT NULL,
    "valorTotal" double precision NOT NULL,
    "cupomId" integer,
    "pagamentoId" integer NOT NULL,
    "enderecoId" integer NOT NULL,
    data date NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT "FK_PED_CUP" FOREIGN KEY ("cupomId")
        REFERENCES public."cupons" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "FK_PED_PAG" FOREIGN KEY ("pagamentoId")
        REFERENCES public."pagamentos" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
    CONSTRAINT "FK_PED_END" FOREIGN KEY ("enderecoId")
        REFERENCES public."enderecos" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE public."pedidos"
    OWNER to postgres;

CREATE TABLE public."pedidosProdutos"
(
    id serial NOT NULL,
    "pedidoId" integer NOT NULL,
    "produtoId" integer NOT NULL,
    valor double precision NOT NULL,
    quantidade integer NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT "FK_PED" FOREIGN KEY ("pedidoId")
        REFERENCES public."pedidos" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "FK_PRD" FOREIGN KEY ("produtoId")
        REFERENCES public."produtos" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE TABLE public."cuponsCliente"
(
    id serial NOT NULL,
    "cupomId" integer NOT NULL,
    "clienteId" integer NOT NULL,
    usado boolean NOT NULL DEFAULT false,
    PRIMARY KEY (id),
    CONSTRAINT "FK_CUP" FOREIGN KEY ("cupomId")
        REFERENCES public."cupons" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "FK_CLI" FOREIGN KEY ("clienteId")
        REFERENCES public."clientes" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE public."cuponsCliente"
    OWNER to postgres;


-- INSERTS NO BANCO

INSERT INTO public."tipoTelefone" (descricao) VALUES ('Celular');
INSERT INTO public."tipoTelefone" (descricao) VALUES ('Residencial');
INSERT INTO public."tipoTelefone" (descricao) VALUES ('Comercial');

INSERT INTO public."tipoEndereco" (descricao) VALUES ('Cobrança');
INSERT INTO public."tipoEndereco" (descricao) VALUES ('Entrega');

INSERT INTO public."tipoResidencia" (descricao) VALUES ('Casa');
INSERT INTO public."tipoResidencia" (descricao) VALUES ('Apartamento');
INSERT INTO public."tipoResidencia" (descricao) VALUES ('Comercial');
INSERT INTO public."tipoResidencia" (descricao) VALUES ('Empresa');

INSERT INTO public."tipoLogradouro" (descricao) VALUES ('Avenida');
INSERT INTO public."tipoLogradouro" (descricao) VALUES ('Estrada');
INSERT INTO public."tipoLogradouro" (descricao) VALUES ('Lote');
INSERT INTO public."tipoLogradouro" (descricao) VALUES ('Rodovia');
INSERT INTO public."tipoLogradouro" (descricao) VALUES ('Rua');
INSERT INTO public."tipoLogradouro" (descricao) VALUES ('Sítio');
INSERT INTO public."tipoLogradouro" (descricao) VALUES ('Travessa');
INSERT INTO public."tipoLogradouro" (descricao) VALUES ('Viaduto');
INSERT INTO public."tipoLogradouro" (descricao) VALUES ('Vila');

INSERT INTO public.pais (sigla, descricao) VALUES ('AR', 'Argentina');
INSERT INTO public.pais (sigla, descricao) VALUES ('BR', 'Brasil');
INSERT INTO public.pais (sigla, descricao) VALUES ('ES', 'Espanha');
INSERT INTO public.pais (sigla, descricao) VALUES ('FR', 'França');
INSERT INTO public.pais (sigla, descricao) VALUES ('IT', 'Itália');
INSERT INTO public.pais (sigla, descricao) VALUES ('PT', 'Portugal');