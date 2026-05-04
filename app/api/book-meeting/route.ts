import { google } from "googleapis";
import { NextResponse } from "next/server";
import { z } from "zod";

const bookMeetingRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z.string().trim().email("A valid email is required."),
  dateTime: z
    .string()
    .trim()
    .min(1, "Meeting date/time is required.")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Meeting date/time must be valid.",
    }),
});

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => null);
    const parsed = bookMeetingRequestSchema.safeParse(payload);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const message =
        (issue?.path?.[0] === "name" ||
          issue?.path?.[0] === "email" ||
          issue?.path?.[0] === "dateTime") &&
        issue.code === "invalid_type"
          ? "Missing required booking fields."
          : issue?.message || "Invalid request payload.";

      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 400 }
      );
    }

    const { name, email, dateTime } = parsed.data;

    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
    const redirectUri = process.env.GOOGLE_REDIRECT_URI?.trim();
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN?.trim()?.split("&")[0];

    if (!clientId || !clientSecret || !redirectUri || !refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Google Calendar is not fully configured. Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, and GOOGLE_REFRESH_TOKEN to .env.local.",
        },
        { status: 500 }
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });

    const start = new Date(dateTime);
    const end = new Date(start.getTime() + 30 * 60000);

    const event = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: `Meeting with ${name}`,
        description: "Booked via portfolio",
        start: {
          dateTime: start.toISOString(),
          timeZone: "Europe/Stockholm",
        },
        end: {
          dateTime: end.toISOString(),
          timeZone: "Europe/Stockholm",
        },
        attendees: [{ email }],
        conferenceData: {
          createRequest: {
            requestId: crypto.randomUUID(),
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      meetLink: event.data.hangoutLink,
      eventId: event.data.id,
    });
  } catch (error) {
    console.error("Booking error:", error);

    const googleError =
      (error as { response?: { data?: { error?: string; error_description?: string } } })
        ?.response?.data;

    const details = googleError?.error_description || googleError?.error;

    return NextResponse.json(
      {
        success: false,
        message: details
          ? `Booking failed: ${details}`
          : "Booking failed. Check Google OAuth credentials and refresh token.",
      },
      { status: 500 }
    );
  }
}