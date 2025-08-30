document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.querySelector('#text_section textarea');
    const button = document.querySelector('#classify_button');
    const fileInput = document.querySelector('#email_uploads');
    
    button.disabled = true;
    
    textarea.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            button.disabled = false;
            button.classList.add('active');
        } else {
            button.disabled = true;
            button.classList.remove('active');
        }
    });

    fileInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.name.match(/\.(txt|pdf)$/i)) {
            alert('Por favor, envie apenas arquivos TXT ou PDF');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (response.ok) {
                textarea.value = data.text;
                textarea.dispatchEvent(new Event('input'));
            } else {
                throw new Error(data.error || 'Erro ao processar arquivo');
            }

        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao processar o arquivo: ' + error.message);
        }
    });
    
    // Adicionar evento de clique ao botão classificar
    button.addEventListener('click', async function() {
        const text = textarea.value.trim();
        if (!text) return;

        try {
            const response = await fetch('/classify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text })
            });

            const data = await response.json();
            
            if (response.ok) {
                const resultText = document.querySelector('#result_text');
                resultText.innerHTML = `<strong>Classificação:</strong> ${data.classification}<br><strong>Resposta Sugerida:</strong><br><pre style="white-space: pre-wrap; font-family: inherit; margin-top: 10px;">${data.suggested_response}</pre>`;
            } else {
                throw new Error(data.error || 'Erro ao classificar texto');
            }

        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao classificar o texto: ' + error.message);
        }
    });
});