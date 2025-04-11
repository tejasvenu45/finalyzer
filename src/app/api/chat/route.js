

export async function POST(req) {
    try {
      const { message } = await req.json();
      const apiKey = process.env.GEMINI_API_KEY;
  
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: message }],
              },
            ],
          }),
        }
      );
  
      const result = await response.json();
      const text =
        result?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  
      return Response.json({
        success: true,
        data: {
          prompt: message,
          response: text,
        },
      });
    } catch (error) {
      console.error("❌ Gemini REST API Error:", error);
      return Response.json(
        {
          success: false,
          error: "Something went wrong",
          details: error.message,
        },
        { status: 500 }
      );
    }
  }