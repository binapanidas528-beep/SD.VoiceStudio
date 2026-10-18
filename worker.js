export default {
  async fetch(request) {
    const url = new URL(request.url);

    // TTS API proxy handler
    if (url.pathname.startsWith("/api/tts")) {
      const text = url.searchParams.get("text") || "Hello";
      const lang = url.searchParams.get("lang") || "hi";
      const gender = url.searchParams.get("gender") || "female";

      let voiceName = gender === "male" ? "Raveena" : "Aditi";
      if (lang === "en") voiceName = gender === "male" ? "Brian" : "Emma";
      if (lang === "bn") voiceName = "Tanusree";

      const streamUrl = `https://api.streamelements.com/kappa/v2/speech?voice=${voiceName}&text=${encodeURIComponent(text)}`;

      const audioRes = await fetch(streamUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
      });

      const audioBuffer = await audioRes.arrayBuffer();

      return new Response(audioBuffer, {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache"
        }
      });
    }

    return fetch(request);
  }
};
