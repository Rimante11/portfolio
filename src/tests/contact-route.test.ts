import nodemailer from "nodemailer";
import { POST } from "../../app/api/contact/route";

jest.mock("nodemailer", () => ({
  __esModule: true,
  default: {
    createTransport: jest.fn(),
  },
}));

describe("POST /api/contact", () => {
  const originalEmailUser = process.env.EMAIL_USER;
  const originalEmailPass = process.env.EMAIL_PASS;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EMAIL_USER = originalEmailUser;
    process.env.EMAIL_PASS = originalEmailPass;
  });

  afterAll(() => {
    process.env.EMAIL_USER = originalEmailUser;
    process.env.EMAIL_PASS = originalEmailPass;
  });

  test("returns 500 when email config is missing", async () => {
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;

    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        subject: "Hello",
        message: "Test",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toContain("Missing email configuration");
  });

  test("sends email and returns 200", async () => {
    process.env.EMAIL_USER = "owner@example.com";
    process.env.EMAIL_PASS = "password";

    const sendMail = jest.fn().mockResolvedValue({});
    (nodemailer.createTransport as jest.Mock).mockReturnValue({ sendMail });

    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "visitor@example.com",
        subject: "Collaboration",
        message: "Let's work together",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ message: "Email sent successfully" });
    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        service: "gmail",
        auth: {
          user: "owner@example.com",
          pass: "password",
        },
      })
    );
    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "owner@example.com",
        to: "owner@example.com",
        replyTo: "visitor@example.com",
        subject: "Portfolio Contact: Collaboration",
      })
    );
  });

  test("returns 500 when transporter.sendMail fails", async () => {
    process.env.EMAIL_USER = "owner@example.com";
    process.env.EMAIL_PASS = "password";

    const sendMail = jest.fn().mockRejectedValue(new Error("SMTP down"));
    (nodemailer.createTransport as jest.Mock).mockReturnValue({ sendMail });

    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "visitor@example.com",
        subject: "Hi",
        message: "Ping",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: "SMTP down" });
  });
});
