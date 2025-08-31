document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.querySelector('#text_section textarea');
    const button = document.querySelector('#classify_button');
    const fileInput = document.querySelector('#email_uploads');

    let isClassifying = false;
    
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
        if (!text || isClassifying) return;

        try {
            // Ativa o estado de loading
            isClassifying = true;
            button.disabled = true;
            button.classList.remove('active');
            button.classList.add('loading');
            const originalText = button.innerHTML;
            button.innerHTML = '<span class="spinner-wrapper"><span class="material-symbols-outlined icon-spin">progress_activity</span></span> Classificando...';

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
<strong>Resposta Sugerida:</strong>
<div class="response-content">
<pre>${data.suggested_response}</pre>
<textarea class="response-textarea hidden">${data.suggested_response}</textarea>
</div>
<div class="response-actions">
    <button class="edit-button"><span class="material-symbols-outlined icon-edit">edit</span>Editar Resposta</button>
    <button class="save-button hidden">Salvar</button>
    <button class="cancel-button hidden">Cancelar</button>
</div><button class="new-classification-button"><span class="material-symbols-outlined icon-cached">cached</span>Classificar Novo Email</button>`;


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
            }else{
                throw new Error(data.error || 'Erro ao classificar texto');
            }

        }catch(error){
            console.error('Erro:', error);
            alert('Erro ao classificar o texto: ' + error.message);
        }finally{
            // Restaura o estado original do botão
            isClassifying = false;
            button.disabled = false;
            button.classList.remove('loading');
            if (textarea.value.trim() !== '') {
                button.classList.add('active');
            }
            button.innerHTML = '<span class="material-symbols-outlined icon-mail">mail</span>Classificar Email';
        }
    });
});

// Função para o tour de ajuda
function startTour() {
    const tourSteps = [
        {
            element: '#upload_section',
            title: 'Upload de Arquivo',
            text: 'Aqui você pode fazer upload de um arquivo TXT ou PDF contendo o email que deseja classificar.'
        },
        {
            element: '#text_section',
            title: 'Área de Texto',
            text: 'Ou você pode colar diretamente o conteúdo do email nesta área de texto.'
        },
        {
            element: '#classify_button',
            title: 'Classificação',
            text: 'Após inserir o texto, clique aqui para classificar o email e receber uma sugestão de resposta.'
        },
        {
            element: '#result_section',
            title: 'Resultado',
            text: 'Aqui aparecerá a classificação do email e a sugestão de resposta.'
        }
    ];

    let currentStep = 0;

    function createTourElement() {
        const overlay = document.createElement('div');
        overlay.className = 'tour-overlay';
        document.body.appendChild(overlay);
        return overlay;
    }

    function showStep(step) {
        const element = document.querySelector(step.element);
        
        // Scroll elemento para a view se necessário
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Aguarda o scroll terminar antes de posicionar os elementos
        setTimeout(() => {
            const elementRect = element.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Create highlight com posição absoluta
            const highlight = document.createElement('div');
            highlight.className = 'tour-highlight';
            highlight.style.position = 'absolute';  // Mudança para position absolute
            highlight.style.top = `${elementRect.top + scrollTop - 5}px`;
            highlight.style.left = `${elementRect.left - 5}px`;
            highlight.style.width = `${elementRect.width + 10}px`;
            highlight.style.height = `${elementRect.height + 10}px`;
            document.body.appendChild(highlight);

            // Create tooltip com posição absoluta
            const tooltip = document.createElement('div');
            tooltip.className = 'tour-tooltip';
            tooltip.innerHTML = `
                <h3>${step.title}</h3>
                <p>${step.text}</p>
                <div class="tour-buttons">
                    <button class="tour-button tour-skip">Pular Tour</button>
                    <button class="tour-button tour-next">${currentStep === tourSteps.length - 1 ? 'Finalizar' : 'Próximo'}</button>
                </div>
            `;

            // Position tooltip considerando o scroll
            const tooltipHeight = 120;
            let tooltipTop = elementRect.bottom + scrollTop + 10;
            
            // Verifica se o tooltip vai ficar fora da tela
            if (tooltipTop + tooltipHeight > window.innerHeight + scrollTop) {
                tooltipTop = elementRect.top + scrollTop - tooltipHeight - 10;
            }

            tooltip.style.position = 'absolute';  // Mudança para position absolute
            tooltip.style.top = `${tooltipTop}px`;
            tooltip.style.left = `${elementRect.left}px`;
            document.body.appendChild(tooltip);

            // Add event listeners
            const nextButton = tooltip.querySelector('.tour-next');
            const skipButton = tooltip.querySelector('.tour-skip');

            nextButton.addEventListener('click', () => {
                highlight.remove();
                tooltip.remove();
                if (currentStep < tourSteps.length - 1) {
                    currentStep++;
                    showStep(tourSteps[currentStep]);
                } else {
                    document.querySelector('.tour-overlay').remove();
                }
            });

            skipButton.addEventListener('click', () => {
                highlight.remove();
                tooltip.remove();
                document.querySelector('.tour-overlay').remove();
            });
        }, 500); // Aguarda 500ms para o scroll terminar
    }

    createTourElement();
    showStep(tourSteps[0]);
}

document.getElementById('startTour').addEventListener('click', startTour);