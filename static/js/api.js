/**
 * Envia um arquivo para o servidor e extrai o texto contido nele.
 * * @param {File} file - O objeto do arquivo a ser enviado (geralmente de um input type="file").
 * @returns {Promise<Object>} Uma promessa que resolve para um objeto contendo o texto extraído. Ex: { text: "..." }.
 */
export async function uploadFileAndGetText(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/upload', { method: 'POST', body: formData });
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar arquivo');
    }
    return data;
}

/**
 * Envia um texto para o servidor e extrai a classificação do texto e a sugestão de resposta.
 * * @param {string} text - O objeto do arquivo a ser enviado (geralmente de um input type="file").
 * @returns {Promise<Object>} Uma promessa que resolve para um objeto com o resultado da classificação. Ex: { classification: "produtivo", suggested_response: "..." }.
 */

export async function classifyText(text) {
    const response = await fetch('/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Erro ao classificar texto');
    }
    return data;
}