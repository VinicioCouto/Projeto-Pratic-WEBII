// Função para consultar dados do Bolsa Família
async function consultarBolsaFamilia(data, municipio, valor) {
    // URL da API (hipotética)
    const url = `https://api.exemplo.com/bolsa-familia?data=${data}&municipio=${municipio}&valor=${valor}`;

    try {
        // Faz a requisição HTTP GET usando fetch
        const response = await fetch(url, {
            method: 'GET', // Método HTTP
            headers: {
                'chave-api-dados': 'f993995f321c2349a570c166c1345f0e', // Header personalizado
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
    const data = prompt("Digite a data (formato YYYY-MM-DD):");
    const municipio = prompt("Digite o município:");
    const valor = prompt("Digite o valor:");

    // Verifica se os dados foram fornecidos
    if (!data || !municipio || !valor) {
        console.log("Todos os campos são obrigatórios.");
        return;
    }

    // Consulta os dados do Bolsa Família
    const dadosBolsaFamilia = await consultarBolsaFamilia(data, municipio, valor);

    // Exibe os dados retornados
    if (dadosBolsaFamilia) {
        exibirDados(dadosBolsaFamilia); // Alterado para chamar a nova função
    } else {
        console.log("Não foi possível obter os dados.");
    }
}

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

main();