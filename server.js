import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

const API_KEY = '9954c3045116a3330fc8f216ce495606';
const PORT = 8000;

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

async function handler(req) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, {
            headers: corsHeaders,
            status: 204
        });
    }

    try {
        const url = new URL(req.url);
        const { searchParams } = url;
        
        // Get and validate parameters
        const codigoIbge = searchParams.get('municipio')?.trim() || '';
        const mesAno = searchParams.get('mesAno')?.trim() || '';

        console.log('Parâmetros recebidos:', { codigoIbge, mesAno });

        // Validações
        if (!codigoIbge || !mesAno) {
            throw new Error("Parâmetros 'municipio' e 'mesAno' são obrigatórios");
        }

        if (!/^\d{7}$/.test(codigoIbge)) {
            throw new Error("Código IBGE inválido (7 dígitos requeridos)");
        }

        if (!/^\d{6}$/.test(mesAno)) {
            throw new Error("Formato de data inválido (AAAAMM requerido)");
        }

        // Build correct API URL
        const apiUrl = new URL('https://api.portaldatransparencia.gov.br/api-de-dados/bolsa-familia-por-municipio');
        apiUrl.searchParams.set('codigoIbge', codigoIbge);
        apiUrl.searchParams.set('mesAno', mesAno);
        apiUrl.searchParams.set('pagina', '1');

        // Fetch from official API
        const response = await fetch(apiUrl, {
            headers: {
                'chave-api-dados': API_KEY,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro na API: ${errorText}`);
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Erro:', error);
        return new Response(
            JSON.stringify({
                error: error.message,
                status: 400
            }),
            {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                },
                status: 400
            }
        );
    }
}

console.log(`Servidor rodando em http://localhost:${PORT}`);
await serve(handler, { port: PORT });