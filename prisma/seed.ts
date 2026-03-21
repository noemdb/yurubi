// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Admin user ────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("Admin2024!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@hotelrioyurubi.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@hotelrioyurubi.com",
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    },
  });
  console.log("✅ Admin user:", admin.email);

  // ─── Room Types ────────────────────────────────────────────
  const roomTypes = [
    {
      name: "Habitación Sencilla",
      slug: "sencilla",
      basePrice: 40,
      maxOccupancy: 1,
      description: "Habitación confortable para una persona con todas las comodidades.",
      amenities: ["WiFi", "Aire acondicionado", "TV", "Agua caliente", "Ventilador"],
    },
    {
      name: "Habitación Doble",
      slug: "doble",
      basePrice: 60,
      maxOccupancy: 2,
      description: "Perfecta para parejas o dos personas. Cama matrimonial o dos camas.",
      amenities: ["WiFi", "Aire acondicionado", "TV", "Agua caliente", "Ventilador", "Balcón"],
    },
    {
      name: "Habitación Triple",
      slug: "triple",
      basePrice: 80,
      maxOccupancy: 3,
      description: "Ideal para grupos de tres personas con amplio espacio.",
      amenities: ["WiFi", "Aire acondicionado", "TV", "Agua caliente", "Ventilador"],
    },
    {
      name: "Habitación Cuádruple",
      slug: "cuadruple",
      basePrice: 100,
      maxOccupancy: 4,
      description: "Amplia habitación para familias con cuatro ocupantes.",
      amenities: ["WiFi", "Aire acondicionado", "TV", "Agua caliente", "Ventilador"],
    },
    {
      name: "Suite Junior",
      slug: "suite-junior",
      basePrice: 120,
      maxOccupancy: 2,
      description: "Suite con sala de estar separada y acabados premium.",
      amenities: ["WiFi", "Aire acondicionado", "TV Smart", "Agua caliente", "Minibar", "Sala de estar", "Balcón"],
    },
    {
      name: "Suite Master",
      slug: "suite-master",
      basePrice: 160,
      maxOccupancy: 4,
      description: "La habitación más lujosa del hotel con vista panorámica.",
      amenities: ["WiFi", "Aire acondicionado", "TV Smart", "Agua caliente", "Minibar", "Jacuzzi", "Sala de estar", "Balcón panorámico"],
    },
    {
      name: "Habitación Familiar",
      slug: "familiar",
      basePrice: 90,
      maxOccupancy: 5,
      description: "Diseñada para familias con niños. Espacio amplio y cómodo.",
      amenities: ["WiFi", "Aire acondicionado", "TV", "Agua caliente", "Ventilador", "Cuna disponible"],
    },
  ];

  for (const rt of roomTypes) {
    await prisma.roomType.upsert({
      where: { slug: rt.slug },
      update: {},
      create: { ...rt, images: [], isActive: true },
    });
  }
  console.log(`✅ ${roomTypes.length} room types created`);

  // ─── System Settings ──────────────────────────────────────
  const settings = [
    { key: "check_in_time", value: "14:30", description: "Hora de check-in", category: "policy" },
    { key: "check_out_time", value: "12:00", description: "Hora de check-out", category: "policy" },
    { key: "currency", value: "USD", description: "Moneda base del sistema", category: "general" },
    { key: "pool_price", value: 0, description: "Precio de acceso a la piscina en USD (0 = incluido)", category: "pricing" },
    { key: "meeting_room_price", value: 250, description: "Precio de la sala de reuniones en USD/día", category: "pricing" },
    {
      key: "cancellation_policy",
      value: { hoursThreshold: 48, refundPercent: 100 },
      description: "Política de cancelación",
      category: "policy",
    },
    {
      key: "payment_instructions",
      value: {
        TRANSFERENCIA: "Banco Venezuela | Cta Cte: 0102-XXXX-XXXX | RIF: J-XXXXXXXX-X | A nombre de: Hotel Río Yurubí",
        ZELLE: "Enviar pago a: hotelrioyurubi@gmail.com | Nombre: Hotel Rio Yurubi",
        EFECTIVO: "Pago en efectivo al momento del check-in en recepción del hotel.",
      },
      description: "Instrucciones de pago por método",
      category: "payment",
    },
    {
      key: "exchange_rate",
      value: { vesToUsd: 36.5 },
      description: "Tasa de cambio VES/USD (actualizar periódicamente)",
      category: "general",
    },
    {
      key: "hotel_info",
      value: {
        name: "Hotel Río Yurubí",
        phone: "+58 254-231-0798",
        whatsapp: "+582542310798",
        email: "hotelrioyurubi@gmail.com",
        address: "Final Avenida La Fuente, San Felipe, Yaracuy, Venezuela",
        lat: 10.4035,
        lng: -68.747,
      },
      description: "Información de contacto del hotel",
      category: "general",
    },
  ];

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        key: setting.key,
        value: setting.value as never,
        description: setting.description,
        category: setting.category,
      },
    });
  }
  console.log(`✅ ${settings.length} system settings created`);

  // ─── Page Sections ────────────────────────────────────────
  const pageSections = [
    { slug: "home-hero", title: "Tu refugio natural en el corazón de Yaracuy", titleEn: "Your natural retreat in the heart of Yaracuy", order: 1 },
    { slug: "habitaciones-preview", title: "Nuestras Habitaciones", titleEn: "Our Rooms", order: 2 },
    { slug: "servicios-overview", title: "Nuestros Servicios", titleEn: "Our Services", order: 3 },
    { slug: "restaurante-info", title: "Restaurante", titleEn: "Restaurant", body: "Cocina venezolana e internacional. Lunes a Domingo de 7:00 AM a 10:00 PM.", bodyEn: "Venezuelan and international cuisine. Monday to Sunday from 7:00 AM to 10:00 PM.", order: 4 },
    { slug: "piscina-info", title: "Piscina", titleEn: "Pool", body: "Nuestra piscina está disponible de 6:00 AM a 8:00 PM.", bodyEn: "Our pool is available from 6:00 AM to 8:00 PM.", order: 5 },
    { slug: "sala-reuniones-info", title: "Sala de Reuniones", titleEn: "Meeting Room", body: "Capacidad para 30 personas. Equipada con proyector, micrófono y aire acondicionado.", bodyEn: "Capacity for 30 people. Equipped with projector, microphone and air conditioning.", order: 6 },
    { slug: "galeria", title: "Galería", titleEn: "Gallery", order: 7 },
    { slug: "testimonios", title: "Opiniones", titleEn: "Reviews", order: 8 },
    { slug: "ubicacion-info", title: "Ubicación", titleEn: "Location", body: "Final Avenida La Fuente, San Felipe, Yaracuy, Venezuela.", bodyEn: "Final Avenida La Fuente, San Felipe, Yaracuy, Venezuela.", order: 9 },
    { slug: "contacto", title: "Contáctanos", titleEn: "Contact Us", order: 10 },
    { slug: "promociones", title: "Promociones", titleEn: "Promotions", order: 11 },
    { slug: "sobre-nosotros", title: "Sobre nosotros", titleEn: "About Us", body: "Hotel Río Yurubí es un hotel ubicado frente al Parque Nacional Yurubí en San Felipe, Yaracuy.", bodyEn: "Hotel Río Yurubí is a hotel located in front of Yurubí National Park in San Felipe, Yaracuy.", order: 12 },
  ];

  for (const section of pageSections) {
    await prisma.pageSection.upsert({
      where: { slug: section.slug },
      update: {},
      create: { ...section, images: [], isActive: true },
    });
  }
  console.log(`✅ ${pageSections.length} page sections created`);

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
