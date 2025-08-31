/**
 * Implementa um tour interativo para guiar novos usuários pela interface.
 */
export function startTour() {
    const tourSteps = [
        {
            element: '#upload_section',
            title: 'Upload de Arquivo',
            text: 'Aqui você pode fazer upload de um arquivo TXT ou PDF contendo o email que deseja classificar.'
        },
        {
            element: '#text_section',
            title: 'Área de Texto',
            text: 'Aqui você pode colar diretamente o conteúdo do email nesta área de texto.'
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
        }, 500);
    }

    createTourElement();
    showStep(tourSteps[0]);
}