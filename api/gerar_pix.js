export default async function handler(req, res) {
    // Permite que seu app converse com a Vercel sem dar erro de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ erro: 'Método não permitido' });
    }

    const { preco, descricao, email = "cliente@barbearia.com" } = req.body;
    
    // SEU COFRE BLINDADO NA VERCEL
    const ACCESS_TOKEN = "APP_USR-8126974382900936-122403-60778a71eea0559684f430ac912cc5dd-189761504";

    try {
        const response = await fetch("https://api.mercadopago.com/v1/payments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ACCESS_TOKEN}`,
                "X-Idempotency-Key": Math.random().toString(36).substring(2)
            },
            body: JSON.stringify({
                transaction_amount: Number(preco),
                description: descricao,
                payment_method_id: "pix",
                payer: { email: email }
            })
        });
        
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao comunicar com Mercado Pago" });
    }
}
