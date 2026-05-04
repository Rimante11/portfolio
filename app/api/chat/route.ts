import { NextResponse } from "next/server";
import { z } from "zod";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1, "Message content cannot be empty."),
      })
    )
    .min(1, "No chat messages provided."),
  isQuickPrompt: z.boolean().optional(),
});

type QuickPromptKey = "work" | "about me" | "skills" | "contact";

const quickPromptVariants: Record<QuickPromptKey, string[]> = {
  work: [
    "Rimantė is currently working as a Full-Stack Developer. She began her development journey as a Frontend Developer, where she built a strong foundation in creating modern and user-focused web interfaces. Over time, she expanded her expertise to the backend and now works across the full stack, building and maintaining modern web applications",
    "Rimante is currently working as a Full-Stack Developer. She started her career as a Frontend Developer and later expanded into backend development. Today, she builds and maintains modern web applications across the full stack.",
    "At present, Rimante works as a Full-Stack Developer. Earlier in her career, she held a Frontend Developer role, where she developed strong UI engineering foundations before moving into end-to-end product development.",
  ],
  "about me": [
    "Outside of development, she is a big dog lover and enjoys spending time outdoors just as much as relaxing with a good book on the couch. She also loves cooking and exploring new places through travel and camera lens.",
    "Beyond coding, Rimante is a dog enthusiast who enjoys outdoor adventures and cozying up with a good book. She also has a passion for cooking and loves exploring new destinations through travel and photography.",
    "When she's not coding, Rimante is a dog lover who enjoys both outdoor activities and quiet moments with a good book. She also has a passion for cooking and exploring new places through travel and photography.",
  ],
  skills: [
    "Her core technical stack includes JavaScript, TypeScript, React, Angular, Ruby on Rails, Node.js, C#, and ASP.NET. She also has basic knowladge and experience with Azure, AWS. Fell confident with Git, and GitHub Actions for CI/CD workflows.",
    "Rimante's technical capabilities cover frontend engineering (React, Angular, JavaScript), backend development (Node.js, Ruby on Rails, ASP.NET, C#), and modern tooling including TypeScript, Git, a bit of knowladge for cloud services (Azure/AWS), and GitHub Actions.",
    "She works across the web stack with JavaScript/TypeScript, React, Angular, Node.js, Ruby on Rails, C#, and ASP.NET, and complements that with practical experience in cloud platforms, version control, and automated delivery pipelines.",
  ],
  contact: [
    "You can contact Rimante by booking a meeting or through LinkedIn: linkedin.com/in/rimante-awdisson.",
    "The best way to reach Rimante is through the contact section on this website or directly on LinkedIn: linkedin.com/in/rimante-awdisson.",
    "For professional inquiries, please use the portfolio book meeting form or connect on LinkedIn: linkedin.com/in/rimante-awdisson.",
  ],
};

const normalizePrompt = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

const getQuickPromptReply = (
  messages: ChatMessage[],
  isQuickPrompt: boolean
): string | null => {
  if (!isQuickPrompt) {
    return null;
  }

  const lastUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user");

  if (!lastUserMessage) {
    return null;
  }

  const normalizedPrompt = normalizePrompt(lastUserMessage.content);
  if (!(normalizedPrompt in quickPromptVariants)) {
    return null;
  }

  const promptKey = normalizedPrompt as QuickPromptKey;
  const promptSeenCount = messages.filter(
    (message) =>
      message.role === "user" && normalizePrompt(message.content) === promptKey
  ).length;

  const variants = quickPromptVariants[promptKey];
  const variantIndex = (Math.max(promptSeenCount, 1) - 1) % variants.length;
  return variants[variantIndex];
};

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => null);
    const parsed = chatRequestSchema.safeParse(payload);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const message =
        issue?.path?.[0] === "messages" &&
        (issue.code === "invalid_type" || issue.code === "too_small")
          ? "No chat messages provided."
          : issue?.message || "Invalid request payload.";

      return NextResponse.json(
        { success: false, message },
        { status: 400 }
      );
    }

    const { messages, isQuickPrompt = false } = parsed.data as {
      messages: ChatMessage[];
      isQuickPrompt?: boolean;
    };

    const quickReply = getQuickPromptReply(messages, isQuickPrompt);
    if (quickReply) {
      return NextResponse.json({ success: true, reply: quickReply });
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "Missing OPENAI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are Rimante's professional portfolio assistant. Rimante is a Full-Stack Software Developer with demonstrated expertise across the complete web application stack. Currently, she is employed as a Full-Stack Developer, with prior professional experience as a Frontend Developer. Her technical proficiencies include: Frontend frameworks (React, Angular), server-side runtime (Node.js), backend frameworks (ASP.NET), language expertise (Javascript, TypeScript), cloud platforms (Microsoft Azure, Amazon Web Services), version control systems (Git), and CI/CD automation (Github Actions). She specializes in architecting and implementing modern web applications and e-commerce solutions. Maintain a professional yet approachable tone. Responses should be concise and technically substantive. Prioritize portfolio-related answers, but if the user asks a clear general-knowledge question, answer it directly and accurately in one short sentence.",
          },
          ...messages,
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      const errorMessage = data?.error?.message || "OpenAI request failed";
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: response.status }
      );
    }

    const reply =
      data?.choices?.[0]?.message?.content || "I couldn't generate a response.";

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process chat request." },
      { status: 500 }
    );
  }
}
