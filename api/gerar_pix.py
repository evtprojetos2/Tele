from http.server import BaseHTTPRequestHandler
import json
import urllib.request
import uuid

class handler(BaseHTTPRequestHandler):
    # Libera o CORS (Permite que o seu app HTML converse com o Python)
    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        # Lê os dados enviados pelo seu JavaScript
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        body = json.loads(post_data.decode('utf-8'))

        preco = float(body.get('preco', 0))
        descricao = body.get('descricao', 'Agendamento Barbearia')
        email = body.get('email', 'cliente@barbearia.com')

        # SEU COFRE BLINDADO: Token do Mercado Pago
        access_token = "APP_USR-8126974382900936-122403-60778a71eea0559684f430ac912cc5dd-189761504"

        # Prepara a carga para o Mercado Pago
        mp_data = {
            "transaction_amount": preco,
            "description": descricao,
            "payment_method_id": "pix",
            "payer": {
                "email": email
            }
        }

        # Cria a requisição HTTP
        req = urllib.request.Request("https://api.mercadopago.com/v1/payments")
        req.add_header('Content-Type', 'application/json')
        req.add_header('Authorization', f'Bearer {access_token}')
        req.add_header('X-Idempotency-Key', str(uuid.uuid4()))

        try:
            # Envia para o MP e pega a resposta
            response = urllib.request.urlopen(req, json.dumps(mp_data).encode('utf-8'))
            res_body = response.read()
            self.send_response(200)
        except urllib.error.HTTPError as e:
            res_body = e.read()
            self.send_response(e.code)

        # Devolve a resposta para o seu App
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(res_body)
