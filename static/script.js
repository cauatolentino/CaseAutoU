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
                resultText.innerHTML = `<strong>Classificação:</strong> ${data.classification}<br>
<strong>Resposta Sugerida:</strong><br>
<div class="response-content">
<pre>${data.suggested_response}</pre>
<textarea class="response-textarea hidden">${data.suggested_response}</textarea>
</div>
<div class="response-actions">
    <button class="edit-button">Editar Resposta</button>
    <button class="save-button hidden">Salvar</button>
    <button class="cancel-button hidden">Cancelar</button>
</div><button class="new-classification-button">Classificar Novo Email</button>`;


                const editButton = resultText.querySelector('.edit-button');
                const saveButton = resultText.querySelector('.save-button');
                const cancelButton = resultText.querySelector('.cancel-button');
                const preElement = resultText.querySelector('pre');
                const textareaElement = resultText.querySelector('.response-textarea');

                const newClassificationButton = resultText.querySelector('.new-classification-button');
                newClassificationButton.addEventListener('click', function() {
                    const modalOverlay = document.createElement('div');
                    modalOverlay.className = 'modal-overlay';
                    const modalHTML = `
                        <div class="modal">
                            <div class="modal-content">
                                <p>Você tem certeza que deseja classificar um novo email?<br>Isso vai apagar os dados do seu atual.</p>
                                <div class="modal-buttons">
                                    <button class="modal-button-yes">Sim</button>
                                    <button class="modal-button-no">Não</button>
                                </div>
                            </div>
                        </div>
                    `;

                    modalOverlay.innerHTML = modalHTML;
                    document.body.appendChild(modalOverlay);

                    const yesButton = modalOverlay.querySelector('.modal-button-yes');
                    const noButton = modalOverlay.querySelector('.modal-button-no');

                    yesButton.addEventListener('click', function() {
                        textarea.value = '';
                        textarea.dispatchEvent(new Event('input'));
                        
                        resultText.innerHTML = 'Aguardando classificação...';
                        
                        fileInput.value = '';
                        
                        document.querySelector('#main_section').scrollIntoView({ behavior: 'smooth' });
                        
                        document.body.removeChild(modalOverlay);
                    });

                    noButton.addEventListener('click', function() {
                        document.body.removeChild(modalOverlay);
                    });

                    modalOverlay.addEventListener('click', function(e) {
                        if (e.target === modalOverlay) {
                            document.body.removeChild(modalOverlay);
                        }
                    });
                });

                editButton.addEventListener('click', function() {
                    preElement.classList.add('hidden');
                    textareaElement.classList.remove('hidden');
                    editButton.classList.add('hidden');
                    saveButton.classList.remove('hidden');
                    cancelButton.classList.remove('hidden');
                });

                saveButton.addEventListener('click', function() {
                    const newText = textareaElement.value;
                    preElement.textContent = newText;
                    preElement.classList.remove('hidden');
                    textareaElement.classList.add('hidden');
                    editButton.classList.remove('hidden');
                    saveButton.classList.add('hidden');
                    cancelButton.classList.add('hidden');
                });

                cancelButton.addEventListener('click', function() {
                    textareaElement.value = preElement.textContent;
                    preElement.classList.remove('hidden');
                    textareaElement.classList.add('hidden');
                    editButton.classList.remove('hidden');
                    saveButton.classList.add('hidden');
                    cancelButton.classList.add('hidden');
                });
            } else {
                throw new Error(data.error || 'Erro ao classificar texto');
            }

        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao classificar o texto: ' + error.message);
        }
    });
});