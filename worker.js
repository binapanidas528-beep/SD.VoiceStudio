export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const { text, lang, gender } = await request.json();
      if (!text) {
        return new Response(JSON.stringify({ error: "Text is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      let voice = gender === 'male' ? 'Raveena' : 'Aditi';
      if (lang === 'en') voice = gender === 'male' ? 'Brian' : 'Emma';
      else if (lang === 'bn') voice = 'Tanusree';

      const ttsUrl = `https://api.streamelements.com/kappa/v2/speech?voice=${voice}&text=${encodeURIComponent(text)}`;
      
      // CRITICAL FIX: Adding User-Agent so StreamElements accepts the request
      const ttsRes = await fetch(ttsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });

      if (!ttsRes.ok) throw new Error("Audio generation failed from server.");

      const audioBuffer = await ttsRes.arrayBuffer();

      return new Response(audioBuffer, {
        headers: {
          ...corsHeaders,
          "Content-Type": "audio/mpeg",
          "Content-Disposition": 'attachment; filename="audio.mp3"'
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
