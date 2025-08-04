"use node";

import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
} from "@react-email/components";

export interface QuoteEmailProps {
  quote: string;
  characterName: string;
  mood: string;
}

export default function QuoteEmail({
  quote,
  characterName,
  mood,
}: QuoteEmailProps) {
  return (
    <Html dir="ltr">
      <Head />
      <Preview>💬 A thoughtful message from {characterName} matching your mood: {mood}</Preview>
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f3f4f6",
          padding: "40px 0",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "14px",
            padding: "30px",
            margin: "auto",
            maxWidth: "600px",
            boxShadow: "0 0 15px rgba(0,0,0,0.1)",
            border: "1px solid #e0e0e0",
          }}
        >
          <Section style={{ textAlign: "center", marginBottom: "28px" }}>
            <Text style={{ fontSize: "26px", fontWeight: "bold", color: "#1f2937" }}>
              👤 A personal whisper from {characterName}
            </Text>
          </Section>

          <Section style={{ marginBottom: "20px" }}>
            <Text
              style={{
                fontSize: "18px",
                color: "#4b5563",
                textAlign: "center",
                lineHeight: "1.6",
              }}
            >
              Dear friend, I sensed your mood today is <strong>{mood}</strong> — so I took a moment to reflect and send you this message.
            </Text>
          </Section>

          <Section>
            <Text
              style={{
                fontSize: "22px",
                fontStyle: "italic",
                color: "#111827",
                textAlign: "center",
                margin: "30px 0",
                padding: "20px",
                backgroundColor: "#e0f2ff",
                borderLeft: "6px solid #3b82f6",
                borderRadius: "8px",
                boxShadow: "inset 0 0 12px #cbe4fb",
                lineHeight: "1.5",
                fontWeight: "500",
              }}
            >
              “{quote}”
            </Text>
          </Section>

          <Section style={{ textAlign: "center", marginTop: "36px" }}>
            <Text style={{ fontSize: "13px", color: "#9ca3af" }}>
              Sent with care via your Quotes App ✨
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
