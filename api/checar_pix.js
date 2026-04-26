export default async function handler(req, res) {
    // Libera a catraca do CORS
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Pega o ID do pagamento que o App enviou
    const { id } = req.query;
    
    if (!id) {
        return res.status(400).json({ erro: "ID do pagamento não informado" });
    }

    // O SEU COFRE BLINDADO
    const ACCESS_TOKEN = "APP_USR-8126974382900936-122403-60778a71eea0559684f430ac912cc5dd-189761504";

    try {
        // Pergunta ao Mercado Pago o status daquele ID
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
            headers: { "Authorization": `Bearer ${ACCESS_TOKEN}` }
        });
        
        const data = await response.json();
        
        // Devolve o status ('approved', 'pending', etc) para o App
        return res.status(response.status).json(data);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: "Erro interno ao checar pagamento" });
    }
}
