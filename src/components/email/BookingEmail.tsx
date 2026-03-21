// src/components/email/BookingEmail.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface BookingEmailProps {
  guestName: string;
  reservationId: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  totalPrice: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  locale: string;
}

export const BookingEmail = ({
  guestName,
  reservationId,
  checkIn,
  checkOut,
  roomType,
  totalPrice,
  status,
  locale,
}: BookingEmailProps) => {
  const isEs = locale === "es";

  const statusMessages = {
    PENDING: {
      title: isEs ? "¡Reserva Recibida!" : "Booking Received!",
      subtitle: isEs 
        ? "Hemos recibido tu solicitud de reserva en el Hotel Río Yurubí. Estamos verificando los detalles." 
        : "We've received your booking request at Hotel Río Yurubí. We are currently verifying the details.",
      color: "#f59e0b",
    },
    CONFIRMED: {
      title: isEs ? "¡Reserva Confirmada!" : "Booking Confirmed!",
      subtitle: isEs 
        ? "¡Excelentes noticias! Tu estadía ha sido confirmada. Te esperamos con los brazos abiertos." 
        : "Great news! Your stay has been confirmed. We look forward to welcoming you.",
      color: "#10b981",
    },
    REJECTED: {
      title: isEs ? "Reserva No Procesada" : "Booking Not Processed",
      subtitle: isEs 
        ? "Lamentamos informarte que no hemos podido procesar tu reserva en esta ocasión." 
        : "We regret to inform you that we couldn't process your booking this time.",
      color: "#ef4444",
    },
  };

  const { title, subtitle, color } = statusMessages[status];

  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>Hotel Río Yurubí</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>{title}</Heading>
            <Text style={text}>
              {isEs ? `Hola ${guestName},` : `Hello ${guestName},`}
            </Text>
            <Text style={text}>{subtitle}</Text>

            <Section style={infoBox}>
              <Text style={infoLabel}>{isEs ? "CÓDIGO DE RESERVA" : "BOOKING ID"}</Text>
              <Text style={infoValue}>#{reservationId.slice(-6).toUpperCase()}</Text>
              
              <Hr style={hr} />
              
              <div style={grid}>
                <div style={col}>
                   <Text style={infoLabel}>CHECK-IN</Text>
                   <Text style={infoValueSmall}>{checkIn}</Text>
                </div>
                <div style={col}>
                   <Text style={infoLabel}>CHECK-OUT</Text>
                   <Text style={infoValueSmall}>{checkOut}</Text>
                </div>
              </div>

              <Hr style={hr} />

              <Text style={infoLabel}>{isEs ? "HABITACIÓN" : "ROOM TYPE"}</Text>
              <Text style={infoValueSmall}>{roomType}</Text>

              <Hr style={hr} />

              <Text style={infoLabel}>TOTAL</Text>
              <Text style={totalText}>{totalPrice}</Text>
            </Section>

            {status === "PENDING" && (
              <Section style={actionBox}>
                <Text style={smallText}>
                  {isEs 
                    ? "Para garantizar tu reserva, recuerda realizar el pago y enviar el comprobante si no lo has hecho aún." 
                    : "To guarantee your booking, remember to make the payment and send the receipt if you haven't yet."}
                </Text>
              </Section>
            )}

            <Link href="https://hotelrioyurubi.com" style={button}>
              {isEs ? "Ver Detalles de mi Reserva" : "View Booking Details"}
            </Link>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              San Felipe, Yaracuy, Venezuela. <br />
              {isEs ? "Tu refugio frente al Parque Nacional Yurubí." : "Your refuge facing Yurubí National Park."}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f9fafb",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "40px auto",
  padding: "20px",
  width: "580px",
  backgroundColor: "#ffffff",
  borderRadius: "24px",
  border: "1px solid #e5e7eb",
};

const header = {
  padding: "32px",
  textAlign: "center" as const,
};

const logo = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#0c4a6e", // brand-blue
  margin: "0",
};

const content = {
  padding: "0 32px 32px 32px",
};

const h1 = {
  fontSize: "28px",
  fontWeight: "bold",
  textAlign: "center" as const,
  color: "#111827",
  margin: "0 0 16px 0",
};

const text = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#4b5563",
};

const infoBox = {
  backgroundColor: "#f3f4f6",
  padding: "24px",
  borderRadius: "16px",
  margin: "24px 0",
};

const infoLabel = {
  fontSize: "10px",
  fontWeight: "bold",
  color: "#9ca3af",
  letterSpacing: "0.1em",
  margin: "0 0 4px 0",
};

const infoValue = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#111827",
  margin: "0",
};

const infoValueSmall = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#111827",
  margin: "0",
};

const totalText = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#166534", // brand-green
  margin: "0",
};

const grid = {
  display: "flex",
  gap: "20px",
};

const col = {
  flex: 1,
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "16px 0",
};

const actionBox = {
  padding: "16px",
  backgroundColor: "#fffbeb",
  border: "1px solid #fef3c7",
  borderRadius: "12px",
  marginBottom: "24px",
};

const smallText = {
  fontSize: "14px",
  color: "#92400e",
  margin: "0",
};

const button = {
  backgroundColor: "#0c4a6e",
  borderRadius: "12px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "16px",
};

const footer = {
  padding: "32px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  lineHeight: "20px",
  color: "#9ca3af",
};
