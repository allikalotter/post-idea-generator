export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { niche, style } = req.body;

    if (!niche) {
      return res.status(400).json({ error: "Missing niche." });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY in Vercel." });
    }

    const prompt = `Generate 10 simple, practical social media post ideas for a ${niche} business. The content style should be ${style}. For each idea, include a post title, content angle, caption hook, and suggested format. Keep the ideas easy for a small business owner to create.`;

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.8
      })
    });

    const data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      return res.status(500).json({
        error: data.error?.message || "OpenAI request failed."
      });
    }

    const result = data.choices?.[0]?.message?.content;

    if (!result) {
      return res.status(500).json({
        error: "No content was returned from OpenAI."
      });
    }

    return res.status(200).json({ result });

  } catch (error) {
    return res.status(500).json({
      error: error.message || "Something went wrong."
    });
  }
}
