import mysql, { Connection, ConnectionOptions } from 'mysql2/promise';
import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
const app = fastify();
app.register(cors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

app.get('/produto', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const conn =  await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'bancomercado',
            port: 3306
        })
        const resultado =  await conn.query("SELECT * FROM produto")
        const [dados, camposTabela] = resultado
        reply.status(200).send(dados)
    }
    catch (erro: any) {
        if (erro.code === 'ECONNREFUSED') {
            console.log("ERRO: LIGUE O LARAGAO => Conexão Recusada")
            reply.status(400).send({mensagem:"ERRO: LIGUE O LARAGAO => Conexão Recusada"})
        } else if (erro.code === 'ER_BAD_DB_ERROR') {
            console.log("ERRO: CRIE UM BANCO DE DADOS COM O NOME DEFINIDO NA CONEXÃO")
            reply.status(400).send({mensagem:"ERRO: CRIE UM BANCO DE DADOS COM O NOME DEFINIDO NA CONEXÃO"})
        } else if (erro.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log("ERRO: CONFERIR O USUÁRIO E SENHA DEFINIDOS NA CONEXÃO")
            reply.status(400).send({mensagem:"ERRO: CONFERIR O USUÁRIO E SENHA DEFINIDOS NA CONEXÃO"})
        } else if (erro.code === 'ER_NO_SUCH_TABLE') {
            console.log("ERRO: Você deve criar a tabela com o mesmo nome da sua QUERY")
            reply.status(400).send({mensagem:"ERRO: Você deve criar a tabela com o mesmo nome da sua QUERY"})
        } else if (erro.code === 'ER_PARSE_ERROR') {
            console.log("ERRO: Você tem um erro de escrita em sua QUERY confira: VÍRGULAS, PARENTESES E NOME DE COLUNAS")
            reply.status(400).send({mensagem:"ERRO: Você tem um erro de escrita em sua QUERY confira: VÍRGULAS, PARENTESES E NOME DE COLUNAS"})
        } else {
            console.log(erro)
            reply.status(400).send({mensagem:"ERRO: NÃO IDENTIFICADO"})
        }
    }
})
app.post('/produto', async (request: FastifyRequest, reply: FastifyReply) => {
    const {idproduto,nomeproduto,precoproduto,categoriaproduto,fornecedor_idfornecedor} = request.body as any
    try {
        const conn =  await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'bancomercado', // Corrigido para o mesmo banco dos outros endpoints
            port: 3306
        })
        const resultado =  await conn.query("INSERT INTO produto (idproduto,nomeproduto,precoproduto,categoriaproduto,fornecedor_idfornecedor) VALUES (?,?,?,?,?)",[idproduto,nomeproduto,precoproduto,categoriaproduto,fornecedor_idfornecedor])
        const [dados, camposTabela] = resultado
        console.log(dados)
        reply.status(200).send({idproduto,nomeproduto,precoproduto,categoriaproduto,fornecedor_idfornecedor})
    }
    catch (erro: any) {
        switch (erro.code) {
            case "ECONNREFUSED":
                console.log("ERRO: LIGUE O LARAGÃO!!! CABEÇA!");
                reply.status(400).send({ mensagem: "ERRO: LIGUE O LARAGÃO!!! CABEÇA!" });
                break;
            case "ER_BAD_DB_ERROR":
                console.log("ERRO: CONFIRA O NOME DO BANCO DE DADOS OU CRIE UM NOVO BANCO COM O NOME QUE VOCÊ COLOCOU LÁ NA CONEXÃO");
                reply.status(400).send({ mensagem: "ERRO: CONFIRA O NOME DO BANCO DE DADOS OU CRIE UM NOVO BANCO COM O NOME QUE VOCÊ COLOCOU LÁ NA CONEXÃO" });
                break;
            case "ER_ACCESS_DENIED_ERROR":
                console.log("ERRO: CONFIRA O USUÁRIO E SENHA NA CONEXÃO");
                reply.status(400).send({ mensagem: "ERRO: CONFIRA O USUÁRIO E SENHA NA CONEXÃO" });
                break;
            case "ER_DUP_ENTRY":
                console.log("ERRO: VOCÊ DUPLICOU A CHAVE PRIMÁRIA");
                reply.status(400).send({ mensagem: "ERRO: VOCÊ DUPLICOU A CHAVE PRIMÁRIA" });
                break;
            default:
                console.log(erro);
                reply.status(400).send({ mensagem: "ERRO DESCONHECIDO OLHE O TERMINAL DO BACKEND" });
                break;
        }
    
    }
    
})
app.put('/produto/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as any;
    const { idproduto, nomeproduto, precoproduto, categoriaproduto, fornecedor_idfornecedor } = request.body as any;
    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'bancomercado',
            port: 3306
        });
        const resultado = await conn.query(
            "UPDATE produto SET idproduto = ?, nomeproduto = ?, precoproduto = ?, categoriaproduto = ?, fornecedor_idfornecedor = ? WHERE idproduto = ?",
            [idproduto, nomeproduto, precoproduto, categoriaproduto, fornecedor_idfornecedor, id]
        );
        const [dados] = resultado;
        if ((dados as any).affectedRows > 0) {
            reply.status(200).send({ mensagem: "Produto atualizado com sucesso!" });
        } else {
            reply.status(404).send({ mensagem: "Produto não encontrado!" });
        }
    } catch (erro) {
        console.log(erro);
        reply.status(400).send({ mensagem: "Erro ao atualizar produto!" });
    }
});
app.delete('/produto/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as any
    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'bancomercado',
            port: 3306
        })
        const resultado = await conn.query("DELETE FROM produto WHERE idproduto = ?", [id])
        const [dados] = resultado
        if ((dados as any).affectedRows > 0) {
            reply.status(200).send({ mensagem: "Produto excluído com sucesso!" })
        } else {
            reply.status(404).send({ mensagem: "Produto não encontrado!" })
        }
    } catch (erro) {
        console.log(erro)
        reply.status(400).send({ mensagem: "Erro ao excluir produto!" })
    }
})

/*////////////////////////////////////////////////*/

app.get('/fornecedor', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const conn =  await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'bancomercado',
            port: 3306
        })
        const resultado =  await conn.query("SELECT * FROM fornecedor")
        const [dados, camposTabela] = resultado
        reply.status(200).send(dados)
    }
    catch (erro: any) {
        if (erro.code === 'ECONNREFUSED') {
            console.log("ERRO: LIGUE O LARAGAO => Conexão Recusada")
            reply.status(400).send({mensagem:"ERRO: LIGUE O LARAGAO => Conexão Recusada"})
        } else if (erro.code === 'ER_BAD_DB_ERROR') {
            console.log("ERRO: CRIE UM BANCO DE DADOS COM O NOME DEFINIDO NA CONEXÃO")
            reply.status(400).send({mensagem:"ERRO: CRIE UM BANCO DE DADOS COM O NOME DEFINIDO NA CONEXÃO"})
        } else if (erro.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log("ERRO: CONFERIR O USUÁRIO E SENHA DEFINIDOS NA CONEXÃO")
            reply.status(400).send({mensagem:"ERRO: CONFERIR O USUÁRIO E SENHA DEFINIDOS NA CONEXÃO"})
        } else if (erro.code === 'ER_NO_SUCH_TABLE') {
            console.log("ERRO: Você deve criar a tabela com o mesmo nome da sua QUERY")
            reply.status(400).send({mensagem:"ERRO: Você deve criar a tabela com o mesmo nome da sua QUERY"})
        } else if (erro.code === 'ER_PARSE_ERROR') {
            console.log("ERRO: Você tem um erro de escrita em sua QUERY confira: VÍRGULAS, PARENTESES E NOME DE COLUNAS")
            reply.status(400).send({mensagem:"ERRO: Você tem um erro de escrita em sua QUERY confira: VÍRGULAS, PARENTESES E NOME DE COLUNAS"})
        } else {
            console.log(erro)
            reply.status(400).send({mensagem:"ERRO: NÃO IDENTIFICADO"})
        }
    }
})
app.post('/fornecedor', async (request: FastifyRequest, reply: FastifyReply) => {
    const {idfornecedor,nomefornecedor,cnpjfornecedor,cidadefornecedor} = request.body as any
    try {
        const conn =  await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'bancomercado',
            port: 3306
        })
        const resultado =  await conn.query("INSERT INTO fornecedor (idfornecedor,nomefornecedor,cnpjfornecedor,cidadefornecedor) VALUES (?,?,?,?)",[idfornecedor,nomefornecedor,cnpjfornecedor,cidadefornecedor])
        const [dados, camposTabela] = resultado
        console.log(dados)
        reply.status(200).send({idfornecedor,nomefornecedor,cnpjfornecedor,cidadefornecedor})
    }
    catch (erro: any) {
        switch (erro.code) {
            case "ECONNREFUSED":
                console.log("ERRO: LIGUE O LARAGÃO!!! CABEÇA!");
                reply.status(400).send({ mensagem: "ERRO: LIGUE O LARAGÃO!!! CABEÇA!" });
                break;
            case "ER_BAD_DB_ERROR":
                console.log("ERRO: CONFIRA O NOME DO BANCO DE DADOS OU CRIE UM NOVO BANCO COM O NOME QUE VOCÊ COLOCOU LÁ NA CONEXÃO");
                reply.status(400).send({ mensagem: "ERRO: CONFIRA O NOME DO BANCO DE DADOS OU CRIE UM NOVO BANCO COM O NOME QUE VOCÊ COLOCOU LÁ NA CONEXÃO" });
                break;
            case "ER_ACCESS_DENIED_ERROR":
                console.log("ERRO: CONFIRA O USUÁRIO E SENHA NA CONEXÃO");
                reply.status(400).send({ mensagem: "ERRO: CONFIRA O USUÁRIO E SENHA NA CONEXÃO" });
                break;
            case "ER_DUP_ENTRY":
                console.log("ERRO: VOCÊ DUPLICOU A CHAVE PRIMÁRIA");
                reply.status(400).send({ mensagem: "ERRO: VOCÊ DUPLICOU A CHAVE PRIMÁRIA" });
                break;
            default:
                console.log(erro);
                reply.status(400).send({ mensagem: "ERRO DESCONHECIDO OLHE O TERMINAL DO BACKEND" });
                break;
        }
    
    }
})
app.put('/fornecedor/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as any;
    const { idfornecedor, nomefornecedor, cnpjfornecedor, cidadefornecedor } = request.body as any;
    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'bancomercado',
            port: 3306
        });
        const resultado = await conn.query(
            "UPDATE fornecedor SET idfornecedor = ?, nomefornecedor = ?, cnpjfornecedor = ?, cidadefornecedor = ? WHERE idfornecedor = ?",
            [idfornecedor, nomefornecedor, cnpjfornecedor, cidadefornecedor, id]
        );
        const [dados] = resultado;
        if ((dados as any).affectedRows > 0) {
            reply.status(200).send({ mensagem: "Fornecedor atualizado com sucesso!" });
        } else {
            reply.status(404).send({ mensagem: "Fornecedor não encontrado!" });
        }
    } catch (erro) {
        console.log(erro);
        reply.status(400).send({ mensagem: "Erro ao atualizar fornecedor!" });
    }
});
app.delete('/fornecedor/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as any
    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'bancomercado',
            port: 3306
        })
        const resultado = await conn.query("DELETE FROM fornecedor WHERE idfornecedor = ?", [id])
        const [dados] = resultado
        if ((dados as any).affectedRows > 0) {
            reply.status(200).send({ mensagem: "Fornecedor excluído com sucesso!" })
        } else {
            reply.status(404).send({ mensagem: "Fornecedor não encontrado!" })
        }
    } catch (erro) {
        console.log(erro)
        reply.status(400).send({ mensagem: "Erro ao excluir fornecedor!" })
    }
})

/*////////////////////////////////////////////////////////////////////////////////////////////////*/

app.get('/venda', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const conn =  await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'bancomercado',
            port: 3306
        })
        const resultado =  await conn.query("SELECT * FROM venda")
        const [dados, camposTabela] = resultado
        reply.status(200).send(dados)
    }
    catch (erro: any) {
        if (erro.code === 'ECONNREFUSED') {
            console.log("ERRO: LIGUE O LARAGAO => Conexão Recusada")
            reply.status(400).send({mensagem:"ERRO: LIGUE O LARAGAO => Conexão Recusada"})
        } else if (erro.code === 'ER_BAD_DB_ERROR') {
            console.log("ERRO: CRIE UM BANCO DE DADOS COM O NOME DEFINIDO NA CONEXÃO")
            reply.status(400).send({mensagem:"ERRO: CRIE UM BANCO DE DADOS COM O NOME DEFINIDO NA CONEXÃO"})
        } else if (erro.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log("ERRO: CONFERIR O USUÁRIO E SENHA DEFINIDOS NA CONEXÃO")
            reply.status(400).send({mensagem:"ERRO: CONFERIR O USUÁRIO E SENHA DEFINIDOS NA CONEXÃO"})
        } else if (erro.code === 'ER_NO_SUCH_TABLE') {
            console.log("ERRO: Você deve criar a tabela com o mesmo nome da sua QUERY")
            reply.status(400).send({mensagem:"ERRO: Você deve criar a tabela com o mesmo nome da sua QUERY"})
        } else if (erro.code === 'ER_PARSE_ERROR') {
            console.log("ERRO: Você tem um erro de escrita em sua QUERY confira: VÍRGULAS, PARENTESES E NOME DE COLUNAS")
            reply.status(400).send({mensagem:"ERRO: Você tem um erro de escrita em sua QUERY confira: VÍRGULAS, PARENTESES E NOME DE COLUNAS"})
        } else {
            console.log(erro)
            reply.status(400).send({mensagem:"ERRO: NÃO IDENTIFICADO"})
        }
    }
})
app.post('/venda', async (request: FastifyRequest, reply: FastifyReply) => {
    const {idvenda,datavenda,valorvenda,formapagamentovenda,funcionario_idfuncionario,produto_idproduto} = request.body as any
    try {
        const conn =  await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'bancomercado',
            port: 3306
        })
        const resultado =  await conn.query("INSERT INTO venda (idvenda,datavenda,valorvenda,formapagamentovenda,funcionario_idfuncionario,produto_idproduto) VALUES (?,?,?,?,?,?)",[idvenda,datavenda,valorvenda,formapagamentovenda,funcionario_idfuncionario,produto_idproduto])
        const [dados, camposTabela] = resultado
        console.log(dados)
        reply.status(200).send({idvenda,datavenda,valorvenda,formapagamentovenda,funcionario_idfuncionario,produto_idproduto})
    }
    catch (erro: any) {
        switch (erro.code) {
            case "ECONNREFUSED":
                console.log("ERRO: LIGUE O LARAGÃO!!! CABEÇA!");
                reply.status(400).send({ mensagem: "ERRO: LIGUE O LARAGÃO!!! CABEÇA!" });
                break;
            case "ER_BAD_DB_ERROR":
                console.log("ERRO: CONFIRA O NOME DO BANCO DE DADOS OU CRIE UM NOVO BANCO COM O NOME QUE VOCÊ COLOCOU LÁ NA CONEXÃO");
                reply.status(400).send({ mensagem: "ERRO: CONFIRA O NOME DO BANCO DE DADOS OU CRIE UM NOVO BANCO COM O NOME QUE VOCÊ COLOCOU LÁ NA CONEXÃO" });
                break;
            case "ER_ACCESS_DENIED_ERROR":
                console.log("ERRO: CONFIRA O USUÁRIO E SENHA NA CONEXÃO");
                reply.status(400).send({ mensagem: "ERRO: CONFIRA O USUÁRIO E SENHA NA CONEXÃO" });
                break;
            case "ER_DUP_ENTRY":
                console.log("ERRO: VOCÊ DUPLICOU A CHAVE PRIMÁRIA");
                reply.status(400).send({ mensagem: "ERRO: VOCÊ DUPLICOU A CHAVE PRIMÁRIA" });
                break;
            default:
                console.log(erro);
                reply.status(400).send({ mensagem: "ERRO DESCONHECIDO OLHE O TERMINAL DO BACKEND" });
                break;
        }
    
    }
})

app.delete('/venda/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as any;
    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'bancomercado',
            port: 3306
        });
        const resultado = await conn.query("DELETE FROM venda WHERE idvenda = ?", [id]);
        const [dados] = resultado;
        if ((dados as any).affectedRows > 0) {
            reply.status(200).send({ mensagem: "Venda excluída com sucesso!" });
        } else {
            reply.status(404).send({ mensagem: "Venda não encontrada!" });
        }
    } catch (erro) {
        console.log(erro);
        reply.status(400).send({ mensagem: "Erro ao excluir venda!" });
    }
});

app.put('/venda/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as any;
    const { idvenda, datavenda, valorvenda, formapagamentovenda, funcionario_idfuncionario, produto_idproduto } = request.body as any;
    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'bancomercado',
            port: 3306
        });
        const resultado = await conn.query(
            "UPDATE venda SET idvenda = ?, datavenda = ?, valorvenda = ?, formapagamentovenda = ?, funcionario_idfuncionario = ?, produto_idproduto = ? WHERE idvenda = ?",
            [idvenda, datavenda, valorvenda, formapagamentovenda, funcionario_idfuncionario, produto_idproduto, id]
        );
        const [dados] = resultado;
        if ((dados as any).affectedRows > 0) {
            reply.status(200).send({ mensagem: "Venda atualizada com sucesso!" });
        } else {
            reply.status(404).send({ mensagem: "Venda não encontrada!" });
        }
    } catch (erro) {
        console.log(erro);
        reply.status(400).send({ mensagem: "Erro ao atualizar venda!" });
    }
});

/*////////////////////////////////////////////////////////////////////////////////////////////////*/

app.get('/funcionario', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const conn =  await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'bancomercado',
            port: 3306
        })
        const resultado =  await conn.query("SELECT * FROM funcionario")
        const [dados, camposTabela] = resultado
        reply.status(200).send(dados)
    }
    catch (erro: any) {
        if (erro.code === 'ECONNREFUSED') {
            console.log("ERRO: LIGUE O LARAGAO => Conexão Recusada")
            reply.status(400).send({mensagem:"ERRO: LIGUE O LARAGAO => Conexão Recusada"})
        } else if (erro.code === 'ER_BAD_DB_ERROR') {
            console.log("ERRO: CRIE UM BANCO DE DADOS COM O NOME DEFINIDO NA CONEXÃO")
            reply.status(400).send({mensagem:"ERRO: CRIE UM BANCO DE DADOS COM O NOME DEFINIDO NA CONEXÃO"})
        } else if (erro.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log("ERRO: CONFERIR O USUÁRIO E SENHA DEFINIDOS NA CONEXÃO")
            reply.status(400).send({mensagem:"ERRO: CONFERIR O USUÁRIO E SENHA DEFINIDOS NA CONEXÃO"})
        } else if (erro.code === 'ER_NO_SUCH_TABLE') {
            console.log("ERRO: Você deve criar a tabela com o mesmo nome da sua QUERY")
            reply.status(400).send({mensagem:"ERRO: Você deve criar a tabela com o mesmo nome da sua QUERY"})
        } else if (erro.code === 'ER_PARSE_ERROR') {
            console.log("ERRO: Você tem um erro de escrita em sua QUERY confira: VÍRGULAS, PARENTESES E NOME DE COLUNAS")
            reply.status(400).send({mensagem:"ERRO: Você tem um erro de escrita em sua QUERY confira: VÍRGULAS, PARENTESES E NOME DE COLUNAS"})
        } else {
            console.log(erro)
            reply.status(400).send({mensagem:"ERRO: NÃO IDENTIFICADO"})
        }
    }
})
app.post('/funcionario', async (request: FastifyRequest, reply: FastifyReply) => {
    const {idfuncionario,nomefuncionario,funcaofuncionario,cpf} = request.body as any
    try {
        const conn =  await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'bancomercado',
            port: 3306
        })
        const resultado =  await conn.query("INSERT INTO funcionario (idfuncionario,nomefuncionario,funcaofuncionario,cpf) VALUES (?,?,?,?)",[idfuncionario,nomefuncionario,funcaofuncionario,cpf])
        const [dados, camposTabela] = resultado
        console.log(dados)
        reply.status(200).send({idfuncionario,nomefuncionario,funcaofuncionario,cpf})
    }
    catch (erro: any) {
        switch (erro.code) {
            case "ECONNREFUSED":
                console.log("ERRO: LIGUE O LARAGÃO!!! CABEÇA!");
                reply.status(400).send({ mensagem: "ERRO: LIGUE O LARAGÃO!!! CABEÇA!" });
                break;
            case "ER_BAD_DB_ERROR":
                console.log("ERRO: CONFIRA O NOME DO BANCO DE DADOS OU CRIE UM NOVO BANCO COM O NOME QUE VOCÊ COLOCOU LÁ NA CONEXÃO");
                reply.status(400).send({ mensagem: "ERRO: CONFIRA O NOME DO BANCO DE DADOS OU CRIE UM NOVO BANCO COM O NOME QUE VOCÊ COLOCOU LÁ NA CONEXÃO" });
                break;
            case "ER_ACCESS_DENIED_ERROR":
                console.log("ERRO: CONFIRA O USUÁRIO E SENHA NA CONEXÃO");
                reply.status(400).send({ mensagem: "ERRO: CONFIRA O USUÁRIO E SENHA NA CONEXÃO" });
                break;
            case "ER_DUP_ENTRY":
                console.log("ERRO: VOCÊ DUPLICOU A CHAVE PRIMÁRIA");
                reply.status(400).send({ mensagem: "ERRO: VOCÊ DUPLICOU A CHAVE PRIMÁRIA" });
                break;
            default:
                console.log(erro);
                reply.status(400).send({ mensagem: "ERRO DESCONHECIDO OLHE O TERMINAL DO BACKEND" });
                break;
        }
    
    }
})
app.delete('/funcionario/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as any
    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'bancomercado',
            port: 3306
        })
        const resultado = await conn.query("DELETE FROM funcionario WHERE idfuncionario = ?", [id])
        const [dados] = resultado
        if ((dados as any).affectedRows > 0) {
            reply.status(200).send({ mensagem: "funcionario excluído com sucesso!" })
        } else {
            reply.status(404).send({ mensagem: "funcionario não encontrado!" })
        }
    } catch (erro) {
        console.log(erro)
        reply.status(400).send({ mensagem: "Erro ao excluir funcionario!" })
    }
})

app.put('/funcionario/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as any;
    const { idfuncionario, nomefuncionario, funcaofuncionario, cpf } = request.body as any;
    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'bancomercado',
            port: 3306
        });
        const resultado = await conn.query(
            "UPDATE funcionario SET idfuncionario = ?, nomefuncionario = ?, funcaofuncionario = ?, cpf = ? WHERE idfuncionario = ?",
            [idfuncionario, nomefuncionario, funcaofuncionario, cpf, id]
        );
        const [dados] = resultado;
        if ((dados as any).affectedRows > 0) {
            reply.status(200).send({ mensagem: "Funcionário atualizado com sucesso!" });
        } else {
            reply.status(404).send({ mensagem: "Funcionário não encontrado!" });
        }
    } catch (erro) {
        console.log(erro);
        reply.status(400).send({ mensagem: "Erro ao atualizar funcionário!" });
    }
});

app.listen({ port: 8000 }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})