export default async function handler(req, res) {
    // Hanya izinkan request POST dari frontend kita
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method tidak diizinkan' });
    }

    try {
        const { messages } = req.body;
        
        // Mengambil API Key dari brankas Environment Variable Vercel
        const API_KEY = process.env.GROQ_API_KEY;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'openai/gpt-oss-120b', // Model AI kamu
                messages: messages,
                temperature: 0.7,
                max_tokens: 500,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Kirim jawaban balik ke frontend HTML
        res.status(200).json(data);

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: 'Terjadi kesalahan di server' });
    }
}