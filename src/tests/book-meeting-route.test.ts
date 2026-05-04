const insertMock = jest.fn();
const setCredentialsMock = jest.fn();
const oauth2CtorMock = jest.fn().mockImplementation(() => ({
  setCredentials: setCredentialsMock,
}));

jest.mock("googleapis", () => ({
  google: {
    auth: {
      OAuth2: oauth2CtorMock,
    },
    calendar: jest.fn(() => ({
      events: {
        insert: insertMock,
      },
    })),
  },
}));

import { POST } from "../../app/api/book-meeting/route";

describe("POST /api/book-meeting", () => {
  const originalEnv = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GOOGLE_CLIENT_ID = originalEnv.GOOGLE_CLIENT_ID;
    process.env.GOOGLE_CLIENT_SECRET = originalEnv.GOOGLE_CLIENT_SECRET;
    process.env.GOOGLE_REDIRECT_URI = originalEnv.GOOGLE_REDIRECT_URI;
    process.env.GOOGLE_REFRESH_TOKEN = originalEnv.GOOGLE_REFRESH_TOKEN;
  });

  afterAll(() => {
    process.env.GOOGLE_CLIENT_ID = originalEnv.GOOGLE_CLIENT_ID;
    process.env.GOOGLE_CLIENT_SECRET = originalEnv.GOOGLE_CLIENT_SECRET;
    process.env.GOOGLE_REDIRECT_URI = originalEnv.GOOGLE_REDIRECT_URI;
    process.env.GOOGLE_REFRESH_TOKEN = originalEnv.GOOGLE_REFRESH_TOKEN;
  });

  test("returns 400 when booking fields are missing", async () => {
    const req = new Request("http://localhost/api/book-meeting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Rimante" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({
      success: false,
      message: "Missing required booking fields.",
    });
  });

  test("returns 500 when Google config is incomplete", async () => {
    delete process.env.GOOGLE_CLIENT_SECRET;

    const req = new Request("http://localhost/api/book-meeting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Rimante",
        email: "rimante@example.com",
        dateTime: "2026-03-13T10:00:00.000Z",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
    expect(json.message).toContain("Google Calendar is not fully configured");
  });

  test("creates calendar event and returns meet link", async () => {
    process.env.GOOGLE_CLIENT_ID = "client";
    process.env.GOOGLE_CLIENT_SECRET = "secret";
    process.env.GOOGLE_REDIRECT_URI = "uri";
    process.env.GOOGLE_REFRESH_TOKEN = "refresh&foo=bar";

    insertMock.mockResolvedValue({
      data: {
        id: "event-123",
        hangoutLink: "https://meet.google.com/abc-defg-hij",
      },
    });

    const req = new Request("http://localhost/api/book-meeting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Rimante",
        email: "rimante@example.com",
        dateTime: "2026-03-13T10:00:00.000Z",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({
      success: true,
      meetLink: "https://meet.google.com/abc-defg-hij",
      eventId: "event-123",
    });

    expect(oauth2CtorMock).toHaveBeenCalledWith("client", "secret", "uri");
    expect(setCredentialsMock).toHaveBeenCalledWith({ refresh_token: "refresh" });
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        calendarId: "primary",
        conferenceDataVersion: 1,
        requestBody: expect.objectContaining({
          summary: "Meeting with Rimante",
          attendees: [{ email: "rimante@example.com" }],
        }),
      })
    );
  });

  test("returns Google error details when booking fails", async () => {
    process.env.GOOGLE_CLIENT_ID = "client";
    process.env.GOOGLE_CLIENT_SECRET = "secret";
    process.env.GOOGLE_REDIRECT_URI = "uri";
    process.env.GOOGLE_REFRESH_TOKEN = "refresh";

    insertMock.mockRejectedValue({
      response: {
        data: {
          error: "Invalid grant",
        },
      },
    });

    const req = new Request("http://localhost/api/book-meeting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Rimante",
        email: "rimante@example.com",
        dateTime: "2026-03-13T10:00:00.000Z",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({
      success: false,
      message: "Booking failed: Invalid grant",
    });
  });
});
