// Função para consultar dados do Bolsa Família
async function consultarBolsaFamilia(codigoIbge, mesAno) {
    // URL da API do Portal da Transparência
    const url = `https://api.portaldatransparencia.gov.br/api-de-dados/bolsa-familia-por-municipio?codigoIbge=${codigoIbge}&mesAno=${mesAno}&pagina=1`;

    try {
        // Faz a requisição HTTP GET usando fetch
        const response = await fetch(url, {
            method: 'GET', // Método HTTP
            headers: {
                'chave-api-dados': 'SEU_TOKEN_AQUI', // Substitua pelo seu token
            },
        });

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        // Converte a resposta para JSON
        const dados = await response.json();

        // Retorna os dados
        return dados;
    } catch (error) {
        console.error('Erro ao consultar a API:', error.message);
        return null;
    }
}

// Função principal para interagir com o usuário
async function main() {
    // Solicita as informações do usuário
    const codigoIbge = prompt("Digite o código IBGE do município:");
    const mesAno = prompt("Digite o mês e ano de referência (formato AAAAMM):");

    // Verifica se os dados foram fornecidos
    if (!codigoIbge || !mesAno) {
        alert("Todos os campos são obrigatórios.");
        return;
    }

    // Consulta os dados do Bolsa Família
    const dadosBolsaFamilia = await consultarBolsaFamilia(codigoIbge, mesAno);

    // Exibe os dados retornados
    if (dadosBolsaFamilia) {
        exibirDados(dadosBolsaFamilia);
    } else {
        alert("Não foi possível obter os dados.");
    }
}

// Função para exibir os dados na tabela
function exibirDados(dados) {
    const tbody = document.querySelector("#tabela-dados tbody");
    tbody.innerHTML = ''; // Limpa o conteúdo existente

    dados.forEach((item) => {
        const row = document.createElement("tr");

        row.innerHTML =
            `<td>${item.municipio}</td>
            <td>${item.uf}</td>
            <td>${item.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
            <td>${item.quantidadeBeneficiados}</td>
            <td>${item.mesAno}</td>`;

        tbody.appendChild(row);
    });
}

// Executa a função principal ao carregar a página
main();