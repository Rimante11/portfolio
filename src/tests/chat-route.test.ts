import { POST } from "../../app/api/chat/route";

describe("POST /api/chat", () => {
  const originalApiKey = process.env.OPENAI_API_KEY;
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env.OPENAI_API_KEY = originalApiKey;
    global.fetch = originalFetch;
  });

  afterAll(() => {
    process.env.OPENAI_API_KEY = originalApiKey;
    global.fetch = originalFetch;
  });

  test("returns 400 when messages are missing", async () => {
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({
      success: false,
      message: "No chat messages provided.",
    });
  });

  test("returns rotating quick-prompt reply for repeated 'about me'", async () => {
    const firstReq = new Request("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: "About me" }],
        isQuickPrompt: true,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const firstRes = await POST(firstReq);
    const firstJson = await firstRes.json();

    expect(firstRes.status).toBe(200);
    expect(firstJson.success).toBe(true);
    expect(firstJson.reply).toContain("big dog lover");

    const secondReq = new Request("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [
          { role: "user", content: "About me" },
          { role: "assistant", content: firstJson.reply },
          { role: "user", content: "About me" },
        ],
        isQuickPrompt: true,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const secondRes = await POST(secondReq);
    const secondJson = await secondRes.json();

    expect(secondRes.status).toBe(200);
    expect(secondJson.success).toBe(true);
    expect(secondJson.reply).toContain("dog enthusiast");
    expect(secondJson.reply).not.toBe(firstJson.reply);
  });

  test("does not call OpenAI for quick prompts", async () => {
    const fetchSpy = jest.fn();
    global.fetch = fetchSpy as unknown as typeof fetch;

    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: "Skills" }],
        isQuickPrompt: true,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test("routes typed 'About me' to OpenAI when not a quick button click", async () => {
    process.env.OPENAI_API_KEY = "test-key";

    const fetchSpy = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "OpenAI general response" } }],
      }),
    });
    global.fetch = fetchSpy as unknown as typeof fetch;

    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: "About me" }],
        isQuickPrompt: false,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ success: true, reply: "OpenAI general response" });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  test("returns 500 when OpenAI key is missing for non-quick prompts", async () => {
    delete process.env.OPENAI_API_KEY;

    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: "Tell me about your latest project" }],
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({
      success: false,
      message: "Missing OPENAI_API_KEY in .env.local",
    });
  });

  test("calls OpenAI and returns completion for non-quick prompts", async () => {
    process.env.OPENAI_API_KEY = "test-key";

    const fetchSpy = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "Mocked OpenAI response" } }],
      }),
    });

    global.fetch = fetchSpy as unknown as typeof fetch;

    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: "What projects are featured?" }],
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ success: true, reply: "Mocked OpenAI response" });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      "https://api.openai.com/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
        }),
      })
    );
  });
});
