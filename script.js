async function consultarDados() {
    const municipio = document.getElementById('municipio').value.trim();
    const mesAno = document.getElementById('mesAno').value.trim();

    if (!municipio || !mesAno) {
        alert('Preencha todos os campos!');
        return;
    }

    if (!/^\d{7}$/.test(municipio)) {
        alert('Código IBGE inválido! 7 dígitos requeridos.');
        return;
    }

    if (!/^\d{6}$/.test(mesAno)) {
        alert('Data inválida! Formato AAAAMM requerido.');
        return;
    }

    try {
        const params = new URLSearchParams({
            municipio: municipio,
            mesAno: mesAno
        });

        const response = await fetch(`http://localhost:8000?${params}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro na requisição');
        }

        const data = await response.json();
        
        if (data.length === 0) {
            throw new Error('Nenhum dado encontrado');
        }

        exibirDados(data);

    } catch (error) {
        console.error('Erro:', error);
        alert(error.message);
        document.querySelector('#tabela-dados tbody').innerHTML = '';
    }
}

function exibirDados(dados) {
    const tbody = document.querySelector("#tabela-dados tbody");
    tbody.innerHTML = ''; // Limpa o conteúdo existente

    dados.forEach((item) => {
        const row = document.createElement("tr");

        // Acessa os campos corretamente
        row.innerHTML = `
            <td>${item.municipio.nomeIBGE}</td> <!-- Nome do município -->
            <td>${item.municipio.uf.sigla}</td> <!-- Sigla da UF -->
            <td>${item.valor.toLocaleString("pt-BR", { 
                style: "currency", 
                currency: "BRL" 
            })}</td> <!-- Valor formatado como moeda -->
            <td>${item.quantidadeBeneficiados}</td> <!-- Quantidade de beneficiados -->
            <td>${item.dataReferencia}</td> <!-- Data de referência -->
        `;

        AparecerTabela()

        tbody.appendChild(row);
    });
}

function AparecerTabela() {
    const tabela = document.querySelector('.container-tabela')

    tabela.style.opacity = '1.0';
}