let timerMensagem;
let timerFadeout;

function mostrarMensagem(texto, erro = false) {
    const area = document.getElementById('mensagem');

    clearTimeout(timerMensagem);
    clearTimeout(timerFadeout);

    area.textContent = texto;
    area.classList.toggle('error', erro);
    area.style.opacity = '1';

    timerMensagem = setTimeout(() => {

        area.style.opacity = '0';

        timerFadeout = setTimeout(() => {
            area.textContent = '';
        }, 1500);

    }, 5000);
}

const listaBestiario = Array.from(
    document.querySelectorAll('#bestiario tr[data-id]')
).map(tr => ({
    id_criatura: Number(tr.dataset.id),
    nome_besta: tr.cells[1].textContent,
    localizacao: tr.cells[2].textContent,
    ecos: tr.cells[3].textContent,
    id_fraqueza: tr.dataset.fraqueza,
    id_status: tr.dataset.status
}));

function carregarRegistro() {
    const mensagem = document.getElementById('mensagem').textContent;

    if (mensagem.trim()) {
        sessionStorage.setItem('mensagemBestiario', mensagem);
    }

    const pesquisa = document.getElementById('pesquisa').value;

    location.href = '/?pesquisa=' + encodeURIComponent(pesquisa);
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

        const id = document.getElementById('id_criatura').value;

        if (!id) return;

        evento.preventDefault();

        const bestiario = {
            nome: document.getElementById('nome').value,
            localizacao: document.getElementById('localizacao').value,
            ecos: document.getElementById('ecos').value,
            id_fraqueza: document.getElementById('id_fraqueza').value,
            id_status: document.getElementById('id_status').value
        };

        try {
            const resposta = await fetch('/api/registros/' + id, {
                method: 'PUT',
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

const mensagemInicial =
    document.getElementById('mensagem').textContent.trim()
    || sessionStorage.getItem('mensagemBestiario');

sessionStorage.removeItem('mensagemBestiario');

if (mensagemInicial) {
    mostrarMensagem(mensagemInicial);
}

function criarEmbers() {
    const container = document.getElementById('embers');

    for (let i = 0; i < 35; i++) {
        const ember = document.createElement('span');

        ember.classList.add('ember');

        ember.style.setProperty('--x', Math.random() * 100 + 'vw');

        ember.style.setProperty('--t', 8 + Math.random() * 12 + 's');

        ember.style.setProperty('--d', -Math.random() * 20 + 's');

        container.appendChild(ember);
    }
}

criarEmbers();