// src/lib/email/templates/ContactEmail.tsx
import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ContactEmailProps {
  name: string;
  email: string;
  message: string;
}

export function ContactEmail({ name, email, message }: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Nuevo mensaje de contacto de {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Nuevo Mensaje de Contacto</Heading>
          <Text style={subtitle}>Hotel Río Yurubí — Formulario de Contacto</Text>
          <Hr style={hr} />

          <Section style={section}>
            <Text style={label}>Nombre</Text>
            <Text style={value}>{name}</Text>
          </Section>

          <Section style={section}>
            <Text style={label}>Correo Electrónico</Text>
            <Text style={value}>{email}</Text>
          </Section>

          <Section style={section}>
            <Text style={label}>Mensaje</Text>
            <Text style={messageStyle}>{message}</Text>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            Este mensaje fue enviado desde el formulario de contacto del sitio
            web de Hotel Río Yurubí.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// --- Styles ---
const main = {
  backgroundColor: "#f4f6f9",
  fontFamily: "'Segoe UI', Arial, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  padding: "40px",
  borderRadius: "12px",
  maxWidth: "560px",
  border: "1px solid #e2e8f0",
};

const h1 = {
  color: "#1a365d",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0 0 8px",
};

const subtitle = {
  color: "#718096",
  fontSize: "14px",
  margin: "0 0 24px",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "24px 0",
};

const section = {
  marginBottom: "16px",
};

const label = {
  color: "#718096",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 4px",
};

const value = {
  color: "#2d3748",
  fontSize: "15px",
  margin: "0",
};

const messageStyle = {
  color: "#2d3748",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const footer = {
  color: "#a0aec0",
  fontSize: "12px",
  textAlign: "center" as const,
  margin: "0",
};
