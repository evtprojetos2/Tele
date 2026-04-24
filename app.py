from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Sua chave do Telegram
TOKEN = "8327166007:AAEv1ORlE4X2gnKAAlIfhQoD_aUK8UgfANE"
URL = f"https://api.telegram.org/bot{TOKEN}/sendMessage"

# Pega qualquer mensagem que chegar na raiz do site
@app.route('/', defaults={'path': ''}, methods=['POST', 'GET'])
@app.route('/<path:path>', methods=['POST', 'GET'])
def webhook(path):
    if request.method == 'POST':
        # 1. Lê a mensagem enviada pelo Telegram
        update = request.get_json()
        
        # 2. Verifica se é uma mensagem de texto normal
        if update and "message" in update and "text" in update["message"]:
            texto = update["message"]["text"]
            chat_id = update["message"]["chat"]["id"]
            nome = update["message"]["from"].get("first_name", "Parceiro")

            # 3. Responde apenas quando clicam em INICIAR
            if texto == "/start":
                mensagem = (
                    f"💈 *Olá, {nome}! Bem-vindo ao Sistema de Notificações.*\n\n"
                    "Seu assistente virtual está pronto para trabalhar. "
                    "Sempre que um cliente fizer um agendamento, eu vou te avisar aqui na hora!\n\n"
                    "👇 *COPIE O CÓDIGO ABAIXO:*\n"
                    f"`{chat_id}`\n\n"
                    "Volte no seu Painel Gestor, cole esse código na aba 'Design' e clique em 'Atualizar Meu App'."
                )
                
                # Devolve a mensagem para o usuário no Telegram
                requests.post(URL, json={"chat_id": chat_id, "text": mensagem, "parse_mode": "Markdown"})

    # 4. Avisa a Vercel que deu tudo certo
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    app.run()
    
