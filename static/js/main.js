import { startTour } from './tour.js';
import * as api from './api.js';

// =================================================================
// 1. SELETORES DE DOM E ESTADO DA APLICAÇÃO
// =================================================================

const UI = {
    textarea: document.querySelector('#text_section textarea'),
    classifyButton: document.querySelector('#classify_button'),
    fileInput: document.querySelector('#email_uploads'),
    resultContainer: document.querySelector('#result_text'),
    resultTemplate: document.querySelector('#result-template'),
    mainSection: document.querySelector('#main_section'),
    tourButton: document.getElementById('startTour'),
};

const state = {
    isClassifying: false,
    originalButtonHTML: '<span class="material-symbols-outlined icon-mail">mail</span>Classificar Email',
    loadingButtonHTML: '<span class="spinner-wrapper"><span class="material-symbols-outlined icon-spin">progress_activity</span></span> Classificando...',
};

// =================================================================
// 2. FUNÇÕES DE MANIPULAÇÃO DA UI (INTERFACE)
// =================================================================

/**
 * Atualiza o estado (ativo/inativo) do botão de classificar com base no conteúdo do textarea.
 */
function updateButtonState() {
    const hasText = UI.textarea.value.trim() !== '';
    UI.classifyButton.disabled = !hasText;
    UI.classifyButton.classList.toggle('active', hasText);
}

/**
 * Controla o estado de carregamento (loading) do botão de classificar.
 * @param {boolean} isLoading - True para mostrar o spinner, false para reverter ao normal.
 */
function setClassifyButtonLoading(isLoading) {
    state.isClassifying = isLoading;
    UI.classifyButton.disabled = isLoading;
    UI.classifyButton.classList.toggle('loading', isLoading);
    UI.classifyButton.innerHTML = isLoading ? state.loadingButtonHTML : state.originalButtonHTML;
    if (!isLoading) {
        updateButtonState(); // Reavalia o estado do botão ao final do loading
    }
}

/** Atualiza a interface com o resultado da classificação.
 * @param {object} data - O objeto de dados retornado pela API.
 */
function updateUIWithResult(data) {
    UI.resultContainer.innerHTML = ''; // Limpa o container
    const templateClone = UI.resultTemplate.content.firstElementChild.cloneNode(true);


    const classificationText = templateClone.querySelector('.classification-text');
    if (data.classification === 'PRODUTIVO') {
        classificationText.textContent = 'PRODUTIVO ✅';
        classificationText.classList.add('is-productive');
    } else {
        classificationText.textContent = 'IMPRODUTIVO ❌';
        classificationText.classList.add('is-unproductive');
    }

    templateClone.querySelector('.response-pre').textContent = data.suggested_response;
    templateClone.querySelector('.response-textarea').value = data.suggested_response;

    UI.resultContainer.appendChild(templateClone);
}

/**
 * Reseta a interface para o estado inicial, limpando campos e resultados.
 */
function resetUI() {
    UI.textarea.value = '';
    UI.fileInput.value = '';
    UI.resultContainer.innerHTML = 'Aguardando classificação...';
    updateButtonState();
    UI.mainSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Mostra um modal de confirmação para o usuário.
 */
function showConfirmationModal() {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
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
    document.body.appendChild(modalOverlay);

    const closeModal = () => document.body.removeChild(modalOverlay);

    modalOverlay.querySelector('.modal-button-yes').addEventListener('click', () => {
        resetUI();
        closeModal();
    });
    modalOverlay.querySelector('.modal-button-no').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}

// =================================================================
// 3. MANIPULADORES DE EVENTOS (EVENT HANDLERS)
// =================================================================

/**
 * Lida com a seleção de um arquivo.
 * @param {Event} e - O objeto do evento.
 */
async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.match(/\.(txt|pdf)$/i)) {
        alert('Por favor, envie apenas arquivos TXT ou PDF');
        return;
    }

    try {
        const data = await api.uploadFileAndGetTex(file);
        UI.textarea.value = data.text;
        updateButtonState(); // Dispara a atualização do botão
    } catch (error) {
        console.error('Erro no upload:', error);
        alert('Erro ao processar o arquivo: ' + error.message);
    }
}

/**
 * Lida com o clique no botão de classificar.
 */
async function handleClassifyClick() {
    const text = UI.textarea.value.trim();
    if (!text || state.isClassifying) return;

    setClassifyButtonLoading(true);

    try {
        const classificationData = await api.classifyText(text);
        updateUIWithResult(classificationData);
    } catch (error) {
        console.error('Erro na classificação:', error);
        alert('Erro ao classificar o texto: ' + error.message);
    } finally {
        setClassifyButtonLoading(false);
    }
}

/**
 * Lida com cliques nos botões de ação dentro da área de resultado (Editar, Salvar, etc.).
 * Usa a delegação de eventos.
 * @param {Event} e - O objeto do evento.
 */
function handleResultActions(e) {
    const button = e.target.closest('button');
    if (!button) return;

    const resultContainer = UI.resultContainer;
    const preElement = resultContainer.querySelector('pre');
    const textareaElement = resultContainer.querySelector('.response-textarea');
    const editButton = resultContainer.querySelector('.edit-button');
    const saveButton = resultContainer.querySelector('.save-button');
    const cancelButton = resultContainer.querySelector('.cancel-button');

    // Função auxiliar para alternar a visibilidade dos elementos
    const toggleEditMode = (isEditing) => {
        preElement.classList.toggle('hidden', isEditing);
        textareaElement.classList.toggle('hidden', !isEditing);
        editButton.classList.toggle('hidden', isEditing);
        saveButton.classList.toggle('hidden', !isEditing);
        cancelButton.classList.toggle('hidden', !isEditing);
    };

    if (button.matches('.edit-button')) {
        toggleEditMode(true);
    } else if (button.matches('.save-button')) {
        preElement.textContent = textareaElement.value;
        toggleEditMode(false);
    } else if (button.matches('.cancel-button')) {
        textareaElement.value = preElement.textContent; // Restaura o valor original
        toggleEditMode(false);
    } else if (button.matches('.new-classification-button')) {
        showConfirmationModal();
    }
}


// =================================================================
// 4. Listeners de Eventos
// =================================================================

UI.tourButton.addEventListener('click', startTour);
UI.textarea.addEventListener('input', updateButtonState);
UI.fileInput.addEventListener('change', handleFileChange);
UI.classifyButton.addEventListener('click', handleClassifyClick);

UI.resultContainer.addEventListener('click', handleResultActions);