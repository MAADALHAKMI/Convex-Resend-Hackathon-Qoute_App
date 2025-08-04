"use node";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
} from "@react-email/components";

export interface FavoriteCharacterEmailProps {
  firstName: string;
  quote: string;
  characterName: string;
}

export default function FavoriteCharacterEmail({
  firstName,
  quote,
  characterName,
}: FavoriteCharacterEmailProps) {
  return (
    <Html dir="ltr">
      <Head />
      <Preview>📩 A new quote from {characterName} just for you</Preview>
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f9f9f9",
          padding: "20px",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "30px",
            maxWidth: "600px",
            margin: "auto",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          <Text style={{ fontSize: "22px", color: "#222", marginBottom: "18px" }}>
            Hello {firstName},<br />
            Hope this message finds you well! 🌟
          </Text>
          <Text style={{ fontSize: "16px", color: "#444", marginBottom: "24px" }}>
            Your favorite character, <strong>{characterName}</strong>, has a special quote for you today. Take a moment to reflect on it:
          </Text>
          <Text
            style={{
              fontSize: "20px",
              color: "#555",
              fontStyle: "italic",
              backgroundColor: "#eef6ff",
              padding: "20px",
              borderLeft: "5px solid #4a90e2",
              borderRadius: "8px",
              marginBottom: "30px",
              lineHeight: "1.5",
              boxShadow: "inset 0 0 10px #cde3f8",
            }}
          >
            “{quote}”
          </Text>
          <Text style={{ fontSize: "14px", color: "#888", textAlign: "center" }}>
            With warm regards,<br />
            <strong>{characterName}</strong><br />
            🚀 Sent with care by your app
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
