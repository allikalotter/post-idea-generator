export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed." });
  }

  const { niche, style } = req.body;

  if (!niche) {
    return res.status(400).json({ error: "Missing niche." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY is missing in Vercel." });
  }

  try {
    const prompt = `Generate 10 simple social media post ideas for a ${niche} business.

Content style: ${style}

For each idea, include:
1. Post title
2. Content angle
3. Caption hook
4. Suggested format

Keep the ideas practical and easy for a small business owner to create.`;

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
        ]
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
        error: "OpenAI returned no result."
      });
    }

    return res.status(200).json({ result });

  } catch (error) {
    return res.status(500).json({
      error: error.message || "Something went wrong."
    });
  }
}
