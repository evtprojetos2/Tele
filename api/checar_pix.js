export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Extração de ID ultra segura
    let id = req.query ? req.query.id : null;
    if (!id) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        id = url.searchParams.get('id');
    }

    // Se o ID estiver vazio, bloqueamos antes que o Mercado Pago dê erro
    if (!id || id === 'undefined' || id === 'null') {
        return res.status(400).json({ erro: "ID do pagamento inválido ou ausente." });
    }

    const ACCESS_TOKEN = "APP_USR-8126974382900936-122403-60778a71eea0559684f430ac912cc5dd-189761504";

    try {
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${ACCESS_TOKEN}` }
        });
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (e) {
        return res.status(500).json({ erro: "Erro de conexão com o Mercado Pago." });
    }
}
