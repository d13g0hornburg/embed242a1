// Declaração das constantes para dependências
const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

// Configuração do express
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'root99',
    database: 'apapp'
});

connection.connect(function (err) {
    if (err) {
        console.error("Erro de conexão!", err);
        return;
    }
    console.log("Conexão estabelecida!");
});

// Rota index
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Rota para login
app.post('/login', function (req, res) {
    const login = req.body.login;
    const senha = req.body.senha;

    connection.query('SELECT * FROM login WHERE login=? and senha=?', [login, senha], function (error, results, fields) {
        if (error) {
            console.error('Erro ao executar a consulta ', error);
            res.status(500).send('Erro interno ao verificar credenciais');
            return;
        }
        if (results.length > 0) {
            res.redirect('/ok.html');
        } else {
            res.status(401).send('Credenciais inválidas');
        }
    });
});


// Configuração da aplicação rodando no localhost, ouvindo a porta 8008
app.listen(8008, function () {
    console.log('Servidor rodando na url http://localhost:8008');
});
