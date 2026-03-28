import { setRequestLocale } from "next-intl/server";
import { Link } from "@/routing";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export const metadata = {
  title: "Políticas de Privacidad | Hotel Río Yurubí",
  description: "Nuestras políticas de privacidad y manejo de datos.",
};

export default async function PrivacyPolicyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isEs = locale === "es";

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-brand-blue-600 hover:text-brand-blue-800 transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {isEs ? "Volver al Inicio" : "Back to Home"}
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            {isEs ? "Políticas de Privacidad" : "Privacy Policy"}
          </h1>
          <p className="text-gray-500">
            {isEs ? "Última actualización: Marzo 2026" : "Last updated: March 2026"}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 prose prose-brand max-w-none prose-headings:font-serif prose-h2:text-2xl prose-h2:text-gray-900 prose-p:text-gray-600">
          {isEs ? (
            <>
              <h2>1. Introducción</h2>
              <p>
                En el <strong>Hotel Río Yurubí</strong>, respetamos su privacidad y estamos comprometidos a proteger la información personal que comparte con nosotros. Esta Política de Privacidad describe cómo recopilamos, utilizamos, protegemos y compartimos sus datos personales cuando visita nuestro sitio web o hace uso de nuestros servicios.
              </p>

              <h2>2. Información que Recopilamos</h2>
              <p>
                Podemos recopilar la siguiente información:
              </p>
              <ul>
                <li><strong>Información de Contacto:</strong> Nombre, dirección de correo electrónico, número de teléfono y dirección postal.</li>
                <li><strong>Información de Reserva:</strong> Fechas de estancia, número de huéspedes, solicitudes especiales y detalles de pago.</li>
                <li><strong>Datos Técnicos:</strong> Dirección IP, tipo de navegador, información sobre el dispositivo y patrones de uso en nuestro sitio web.</li>
              </ul>

              <h2>3. Uso de la Información</h2>
              <p>
                La información que recopilamos se utiliza exclusivamente para:
              </p>
              <ul>
                <li>Procesar y gestionar sus reservas de habitaciones o servicios.</li>
                <li>Comunicarnos con usted sobre su estadía o consultas.</li>
                <li>Mejorar nuestros servicios, sitio web y experiencia del cliente.</li>
                <li>Enviarle ofertas promocionales, si ha optado por recibirlas.</li>
                <li>Cumplir con obligaciones legales y fiscales vigentes en Venezuela.</li>
              </ul>

              <h2>4. Protección de Datos</h2>
              <p>
                Implementamos medidas de seguridad técnicas y organizativas adecuadas para proteger sus datos personales contra el acceso no autorizado, la alteración, divulgación o destrucción. Nuestro sistema de reservas utiliza encriptación estándar de la industria.
              </p>

              <h2>5. Compartir Información</h2>
              <p>
                <strong>No vendemos ni alquilamos</strong> su información personal a terceros. Podemos compartir sus datos únicamente con:
              </p>
              <ul>
                <li>Proveedores de servicios que nos asisten en las operaciones del hotel (por ejemplo, pasarelas de pago).</li>
                <li>Autoridades competentes cuando la ley así lo exija.</li>
              </ul>

              <h2>6. Sus Derechos</h2>
              <p>
                Usted tiene derecho a solicitar el acceso, rectificación, o eliminación de sus datos personales almacenados en nuestros sistemas. Para ejercer estos derechos, por favor contáctenos a través de nuestros canales oficiales.
              </p>

              <h2>7. Contacto</h2>
              <p>
                Si tiene alguna pregunta sobre estas Políticas de Privacidad, no dude en contactarnos:
                <br />
                <strong>Email:</strong> hotelrioyurubi@gmail.com
                <br />
                <strong>Teléfono:</strong> +58 254-231-0798
                <br />
                <strong>Dirección:</strong> Final Avenida La Fuente, San Felipe, Yaracuy, Venezuela
              </p>
            </>
          ) : (
            <>
              <h2>1. Introduction</h2>
              <p>
                At <strong>Hotel Río Yurubí</strong>, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy describes how we collect, use, protect, and share your personal data when you visit our website or use our services.
              </p>

              <h2>2. Information We Collect</h2>
              <p>
                We may collect the following information:
              </p>
              <ul>
                <li><strong>Contact Information:</strong> Name, email address, phone number, and postal address.</li>
                <li><strong>Booking Information:</strong> Dates of stay, number of guests, special requests, and payment details.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, and usage patterns on our website.</li>
              </ul>

              <h2>3. Use of Information</h2>
              <p>
                The information we collect is used exclusively to:
              </p>
              <ul>
                <li>Process and manage your room reservations or services.</li>
                <li>Communicate with you regarding your stay or inquiries.</li>
                <li>Improve our services, website, and customer experience.</li>
                <li>Send promotional offers, if you have opted to receive them.</li>
                <li>Comply with current legal and tax obligations in Venezuela.</li>
              </ul>

              <h2>4. Data Protection</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Our booking system uses industry-standard encryption.
              </p>

              <h2>5. Sharing Information</h2>
              <p>
                <strong>We do not sell or rent</strong> your personal information to third parties. We may only share your data with:
              </p>
              <ul>
                <li>Service providers who assist us in hotel operations (e.g., payment gateways).</li>
                <li>Competent authorities when required by law.</li>
              </ul>

              <h2>6. Your Rights</h2>
              <p>
                You have the right to request access to, rectification, or deletion of your personal data stored in our systems. To exercise these rights, please contact us through our official channels.
              </p>

              <h2>7. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please do not hesitate to contact us:
                <br />
                <strong>Email:</strong> hotelrioyurubi@gmail.com
                <br />
                <strong>Phone:</strong> +58 254-231-0798
                <br />
                <strong>Address:</strong> Final Avenida La Fuente, San Felipe, Yaracuy, Venezuela
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
