// Base de Dados dos Candidatos (Nomes Reais que serão revelados no fim)
const candidatos = {
    c1: { nome: "Candidato A (Foco Social)", pontos: 0 },
    c2: { nome: "Candidato B (Foco Liberal/Mercado)", pontos: 0 },
    c3: { nome: "Candidato C (Foco Conservador/Segurança)", pontos: 0 }
};

// Base de Perguntas e Propostas (Sem revelar os nomes)
const questionario = [
    {
        tema: "Formação e Histórico",
        opcoes: [
            { id: "c1", texto: "Formação em Sociologia, longo histórico no sindicalismo e defesa dos direitos dos trabalhadores em movimentos de base." },
            { id: "c2", texto: "Economista com mestrado no estrangeiro. Fez carreira como executivo no setor privado antes de entrar para a política." },
            { id: "c3", texto: "Carreira militar militar de alta patente e ex-secretário de segurança pública com foco na ordem e disciplina." }
        ]
    },
    {
        tema: "Plano de Governo: Economia",
        opcoes: [
            { id: "c1", texto: "Forte intervenção do Estado, aumento do salário mínimo acima da inflação e criação de empresas estatais estratégicas." },
            { id: "c2", texto: "Privatização de empresas públicas, redução drástica de impostos para atrair investimento estrangeiro e desburocratização total." },
            { id: "c3", texto: "Protecionismo para indústrias nacionais, corte de gastos na máquina pública e incentivo ao agronegócio." }
        ]
    },
    {
        tema: "Plano de Governo: Saúde",
        opcoes: [
            { id: "c1", texto: "Investimento massivo no sistema público universal (SUS/SNS), contratação de mais médicos e fim das parcerias público-privadas." },
            { id: "c2", texto: "Adoção de sistemas de vouchers (cheques) onde o Estado paga para o cidadão ser atendido em hospitais privados eficientes." },
            { id: "c3", texto: "Foco em hospitais militares e parcerias com instituições religiosas e filantrópicas para expandir o atendimento de base." }
        ]
    },
    {
        tema: "Plano de Governo: Segurança",
        opcoes: [
            { id: "c1", texto: "Foco na prevenção: mais investimento em educação e cultura nas periferias e desmilitarização gradual das polícias." },
            { id: "c2", texto: "Modernização tecnológica das polícias com uso de inteligência artificial e privatização do sistema prisional." },
            { id: "c3", texto: "Aumento do policiamento ostensivo, endurecimento das penas, redução da maioridade penal e tolerância zero ao crime." }
        ]
    }
];

let perguntaAtual = 0;

// Função para embaralhar as opções (para o C1 não ser sempre o primeiro botão)
function embaralharOpcoes(array) {
    let arrayEmbaralhado = [...array];
    for (let i = arrayEmbaralhado.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayEmbaralhado[i], arrayEmbaralhado[j]] = [arrayEmbaralhado[j], arrayEmbaralhado[i]];
    }
    return arrayEmbaralhado;
}

function iniciarTeste() {
    document.getElementById('tela-inicial').classList.add('escondido');
    document.getElementById('tela-perguntas').classList.remove('escondido');
    
    // Zera os pontos caso seja um reinício
    for (let key in candidatos) {
        candidatos[key].pontos = 0;
    }
    
    perguntaAtual = 0;
    renderizarPergunta();
}

function renderizarPergunta() {
    const dadosPergunta = questionario[perguntaAtual];
    
    // Atualiza Progresso e Títulos
    const progresso = (perguntaAtual / questionario.length) * 100;
    document.getElementById('barra-progresso').style.width = progresso + '%';
    document.getElementById('tema-atual').textContent = dadosPergunta.tema;
    
    const container = document.getElementById('opcoes-container');
    container.innerHTML = '';
    
    // Embaralha as propostas antes de exibir
    const opcoesEmbaralhadas = embaralharOpcoes(dadosPergunta.opcoes);
    
    opcoesEmbaralhadas.forEach(opcao => {
        const btn = document.createElement('button');
        btn.className = 'proposta-btn';
        btn.innerHTML = opcao.texto;
        btn.onclick = () => computarResposta(opcao.id);
        container.appendChild(btn);
    });
}

function computarResposta(idCandidato) {
    candidatos[idCandidato].pontos += 1;
    perguntaAtual++;
    
    if (perguntaAtual < questionario.length) {
        renderizarPergunta();
    } else {
        mostrarResultado();
    }
}

function mostrarResultado() {
    document.getElementById('tela-perguntas').classList.add('escondido');
    document.getElementById('tela-resultado').classList.remove('escondido');
    
    // Transforma o objeto de candidatos num array para poder ordenar
    let ranking = [];
    for (let key in candidatos) {
        ranking.push({
            nome: candidatos[key].nome,
            pontos: candidatos[key].pontos
        });
    }
    
    // Ordena do maior pontuador para o menor
    ranking.sort((a, b) => b.pontos - a.pontos);
    
    const totalPerguntas = questionario.length;
    
    // Vencedor (O primeiro do array ordenado)
    const vencedor = ranking[0];
    const afinidadeVencedor = Math.round((vencedor.pontos / totalPerguntas) * 100);
    
    document.getElementById('nome-vencedor').textContent = vencedor.nome;
    document.getElementById('afinidade-vencedor').textContent = `${afinidadeVencedor}% de Afinidade`;
    
    // Renderiza o resto do ranking
    const containerRanking = document.getElementById('ranking-container');
    containerRanking.innerHTML = '';
    
    for (let i = 1; i < ranking.length; i++) {
        const div = document.createElement('div');
        div.className = 'ranking-item';
        const afinidade = Math.round((ranking[i].pontos / totalPerguntas) * 100);
        
        div.innerHTML = `
            <span><strong>${i + 1}º</strong> ${ranking[i].nome}</span>
            <span>${afinidade}%</span>
        `;
        containerRanking.appendChild(div);
    }
}
