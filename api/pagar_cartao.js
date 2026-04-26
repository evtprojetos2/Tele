export default async function handler(req, res) {
    // Libera a comunicação com o seu HTML
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ erro: 'Utilize POST' });

    const { token, transaction_amount, description, email, payment_method_id } = req.body;
    
    // O SEU COFRE BLINDADO: Access Token do Mercado Pago
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
                transaction_amount: Number(transaction_amount),
                token: token, // O cartão criptografado que veio do HTML
                description: description,
                installments: 1, // Pagamento a pronto
                payment_method_id: payment_method_id || "visa",
                payer: { email: email || "cliente@barbearia.com" }
            })
        });
        
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        return res.status(500).json({ erro: "Erro interno ao processar o cartão." });
    }
}
