// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Test Users ─────────────────────────────────────────────
  const testPassword = await bcrypt.hash("yurubi123", 12);
  const users = [
    {
      name: "Administrador",
      email: "admin@hotelrioyurubi.com",
      password: testPassword,
      role: "ADMIN" as const,
    },
    {
      name: "Recepcionista",
      email: "recepcionist@hotelrioyurubi.com",
      password: testPassword,
      role: "RECEPTIONIST" as const,
    },
    {
      name: "Dueño",
      email: "owner@hotelrioyurubi.com",
      password: testPassword,
      role: "OWNER" as const,
    },
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        password: userData.password,
        role: userData.role,
      },
      create: {
        ...userData,
        isActive: true,
      },
    });
    console.log(`✅ User created/updated: ${user.email} (${user.role})`);
  }

  // ─── Amenities ──────────────────────────────────────────────
  console.log("🛁 Seeding amenities...");
  const allAmenities = [
    { name: "WiFi", icon: "wifi" },
    { name: "Aire acondicionado", icon: "air-conditioner" },
    { name: "TV", icon: "tv" },
    { name: "TV Smart", icon: "tv" },
    { name: "Agua caliente", icon: "droplets" },
    { name: "Ventilador", icon: "wind" },
    { name: "Balcón", icon: "external-link" },
    { name: "Minibar", icon: "coffee" },
    { name: "Jacuzzi", icon: "bath" },
    { name: "Sala de estar", icon: "layout" },
    { name: "Balcón panorámico", icon: "sun" },
    { name: "Cuna disponible", icon: "baby" },
  ];

  for (const amenity of allAmenities) {
    await prisma.amenity.upsert({
      where: { name: amenity.name },
      update: { icon: amenity.icon },
      create: amenity,
    });
  }
  const dbAmenities = await prisma.amenity.findMany();
  console.log(`✅ ${dbAmenities.length} amenities created/updated`);

  // ─── Room Types ────────────────────────────────────────────
  const roomTypesData = [
    {
      name: "Habitación Sencilla",
      slug: "sencilla",
      basePrice: 40,
      maxOccupancy: 1,
      description: "Habitación confortable para una persona con todas las comodidades.",
      amenityNames: ["WiFi", "Aire acondicionado", "TV", "Agua caliente", "Ventilador"],
    },
    {
      name: "Habitación Doble",
      slug: "doble",
      basePrice: 60,
      maxOccupancy: 2,
      description: "Perfecta para parejas o dos personas. Cama matrimonial o dos camas.",
      amenityNames: ["WiFi", "Aire acondicionado", "TV", "Agua caliente", "Ventilador", "Balcón"],
    },
    {
      name: "Habitación Triple",
      slug: "triple",
      basePrice: 80,
      maxOccupancy: 3,
      description: "Ideal para grupos de tres personas con amplio espacio.",
      amenityNames: ["WiFi", "Aire acondicionado", "TV", "Agua caliente", "Ventilador"],
    },
    {
      name: "Habitación Cuádruple",
      slug: "cuadruple",
      basePrice: 100,
      maxOccupancy: 4,
      description: "Amplia habitación para familias con cuatro ocupantes.",
      amenityNames: ["WiFi", "Aire acondicionado", "TV", "Agua caliente", "Ventilador"],
    },
    {
      name: "Suite Junior",
      slug: "suite-junior",
      basePrice: 120,
      maxOccupancy: 2,
      description: "Suite con sala de estar separada y acabados premium.",
      amenityNames: ["WiFi", "Aire acondicionado", "TV Smart", "Agua caliente", "Minibar", "Sala de estar", "Balcón"],
    },
    {
      name: "Suite Master",
      slug: "suite-master",
      basePrice: 160,
      maxOccupancy: 4,
      description: "La habitación más lujosa del hotel con vista panorámica.",
      amenityNames: ["WiFi", "Aire acondicionado", "TV Smart", "Agua caliente", "Minibar", "Jacuzzi", "Sala de estar", "Balcón panorámico"],
    },
    {
      name: "Habitación Familiar",
      slug: "familiar",
      basePrice: 90,
      maxOccupancy: 5,
      description: "Diseñada para familias con niños. Espacio amplio y cómodo.",
      amenityNames: ["WiFi", "Aire acondicionado", "TV", "Agua caliente", "Ventilador", "Cuna disponible"],
    },
  ];

  for (const rt of roomTypesData) {
    const { amenityNames, ...rest } = rt;
    const roomTypeAmenities = dbAmenities.filter(a => amenityNames.includes(a.name));

    await prisma.roomType.upsert({
      where: { slug: rt.slug },
      update: {
        amenities: {
          set: roomTypeAmenities.map(a => ({ id: a.id }))
        }
      },
      create: { 
        ...rest, 
        images: [], 
        isActive: true,
        amenities: {
          connect: roomTypeAmenities.map(a => ({ id: a.id }))
        }
      },
    });
  }
  
  const createdRoomTypes = await prisma.roomType.findMany();
  console.log(`✅ ${createdRoomTypes.length} room types created/updated`);

  // ─── Physical Rooms ──────────────────────────────────────────
  console.log("🏨 Creating physical rooms...");
  let roomCounter = 1;
  for (const rt of createdRoomTypes) {
    // Create 3 rooms for each type as a baseline
    for (let i = 1; i <= 3; i++) {
      const floor = Math.ceil(roomCounter / 10); // Simple floor logic
      const roomNumber = `${floor}${String(i).padStart(2, '0')}-${rt.slug.slice(0, 1).toUpperCase()}`;
      
      await prisma.room.upsert({
        where: { roomNumber },
        update: {},
        create: {
          roomNumber,
          floor,
          roomTypeId: rt.id,
          isAvailable: true
        }
      });
    }
    roomCounter += 10;
  }
  console.log("✅ Physical rooms populated");

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
        ZELLE: "Enviar pago a: hotelrioyurubi@gmail.com | Nombre: Hotel Río Yurubi",
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
