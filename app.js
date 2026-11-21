var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const db = require('./config/db');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/fibbauru', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/alunos', async (req, res) => {
    try {
        let sql = `
            SELECT
                a.id_aluno,
                a.matricula,
                a.nome AS nome_aluno,
                a.cpf,
                a.celular,
                a.id_curso,
                c.nome_curso
            FROM aluno a, curso c
            WHERE a.id_curso = c.id_curso
        `;

        const parametros = [];

        if (req.query.pesquisa) {
            sql += ` AND (a.nome LIKE ? OR a.matricula LIKE ?)`;

            parametros.push(
                '%' + req.query.pesquisa + '%',
                '%' + req.query.pesquisa + '%'
            );
        }

        sql += ' ORDER BY a.nome';

        const [rows] = await db.query(sql, parametros);

        res.json(rows);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            erro: 'Erro ao buscar alunos: ' + err.message
        });
    }
});

app.post('/api/alunos', async (req, res) => {
    try {
        const { matricula, nome, cpf, celular, id_curso } = req.body;

        const sql = `
            INSERT INTO aluno
            (matricula, nome, cpf, celular, id_curso)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [resultado] = await db.query(sql, [
            matricula,
            nome,
            cpf,
            celular || null,
            id_curso
        ]);

        res.status(201).json({
            mensagem: 'Aluno cadastrado com sucesso!',
            id_aluno: resultado.insertId
        });

    } catch (erro) {
        console.error('Erro ao cadastrar aluno:', erro);

        res.status(500).json({
            erro: 'Erro ao cadastrar aluno.'
        });
    }
});

app.put('/api/alunos/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const { matricula, nome, cpf, celular, id_curso } = req.body;

        if (!matricula || !nome || !cpf || !id_curso) {
            return res.status(400).json({
                erro: 'Preencha matrícula, nome, CPF e curso.'
            });
        }

        const [resultado] = await db.query(
            `UPDATE aluno
             SET matricula = ?,
                 nome = ?,
                 cpf = ?,
                 celular = ?,
                 id_curso = ?
             WHERE id_aluno = ?`,
            [matricula, nome, cpf, celular || null, id_curso, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                erro: 'Aluno não encontrado.'
            });
        }

        res.json({
            mensagem: 'Aluno atualizado com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao atualizar aluno:', erro);

        res.status(500).json({
            erro: 'Erro ao atualizar aluno.'
        });
    }
});

app.delete('/api/alunos/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const [resultado] = await db.query(
            'DELETE FROM aluno WHERE id_aluno = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                erro: 'Aluno não encontrado.'
            });
        }

        res.json({
            mensagem: 'Aluno deletado com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao deletar aluno:', erro);

        res.status(500).json({
            erro: 'Erro ao deletar aluno.'
        });
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;