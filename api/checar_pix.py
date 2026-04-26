from http.server import BaseHTTPRequestHandler
import json
import urllib.request
import urllib.parse

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Extrai o ID do pagamento da URL
        parsed_path = urllib.parse.urlparse(self.path)
        query = urllib.parse.parse_qs(parsed_path.query)
        payment_id = query.get('id', [None])[0]

        if not payment_id:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"erro": "ID não informado"}).encode('utf-8'))
            return

        # SEU COFRE BLINDADO: Token do Mercado Pago
        access_token = "APP_USR-8126974382900936-122403-60778a71eea0559684f430ac912cc5dd-189761504"

        # Bate na porta do Mercado Pago perguntando o status
        req = urllib.request.Request(f"https://api.mercadopago.com/v1/payments/{payment_id}")
        req.add_header('Authorization', f'Bearer {access_token}')

        try:
            response = urllib.request.urlopen(req)
            res_body = response.read()
            self.send_response(200)
        except urllib.error.HTTPError as e:
            res_body = e.read()
            self.send_response(e.code)

        # Devolve o status para o App
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(res_body)
