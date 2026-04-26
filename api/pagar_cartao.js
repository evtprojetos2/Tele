export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { token, transaction_amount, description, payment_method_id, email } = req.body || {};
        
        if (!token) {
            return res.status(400).json({ erro: "Falta o token do cartão." });
        }

        const ACCESS_TOKEN = "APP_USR-8126974382900936-122403-60778a71eea0559684f430ac912cc5dd-189761504";

        const response = await fetch("https://api.mercadopago.com/v1/payments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ACCESS_TOKEN}`,
                "X-Idempotency-Key": Math.random().toString(36).substring(2)
            },
            body: JSON.stringify({
                transaction_amount: Number(transaction_amount) || 0,
                token: token,
                description: description || "Agendamento com Cartão",
                installments: 1,
                payment_method_id: payment_method_id || "visa",
                payer: { email: email || "cliente@barbearia.com" }
            })
        });
        
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
}
