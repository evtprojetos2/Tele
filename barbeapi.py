import json
import requests
from http.server import BaseHTTPRequestHandler

# Sua chave do Telegram
TOKEN = "8327166007:AAEv1ORlE4X2gnKAAlIfhQoD_aUK8UgfANE"
URL = f"https://api.telegram.org/bot{TOKEN}/sendMessage"

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # 1. Lê a mensagem que o Telegram enviou para a Vercel
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        update = json.loads(post_data)

        # 2. Verifica se é uma mensagem de texto
        if "message" in update and "text" in update["message"]:
            texto = update["message"]["text"]
            chat_id = update["message"]["chat"]["id"]
            nome = update["message"]["from"].get("first_name", "Parceiro")

            # 3. Se a pessoa clicou em INICIAR (comando /start)
            if texto == "/start":
                mensagem = (
                    f"💈 *Olá, {nome}! Bem-vindo ao Sistema de Notificações.*\n\n"
                    "Seu assistente virtual está pronto para trabalhar. "
                    "Sempre que um cliente fizer um agendamento, eu vou te avisar aqui na hora!\n\n"
                    "👇 *COPIE O CÓDIGO ABAIXO:*\n"
                    f"`{chat_id}`\n\n"
                    "Volte no seu Painel Gestor, cole esse código na aba 'Design' e salve para ativar."
                )
                
                # Manda a resposta de volta para o Telegram
                requests.post(URL, json={"chat_id": chat_id, "text": mensagem, "parse_mode": "Markdown"})

        # 4. Responde "OK" para a Vercel encerrar o processo com sucesso
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"OK")
      
