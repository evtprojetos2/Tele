export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const { id } = req.query;
    if (!id) return res.status(400).json({ erro: "ID não informado" });

    // SEU COFRE BLINDADO NA VERCEL
    const ACCESS_TOKEN = "APP_USR-8126974382900936-122403-60778a71eea0559684f430ac912cc5dd-189761504";

    try {
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
            headers: { "Authorization": `Bearer ${ACCESS_TOKEN}` }
        });
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao checar pagamento" });
    }
}
