const listMock = jest.fn();
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
        list: listMock,
      },
    })),
  },
}));

import { POST } from "../../app/api/available-slots/route";

describe("POST /api/available-slots", () => {
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

  test("returns 400 when date is missing", async () => {
    const req = new Request("http://localhost/api/available-slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({ success: false, message: "Date is required" });
  });

  test("returns 500 when Google config is missing", async () => {
    delete process.env.GOOGLE_CLIENT_ID;

    const req = new Request("http://localhost/api/available-slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: "2026-03-13" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ success: false, message: "Google Calendar not configured" });
  });

  test("returns formatted booked slots on success", async () => {
    process.env.GOOGLE_CLIENT_ID = "client";
    process.env.GOOGLE_CLIENT_SECRET = "secret";
    process.env.GOOGLE_REDIRECT_URI = "uri";
    process.env.GOOGLE_REFRESH_TOKEN = "refresh&scope=calendar";

    const dateOneStart = "2026-03-13T10:00:00+01:00";
    const dateOneEnd = "2026-03-13T12:00:00+01:00";
    const dateTwoStart = "2026-03-13T14:05:00+01:00";
    const dateTwoEnd = "2026-03-13T14:35:00+01:00";

    listMock.mockResolvedValue({
      data: {
        items: [
          { start: { dateTime: dateOneStart }, end: { dateTime: dateOneEnd } },
          { start: { dateTime: dateTwoStart }, end: { dateTime: dateTwoEnd } },
          { start: {} },
        ],
      },
    });

    const req = new Request("http://localhost/api/available-slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: "2026-03-13" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({
      success: true,
      bookedSlots: ["10:00", "10:30", "11:00", "11:30", "14:00", "14:30"],
    });

    expect(oauth2CtorMock).toHaveBeenCalledWith("client", "secret", "uri");
    expect(setCredentialsMock).toHaveBeenCalledWith({ refresh_token: "refresh" });
    expect(listMock).toHaveBeenCalledTimes(1);
    expect(listMock).toHaveBeenCalledWith(
      expect.objectContaining({
        timeZone: "Europe/Stockholm",
      })
    );
  });

  test("returns Google error details when API call fails", async () => {
    process.env.GOOGLE_CLIENT_ID = "client";
    process.env.GOOGLE_CLIENT_SECRET = "secret";
    process.env.GOOGLE_REDIRECT_URI = "uri";
    process.env.GOOGLE_REFRESH_TOKEN = "refresh";

    listMock.mockRejectedValue({
      response: {
        data: {
          error_description: "Token expired",
        },
      },
    });

    const req = new Request("http://localhost/api/available-slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: "2026-03-13" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({
      success: false,
      message: "Failed to fetch slots: Token expired",
    });
  });
});
