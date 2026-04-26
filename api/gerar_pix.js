export default async function handler(req, res) {
    // 1. Libera a catraca do CORS (Permite que o seu HTML converse com a Vercel)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Responde ao "Preflight" do navegador
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Só aceita requisições POST
    if (req.method !== 'POST') {
        return res.status(405).json({ erro: 'Método não permitido. Use POST.' });
    }

    // 2. Recebe os dados do aplicativo
    const { preco, descricao, email = "cliente@barbearia.com" } = req.body;
    
    // 3. O SEU COFRE BLINDADO: Token do Mercado Pago
    const ACCESS_TOKEN = "APP_USR-8126974382900936-122403-60778a71eea0559684f430ac912cc5dd-189761504";

    // 4. Manda a ordem de cobrança pro Mercado Pago
    try {
        const response = await fetch("https://api.mercadopago.com/v1/payments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ACCESS_TOKEN}`,
                "X-Idempotency-Key": Math.random().toString(36).substring(2) // Gera ID único
            },
            body: JSON.stringify({
                transaction_amount: Number(preco),
                description: descricao,
                payment_method_id: "pix",
                payer: { email: email }
            })
        });
        
        const data = await response.json();
        
        // 5. Devolve o QR Code para o HTML
        return res.status(response.status).json(data);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: "Erro interno ao comunicar com o Mercado Pago" });
    }
}
