export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    let id = req.query ? req.query.id : null;
    let token_loja = req.query ? req.query.token_loja : null;

    if (!id) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        id = url.searchParams.get('id');
        token_loja = url.searchParams.get('token_loja');
    }

    if (!id || id === 'undefined' || id === 'null') {
        return res.status(400).json({ erro: "ID ausente." });
    }

    const TOKEN_DONO = "APP_USR-8126974382900936-122403-60778a71eea0559684f430ac912cc5dd-189761504";
    const ACCESS_TOKEN = token_loja || TOKEN_DONO;

    try {
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${ACCESS_TOKEN}` }
        });
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (e) {
        return res.status(500).json({ erro: "Erro de conexão." });
    }
}
