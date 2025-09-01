# Case Prático AutoU - Classificador de Emails com IA 🚀

Este projeto foi desenvolvido como parte do processo seletivo da AutoU, simulando uma solução para otimizar a gestão de emails em uma grande empresa do setor financeiro.

A aplicação web utiliza Inteligência Artificial para classificar emails em **Produtivos** ou **Improdutivos** e, com base nessa classificação, sugere uma resposta automática, agilizando o fluxo de trabalho e liberando a equipe de tarefas manuais e repetitivas.

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.2%2B-green.svg)](https://flask.palletsprojects.com/)
[![OpenAI](https://img.shields.io/badge/API-OpenAI-blueviolet.svg)](https://openai.com/)
[![Deployed on Render](https://img.shields.io/badge/Deployed%20On-Render-orange.svg)](https://render.com/)

---

## 📋 Índice

-   [Vídeo de Demonstração](#-vídeo-de-demonstração)
-   [Link da Aplicação](#-link-da-aplicação)
-   [Funcionalidades](#-funcionalidades)
-   [Tecnologias Utilizadas](#-tecnologias-utilizadas)
-   [Estrutura do Projeto](#-estrutura-do-projeto)
-   [Como Executar Localmente](#-como-executar-localmente)
-   [Decisões Técnicas e Aprendizados](#-decisões-técnicas-e-aprendizados)
-   [Autor](#-autor)

## 🎥 Vídeo de Demonstração

Um vídeo de apresentação foi gravado para demonstrar as funcionalidades da aplicação, explicar as escolhas técnicas e resumir o desenvolvimento do projeto.

**➡️ Assistir no YouTube: [Clique Aqui](https://youtu.be/Qy2MkSSJoz0)**

## 🌐 Link da Aplicação

A aplicação está hospedada na nuvem utilizando a plataforma Render e pode ser acessada publicamente através do link abaixo:

**➡️ Acessar a Aplicação: [Clique Aqui](https://ctcaseautou.onrender.com/)**

## ✨ Funcionalidades

-   **Interface Intuitiva:** Frontend limpo e amigável desenvolvido com HTML, CSS e JavaScript puros.
-   **Upload Flexível:** Permite a análise de emails através da inserção direta de texto ou pelo upload de arquivos `.txt` e `.pdf`.
-   **Classificação Inteligente:** Utiliza a API da OpenAI para categorizar o conteúdo do email como "Produtivo" ou "Improdutivo".
-   **Geração de Respostas:** Sugere uma resposta automática e coerente com o contexto do email classificado.
-   **Tour Guiado:** Um tour interativo (`tour.js`) foi implementado para guiar novos usuários pelas funcionalidades da plataforma, melhorando a experiência.

## 🛠️ Tecnologias Utilizadas

A solução foi construída utilizando as seguintes tecnologias e ferramentas:

| Categoria   | Tecnologia/Ferramenta                                  |
| :---------- | :------------------------------------------------------- |
| **Backend** | Python, Flask                                            |
| **Frontend**| HTML5, CSS3, JavaScript (Vanilla)                        |
| **IA & NLP**| OpenAI API (GPT)                                         |
| **Leitura de PDF** | PyMuPDF (fitz)                                           |
| **Deployment**| Render                                                   |
| **Gestão de Dependências**| `requirements.txt` (pip)                                 |
| **Variáveis de Ambiente**| `python-dotenv`                                          |
| **Gestão de Projeto**| Trello (Kanban Board)                                    |
| **Versionamento**| Git & GitHub                                             |

## 📁 Estrutura do Projeto
O repositório está organizado de forma para garantir clareza e manutenibilidade.

## 🚀 Como Executar Localmente
Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

-   [Python 3.9+](https://www.python.org/downloads/)
-   [Git](https://git-scm.com/)
-   Uma chave de API da [OpenAI](https://platform.openai.com/account/api-keys)

### Passos para Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [LINK_DO_SEU_REPOSITORIO_GIT]
    cd CaseAutoU
    ```

2.  **Crie e ative um ambiente virtual:**
    ```bash
    # Para Windows
    python -m venv venv
    .\venv\Scripts\activate

    # Para macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Instale as dependências:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure as variáveis de ambiente:**
    -   Renomeie o arquivo `.env.example` para `.env`.
    -   Abra o arquivo `.env` e insira sua chave da API da OpenAI:
        ```
        OPENAI_API_KEY="sua_chave_de_api_aqui"
        ```

5.  **Execute a aplicação:**
    ```bash
    python main.py
    ```

6.  Abra seu navegador e acesse `http://127.0.0.1:5000` para ver a aplicação funcionando.

## 🧠 Decisões Técnicas e Aprendizados

Durante o desenvolvimento, algumas decisões importantes foram tomadas:

1. **Escolha da API de IA:** Optei pela **API da OpenAI** por sua excelência tanto em tarefas de classificação quanto em geração de linguagem natural. Embora a implementação utilize duas requisições separadas, uma para classificar o email e outra para sugerir a resposta, essa abordagem garante que cada tarefa seja tratada com máxima precisão, entregando um resultado final de qualidade para o usuário.

2.  **Leitura de Arquivos PDF:** Inicialmente, a biblioteca `PyPDF2` foi utilizada para a extração de texto de arquivos PDF. No entanto, durante os testes, ela apresentou dificuldades com certos formatos e codificações. Para garantir maior robustez e compatibilidade, o projeto migrou para a biblioteca **PyMuPDF**, que se mostrou mais eficiente e confiável na extração de conteúdo.

3.  **Backend com Flask:** O **Flask** foi escolhido por ser um micro-framework Python leve, flexível e ideal para a criação de APIs e aplicações web simples como esta, permitindo um desenvolvimento rápido e direto ao ponto.

4.  **Gestão de Tarefas:** Para organizar o fluxo de trabalho e garantir que todos os requisitos do desafio fossem atendidos, utilizei um quadro **Kanban no Trello**. Isso me ajudou a priorizar tarefas, acompanhar o progresso e manter o foco nos entregáveis.

## 👨‍💻 Autor

Desenvolvido por **Cauã Tolentino**.

-   **GitHub:** [@cauatolentino](https://github.com/cauatolentino)
-   **LinkedIn:** [Cauã Tolentino](https://www.linkedin.com/in/cauatolentino/)