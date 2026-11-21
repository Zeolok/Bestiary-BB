let timerMensagem;

function mostrarMensagem(texto, erro = false) {
    const area = document.getElementById('mensagem');

    area.textContent = texto;
    area.classList.toggle('error', erro);

    clearTimeout(timerMensagem);

    timerMensagem = setTimeout(() => {
        area.textContent = '';
    }, 6500);
}

let listaBestiario = [];

async function carregarRegistro() {
    const tbody = document.getElementById('bestiario');
    const pesquisa = document.getElementById('pesquisa').value;

    try {
        const resposta = await fetch(
            '/api/registros?pesquisa=' + encodeURIComponent(pesquisa)
        );

        const registros = await resposta.json();

        if (!resposta.ok) {
            throw new Error(registros.erro);
        }

        listaBestiario = registros;

        document.getElementById('contador').textContent =
            registros.length + ' registro(s)';

        if (registros.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td class="empty" colspan="7">
                        Nenhum registro encontrado.
                    </td>
                </tr>
            `;

            return;
        }

        tbody.innerHTML = registros.map((b, i) => `
            <tr data-id="${Number(b.id_criatura)}"
                style="--delay:${Math.min(i * 45, 450)}ms">

                <td>${b.id_criatura}</td>
                <td>${b.nome_besta}</td>
                <td>${b.localizacao}</td>
                <td>${b.ecos}</td>
                <td>${b.nome_fraqueza}</td>

                <td>
                    <span class="status ${Number(b.id_status) === 2 ? 'alive' : ''}">
                        ${b.nome_status}
                    </span>
                </td>

                <td>
                    <div class="actions">

                        <button type="button"
                            onclick="editarRegistro(${Number(b.id_criatura)})">
                            Editar
                        </button>

                        <button type="button" class="danger"
                            onclick="deletarRegistro(${Number(b.id_criatura)})">
                            Deletar
                        </button>

                    </div>
                </td>
            </tr>
        `).join('');

    } catch (erro) {
        document.getElementById('contador').textContent =
            'Falha na consulta';

        tbody.innerHTML = `
            <tr>
                <td class="empty" colspan="7">
                    ${erro.message}
                </td>
            </tr>
        `;
    }
}

function editarRegistro(id) {
    const b = listaBestiario.find(
        bestiario => bestiario.id_criatura == id
    );

    if (!b) {
        mostrarMensagem('Registro não encontrado.', true);
        return;
    }

    document.getElementById('id_criatura').value = b.id_criatura;
    document.getElementById('nome').value = b.nome_besta;
    document.getElementById('localizacao').value = b.localizacao;
    document.getElementById('ecos').value = b.ecos;
    document.getElementById('id_fraqueza').value = b.id_fraqueza;
    document.getElementById('id_status').value = b.id_status;

    document.getElementById('titulo-form').textContent =
        'Editar registro';

    document.getElementById('btn-salvar').textContent =
        '◆ Atualizar registro';

    document.getElementById('editor').classList.add('editing');

    document.querySelectorAll('#bestiario tr').forEach(tr => {
        tr.classList.toggle('selected', tr.dataset.id === String(id));
    });

    document.getElementById('editor').scrollIntoView({
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
        block: 'start'
    });

    document.getElementById('nome').focus({
        preventScroll: true
    });
}

function limparFormulario() {
    document.getElementById('form-registro').reset();
    document.getElementById('id_criatura').value = '';

    document.getElementById('titulo-form').textContent =
        'Novo registro';

    document.getElementById('btn-salvar').textContent =
        '◆ Salvar registro';

    document.getElementById('editor').classList.remove('editing');

    document.querySelectorAll('#bestiario tr.selected').forEach(tr => {
        tr.classList.remove('selected');
    });
}

function confirmarExclusao() {
    const dialog = document.getElementById('confirmacao');

    if (typeof dialog.showModal !== 'function') {
        return Promise.resolve(
            confirm('Deseja realmente deletar este registro?')
        );
    }

    return new Promise(resolve => {
        dialog.returnValue = 'cancelar';

        dialog.addEventListener('close', () => {
            resolve(dialog.returnValue === 'confirmar');
        }, { once: true });

        dialog.showModal();
    });
}

async function deletarRegistro(id) {
    if (!await confirmarExclusao()) return;

    try {
        const resposta = await fetch(`/api/registros/${id}`, {
            method: 'DELETE'
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            mostrarMensagem(
                resultado.mensagem ?? 'Registro excluído!'
            );

            if (
                document.getElementById('id_criatura').value === String(id)
            ) {
                limparFormulario();
            }

            carregarRegistro();

        } else {
            mostrarMensagem(
                resultado.erro ?? 'Erro ao excluir registro.',
                true
            );
        }

    } catch (erro) {
        mostrarMensagem(
            'Erro ao excluir registro: ' + erro.message,
            true
        );
    }
}

function pesquisar(evento) {
    evento.preventDefault();
    carregarRegistro();
}

function limparPesquisa() {
    document.getElementById('pesquisa').value = '';
    carregarRegistro();
}

document.getElementById('form-registro').addEventListener(
    'submit', async (evento) => {

        evento.preventDefault();

        const id = document.getElementById('id_criatura').value;

        const bestiario = {
            nome: document.getElementById('nome').value,
            localizacao: document.getElementById('localizacao').value,
            ecos: document.getElementById('ecos').value,
            id_fraqueza: document.getElementById('id_fraqueza').value,
            id_status: document.getElementById('id_status').value
        };

        const metodo = id ? 'PUT' : 'POST';

        const endereco = id
            ? '/api/registros/' + id
            : '/api/registros';

        try {
            const resposta = await fetch(endereco, {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bestiario)
            });

            const resultado = await resposta.json();

            mostrarMensagem(
                resultado.mensagem ?? resultado.erro,
                !resposta.ok
            );

            if (resposta.ok) {
                limparFormulario();
                carregarRegistro();
            }

        } catch (erro) {
            mostrarMensagem(
                'Erro ao salvar registro: ' + erro.message,
                true
            );
        }
    }
);

carregarRegistro();