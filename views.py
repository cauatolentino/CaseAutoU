from main import app
from flask import render_template, request, jsonify
import PyPDF2
import io
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # Substitua pela sua chave API

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Nenhum arquivo selecionado'}), 400

    try:
        if file.filename.endswith('.txt'):
            content = file.read().decode('utf-8')
            return jsonify({'text': content})
            
        elif file.filename.endswith('.pdf'):
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file.read()))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return jsonify({'text': text})
            
        else:
            return jsonify({'error': 'Formato de arquivo não suportado'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/classify', methods=['POST'])
def classify_email():
    try:
        data = request.json
        email_text = data.get('text', '')
        
        if not email_text:
            return jsonify({'error': 'Texto não fornecido'}), 400

        # Primeiro, classificar o email
        classification_response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "Se comporte como um classificador de emails de uma empresa do setor financeiro. Classifique o email fornecido como 'PRODUTIVO' ou 'IMPRODUTIVO'. Sabendo que produtivo: Emails que requerem uma ação ou resposta específica (ex.: solicitações de suporte técnico, atualização sobre casos em aberto, dúvidas sobre o sistema) e improdutivo: Emails que não necessitam de uma ação imediata (ex.: mensagens de felicitações, agradecimentos). Responda apenas com a palavra 'PRODUTIVO' ou 'IMPRODUTIVO'."},
                {"role": "user", "content": email_text}
            ]
        )
        
        classification = classification_response.choices[0].message.content.strip()

        formated_classification = ""
        if classification.upper() == "PRODUTIVO":
            formated_classification = "PRODUTIVO ✅"
        elif classification.upper() == "IMPRODUTIVO":
            formated_classification = "IMPRODUTIVO ❌"
        else:
            formated_classification = classification

        # Depois, gerar uma resposta adequada baseada na classificação
        response_prompt = f"""Com base no seguinte email e sua classificação como {classification}, gere uma resposta profissional e adequada.
        
        Email original:
        {email_text}

        Regras para a resposta:
        - Se for PRODUTIVO: Forneça uma resposta objetiva e acionável, abordando as questões levantadas
        - Se for IMPRODUTIVO: Envie uma resposta cordial mas breve de agradecimento
        - Mantenha um tom profissional e cortês
        - Inclua saudação inicial e despedida
        - Máximo de 4 parágrafos
        """

        response_completion = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "Se comporte como um assistente profissional especializado em redigir respostas para emails corporativos."},
                {"role": "user", "content": response_prompt}
            ]
        )

        suggested_response = response_completion.choices[0].message.content.strip()
        
        return jsonify({
            'classification': formated_classification,
            'text': email_text,
            'suggested_response': suggested_response
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500