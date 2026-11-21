const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get(['/', '/itens', '/fibbauru'], async (req, res, next) => {
    try {
        const pesquisa = req.query.pesquisa || '';

        let sql = `
            SELECT
                b.id_criatura,
                b.nome AS nome_besta,
                b.localizacao,
                b.ecos,
                b.id_fraqueza,
                b.id_status,
                e.nome_fraqueza,
                s.nome_status
            FROM bestiario b, estatistica e, statuscriatura s
            WHERE b.id_fraqueza = e.id_fraqueza
            AND b.id_status = s.id_status
        `;

        const parametros = [];

        if (pesquisa) {
            sql += ` AND (b.nome LIKE ? OR b.localizacao LIKE ?)`;

            parametros.push(
                '%' + pesquisa + '%',
                '%' + pesquisa + '%'
            );
        }

        sql += ' ORDER BY b.ecos';

        const [registros] = await db.query(sql, parametros);

        res.render('index', {
            registros,
            pesquisa,
            cadastrado: req.query.cadastrado === '1'
        });

    } catch (erro) {
        next(erro);
    }
});

router.post('/itens', async (req, res, next) => {
    try {
        const { nome, localizacao, ecos, id_fraqueza, id_status } = req.body;

        const sql = `
            INSERT INTO bestiario
            (nome, localizacao, ecos, id_fraqueza, id_status)
            VALUES (?, ?, ?, ?, ?)
        `;

        await db.query(sql, [
            nome,
            localizacao,
            ecos,
            id_fraqueza,
            id_status
        ]);

        res.redirect(303, '/?cadastrado=1');

    } catch (erro) {
        next(erro);
    }
});

module.exports = router;