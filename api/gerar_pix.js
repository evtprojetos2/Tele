export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const body = req.body || {};
        
        // O SEU TOKEN (Recebe a Mensalidade do SaaS)
        const TOKEN_DONO = "APP_USR-8126974382900936-122403-60778a71eea0559684f430ac912cc5dd-189761504";
        
        // Se vier um token do aplicativo cliente, usa o dele. Se não, usa o seu.
        const ACCESS_TOKEN = body.token_loja || TOKEN_DONO;

        const response = await fetch("https://api.mercadopago.com/v1/payments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ACCESS_TOKEN}`,
                "X-Idempotency-Key": Math.random().toString(36).substring(2)
            },
            body: JSON.stringify({
                transaction_amount: Number(body.preco) || 0,
                description: body.descricao || "Pagamento",
                payment_method_id: "pix",
                payer: { email: body.email || "cliente@app.com" }
            })
        });
        
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (e) {
        return res.status(500).json({ erro: e.message });
    }
}
