export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { niche, style } = req.body;

    const prompt = `Generate 10 simple, practical social media post ideas for a ${niche} business. The content style should be ${style}. For each idea, include:
- Post title
- Content angle
- Caption hook
- Suggested format

Keep the ideas easy for a small business owner to create without a professional content team.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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

    const data = await response.json();

if (!data.choices || !data.choices[0]) {
  return res.status(500).json({
    error: data.error?.message || "OpenAI did not return a valid response."
  });
}

res.status(200).json({
  result: data.choices[0].message.content
});
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong generating ideas."
    });
  }
}
