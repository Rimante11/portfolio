"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import avatarImage from "../../../public/icon_i.png";

interface AboutSectionProps {
  styles: Record<string, string>;
}

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const quickPrompts = ["Work", "About me", "Skills", "Contact"];

type SendMessageOptions = {
  isQuickPrompt?: boolean;
};

const AboutSection = ({ styles }: AboutSectionProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async (text: string, options?: SendMessageOptions) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          isQuickPrompt: options?.isQuickPrompt === true,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Chat request failed");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "I couldn't generate a reply." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Something went wrong while contacting the assistant.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendMessage(input);
  };

  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.aboutChatHeader}>
        <div className={styles.aboutAvatar}>
          <Image
            src={avatarImage}
            alt="Rimante avatar"
            width={120}
            height={120}
          />
        </div>
        <h3 className={styles.aboutChatTitle}>Hi, I&apos;m Rimante</h3>
      </div>

      <div className={styles.aboutChatCard}>
        <div className={styles.aboutMessages} ref={messagesContainerRef}>
          {messages.length === 0 ? (
            <p className={styles.aboutPlaceholder}>Ask me anything about Rimante...</p>
          ) : (
            messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? styles.aboutUserMessage
                    : styles.aboutAssistantMessage
                }
              >
                {message.content}
              </div>
            ))
          )}
        </div>

        <div className={styles.aboutPromptRow}>
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className={styles.aboutPromptChip}
              onClick={() => sendMessage(prompt, { isQuickPrompt: true })}
            >
              {prompt}
            </button>
          ))}
        </div>

        <form className={styles.aboutInputRow} onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className={styles.aboutInput}
            placeholder="Ask anything about Rimante..."
            disabled={loading}
          />
          <button type="submit" className={styles.aboutSendBtn} disabled={loading}>
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AboutSection;