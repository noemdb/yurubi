import { setRequestLocale } from "next-intl/server";
import { Link } from "@/routing";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export const metadata = {
  title: "Términos y Condiciones | Hotel Río Yurubí",
  description: "Términos y condiciones de uso de nuestros servicios.",
};

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isEs = locale === "es";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-brand-blue-600 hover:text-brand-blue-800 transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {isEs ? "Volver al Inicio" : "Back to Home"}
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4">
            {isEs ? "Términos y Condiciones" : "Terms and Conditions"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {isEs ? "Última actualización: Marzo 2026" : "Last updated: March 2026"}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800 prose prose-brand dark:prose-invert max-w-none prose-headings:font-serif prose-h2:text-2xl prose-h2:text-gray-900 dark:prose-h2:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300">
          {isEs ? (
            <>
              <h2>1. Aceptación de los Términos</h2>
              <p>
                Al acceder y utilizar el sitio web de <strong>Hotel Río Yurubí</strong>, así como al realizar reservas de nuestros servicios, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, le rogamos que no utilice nuestros servicios.
              </p>

              <h2>2. Reservas y Pagos</h2>
              <ul>
                <li>Todas las reservas están sujetas a disponibilidad y confirmación por parte del hotel.</li>
                <li>Se requiere un pago anticipado o validación de tarjeta de crédito para garantizar su reserva, de acuerdo con las políticas especificadas al momento de reservar.</li>
                <li>Las tarifas están expresadas en la moneda local o referencial (USD) y pueden estar sujetas a impuestos locales vigentes en Venezuela.</li>
              </ul>

              <h2>3. Políticas de Cancelación y Modificación</h2>
              <p>
                Nuestras políticas de cancelación varían según la tarifa y temporada. Generalmente:
              </p>
              <ul>
                <li>Las cancelaciones o modificaciones deben realizarse con al menos 48 horas de anticipación a la fecha de llegada para evitar penalidades.</li>
                <li>No presentarse (No-Show) resultará en el cobro de la primera noche de estancia.</li>
                <li>Durante temporadas altas o eventos especiales, pueden aplicarse políticas de cancelación más estrictas.</li>
              </ul>

              <h2>4. Check-in y Check-out</h2>
              <ul>
                <li><strong>Hora de Entrada (Check-in):</strong> A partir de las 3:00 PM (15:00 hrs).</li>
                <li><strong>Hora de Salida (Check-out):</strong> Hasta la 1:00 PM (13:00 hrs).</li>
                <li>Solicitudes de check-in temprano o check-out tardío están sujetas a disponibilidad y pueden incurrir en cargos adicionales. Un documento de identidad válido es requerido al momento del registro.</li>
              </ul>

              <h2>5. Normas del Hotel</h2>
              <ul>
                <li>No se permite fumar dentro de las habitaciones ni en áreas cerradas del hotel. Contamos con áreas designadas para fumadores.</li>
                <li>No se admiten mascotas, a menos que sean animales de asistencia certificados.</li>
                <li>Los huéspedes son responsables de cualquier daño causado a la propiedad del hotel durante su estadía.</li>
                <li>Nos reservamos el derecho de admisión y permanencia para garantizar la tranquilidad y seguridad de todos nuestros huéspedes.</li>
              </ul>

              <h2>6. Responsabilidad</h2>
              <p>
                El <strong>Hotel Río Yurubí</strong> no se hace responsable por la pérdida, daño o robo de objetos de valor dejados en las habitaciones o áreas comunes que no hayan sido depositados en nuestra custodia oficial. El uso de la piscina y otras instalaciones es bajo su propio riesgo.
              </p>

              <h2>7. Modificaciones a los Términos</h2>
              <p>
                Nos reservamos el derecho de modificar o actualizar estos Términos y Condiciones en cualquier momento sin previo aviso. Los cambios entrarán en vigencia inmediatamente después de su publicación en nuestro sitio web.
              </p>

              <h2>8. Contacto</h2>
              <p>
                Si tiene alguna pregunta sobre estos Términos y Condiciones, por favor contáctenos:
                <br />
                <strong>Email:</strong> hotelrioyurubi@gmail.com
                <br />
                <strong>Teléfono:</strong> +58 426-722-4991
                <br />
                <strong>Dirección:</strong> Final Avenida La Fuente, San Felipe, Yaracuy, Venezuela
              </p>
            </>
          ) : (
            <>
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using the <strong>Hotel Río Yurubí</strong> website, as well as making reservations for our services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.
              </p>

              <h2>2. Reservations and Payments</h2>
              <ul>
                <li>All reservations are subject to availability and confirmation by the hotel.</li>
                <li>An advance payment or credit card validation is required to guarantee your reservation, according to the policies specified at the time of booking.</li>
                <li>Rates are expressed in local or reference currency (USD) and may be subject to applicable local taxes in Venezuela.</li>
              </ul>

              <h2>3. Cancellation and Modification Policies</h2>
              <p>
                Our cancellation policies vary by rate and season. Generally:
              </p>
              <ul>
                <li>Cancellations or modifications must be made at least 48 hours prior to the arrival date to avoid penalties.</li>
                <li>No-Shows will result in a charge equivalent to the first night of the stay.</li>
                <li>During high seasons or special events, stricter cancellation policies may apply.</li>
              </ul>

              <h2>4. Check-in and Check-out</h2>
              <ul>
                <li><strong>Check-in Time:</strong> From 3:00 PM (15:00 hrs).</li>
                <li><strong>Check-out Time:</strong> Until 1:00 PM (13:00 hrs).</li>
                <li>Requests for early check-in or late check-out are subject to availability and may incur additional charges. A valid ID is required at the time of registration.</li>
              </ul>

              <h2>5. Hotel Rules</h2>
              <ul>
                <li>Smoking is not permitted inside the rooms or in enclosed areas of the hotel. We have designated smoking areas.</li>
                <li>Pets are not allowed, unless they are certified service animals.</li>
                <li>Guests are responsible for any damage caused to the hotel property during their stay.</li>
                <li>We reserve the right of admission and stay to ensure the peace and safety of all our guests.</li>
              </ul>

              <h2>6. Liability</h2>
              <p>
                <strong>Hotel Río Yurubí</strong> is not responsible for the loss, damage, or theft of valuables left in rooms or common areas that have not been deposited in our official custody. The use of the pool and other facilities is at your own risk.
              </p>

              <h2>7. Modifications to the Terms</h2>
              <p>
                We reserve the right to modify or update these Terms and Conditions at any time without prior notice. Changes will be effective immediately upon posting on our website.
              </p>

              <h2>8. Contact Us</h2>
              <p>
                If you have any questions about these Terms and Conditions, please contact us:
                <br />
                <strong>Email:</strong> hotelrioyurubi@gmail.com
                <br />
                <strong>Phone:</strong> +58 426-722-4991
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
