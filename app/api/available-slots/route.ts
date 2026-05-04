import { google } from "googleapis";
import { NextResponse } from "next/server";
import { z } from "zod";

const CALENDAR_TIMEZONE = "Europe/Stockholm";

const toTimeParts = (date: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value || 0);

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
  };
};

const toDateKey = (date: Date, timeZone: string) => {
  const p = toTimeParts(date, timeZone);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
};

const toMinutesOfDay = (date: Date, timeZone: string) => {
  const p = toTimeParts(date, timeZone);
  return p.hour * 60 + p.minute;
};

const availableSlotsRequestSchema = z.object({
  date: z
    .string()
    .trim()
    .min(1, "Date is required")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Date must be valid",
    }),
});

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => null);
    const parsed = availableSlotsRequestSchema.safeParse(payload);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const message =
        issue?.path?.[0] === "date" && issue.code === "invalid_type"
          ? "Date is required"
          : issue?.message || "Invalid request payload";

      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 400 }
      );
    }

    const { date } = parsed.data;

    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
    const redirectUri = process.env.GOOGLE_REDIRECT_URI?.trim();
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN?.trim()?.split("&")[0];

    if (!clientId || !clientSecret || !redirectUri || !refreshToken) {
      return NextResponse.json(
        { success: false, message: "Google Calendar not configured" },
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

    // Fetch a wider UTC window and then filter by Stockholm local date.
    // This avoids server-timezone drift for day boundaries.
    const selectedDate = new Date(date);
    const targetDateKey = toDateKey(selectedDate, CALENDAR_TIMEZONE);

    const rangeStart = new Date(selectedDate);
    rangeStart.setUTCDate(rangeStart.getUTCDate() - 1);
    rangeStart.setUTCHours(0, 0, 0, 0);

    const rangeEnd = new Date(selectedDate);
    rangeEnd.setUTCDate(rangeEnd.getUTCDate() + 1);
    rangeEnd.setUTCHours(23, 59, 59, 999);

    // Fetch events potentially overlapping the target local day
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: rangeStart.toISOString(),
      timeMax: rangeEnd.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      timeZone: CALENDAR_TIMEZONE,
    });

    const events = response.data.items || [];

    // Mark every 30-minute slot covered by events on the selected local day.
    const bookedSlotSet = new Set<string>();

    for (const event of events) {
      if (!event.start?.dateTime || !event.end?.dateTime) {
        continue;
      }

      const eventStart = new Date(event.start.dateTime);
      const eventEnd = new Date(event.end.dateTime);

      if (Number.isNaN(eventStart.getTime()) || Number.isNaN(eventEnd.getTime())) {
        continue;
      }

      const startDateKey = toDateKey(eventStart, CALENDAR_TIMEZONE);
      const endDateKey = toDateKey(eventEnd, CALENDAR_TIMEZONE);
      if (startDateKey !== targetDateKey && endDateKey !== targetDateKey) {
        continue;
      }

      const startMinutes = toMinutesOfDay(eventStart, CALENDAR_TIMEZONE);
      const endMinutes = toMinutesOfDay(eventEnd, CALENDAR_TIMEZONE);

      const from = Math.max(0, Math.floor(startMinutes / 30) * 30);
      const to = Math.min(24 * 60, Math.ceil(endMinutes / 30) * 30);

      for (let minute = from; minute < to; minute += 30) {
        const hour = String(Math.floor(minute / 60)).padStart(2, "0");
        const min = String(minute % 60).padStart(2, "0");
        bookedSlotSet.add(`${hour}:${min}`);
      }
    }

    const bookedSlots = Array.from(bookedSlotSet).sort();

    return NextResponse.json({
      success: true,
      bookedSlots,
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);

    const googleError =
      (error as { response?: { data?: { error?: string; error_description?: string } } })
        ?.response?.data;

    const details = googleError?.error_description || googleError?.error;

    return NextResponse.json(
      {
        success: false,
        message: details
          ? `Failed to fetch slots: ${details}`
          : "Failed to fetch available slots",
      },
      { status: 500 }
    );
  }
}
