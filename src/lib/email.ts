import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

const FROM_EMAIL: string = process.env.EMAIL_FROM || "Destino Libre <cuentanos@destinolibre.mx>";
const ADMIN_EMAIL: string = process.env.EMAIL_ADMIN || "cuentanos@destinolibre.mx";

interface OrderEmailProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalFormatted: string;
  subtotalFormatted: string;
  discountFormatted?: string;
  lines: {
    title: string;
    code: string;
    date: string;
    adults: number;
    lineTotalFormatted: string;
  }[];
  lang?: "es" | "en";
}

interface ContactEmailProps {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  lang?: "es" | "en";
}

export async function sendOrderConfirmationEmail(props: OrderEmailProps) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[Resend] RESEND_API_KEY no está configurado. Omitiendo envío de correo.");
    return;
  }

  const isEn = props.lang === "en";

  const subject = isEn
    ? `Booking Confirmed: ${props.orderId} · Destino Libre`
    : `Reservación confirmada: ${props.orderId} · Destino Libre`;

  const html = `
<!DOCTYPE html>
<html lang="${isEn ? "en" : "es"}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0; padding:0; background-color:#F8FAFC; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; color:#0F172A;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#F8FAFC; padding:40px 10px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius:24px; overflow:hidden; border:1px solid #E2E8F0; box-shadow:0 10px 30px rgba(15,23,42,0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color:#0F172A; padding:32px 40px; text-align:center;">
              <h1 style="margin:0; color:#FFFFFF; font-size:24px; font-weight:800; letter-spacing:-0.5px;">DESTINOLIBRE</h1>
              <p style="margin:6px 0 0; color:#38BDF8; font-size:11px; text-transform:uppercase; letter-spacing:2px; font-family:monospace;">
                ${isEn ? "BOARDING PASS & CONFIRMATION" : "PASE DE ABORDAJE Y CONFIRMACIÓN"}
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 12px; font-size:22px; font-weight:700; color:#0F172A;">
                ${isEn ? `Safe travels, ${props.customerName.split(" ")[0]}!` : `¡Buen viaje, ${props.customerName.split(" ")[0]}!`}
              </h2>
              <p style="margin:0 0 24px; font-size:15px; line-height:1.6; color:#475569;">
                ${
                  isEn
                    ? `Your payment has been successfully processed. Here are the details of your confirmed itinerary. Reference Code: <strong>${props.orderId}</strong>.`
                    : `Tu pago ha sido procesado exitosamente. A continuación te presentamos el resumen de tu itinerario confirmado con el folio: <strong>${props.orderId}</strong>.`
                }
              </p>

              <!-- Items Table -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top:1px solid #E2E8F0; border-bottom:1px solid #E2E8F0; margin-bottom:24px;">
                ${props.lines
                  .map(
                    (l) => `
                <tr>
                  <td style="padding:16px 0; border-bottom:1px solid #F1F5F9;">
                    <strong style="font-size:15px; color:#0F172A;">${l.title}</strong><br>
                    <span style="font-size:12px; color:#64748B; font-family:monospace;">
                      ${l.code} · ${l.date} · ${l.adults} ${isEn ? (l.adults === 1 ? "adult" : "adults") : (l.adults === 1 ? "adulto" : "adultos")}
                    </span>
                  </td>
                  <td align="right" style="padding:16px 0; font-size:15px; font-weight:700; color:#0F172A;">
                    ${l.lineTotalFormatted}
                  </td>
                </tr>
                `
                  )
                  .join("")}
              </table>

              <!-- Totals -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:32px;">
                <tr>
                  <td style="font-size:14px; color:#64748B;">${isEn ? "Subtotal" : "Subtotal"}</td>
                  <td align="right" style="font-size:14px; color:#0F172A;">${props.subtotalFormatted}</td>
                </tr>
                ${
                  props.discountFormatted
                    ? `
                <tr>
                  <td style="font-size:14px; color:#F97316;">${isEn ? "Discount" : "Descuento"}</td>
                  <td align="right" style="font-size:14px; color:#F97316;">-${props.discountFormatted}</td>
                </tr>
                `
                    : ""
                }
                <tr>
                  <td style="font-size:16px; font-weight:800; color:#0F172A; padding-top:12px;">${isEn ? "Total Paid" : "Total Pagado"}</td>
                  <td align="right" style="font-size:20px; font-weight:800; color:#F97316; padding-top:12px;">${props.totalFormatted}</td>
                </tr>
              </table>

              <!-- Banner Concierge -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#F1F5F9; border-radius:16px; padding:24px; color:#0F172A; border:1px solid #E2E8F0;">
                <tr>
                  <td>
                    <p style="margin:0; font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:#0284C7; font-family:monospace; font-weight:bold;">
                      ${isEn ? "NEXT STEP" : "SIGUIENTE PASO"}
                    </p>
                    <p style="margin:8px 0 0; font-size:14px; line-height:1.5; color:#334155;">
                      ${
                        isEn
                          ? "Your personal concierge will reach out via WhatsApp/email in less than 24 hours to coordinate meeting points and custom preferences."
                          : "Tu concierge personal se pondrá en contacto contigo en menos de 24 horas para afinar cada detalle y punto de encuentro."
                      }
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#F8FAFC; padding:24px 40px; text-align:center; font-size:12px; color:#64748B; border-top:1px solid #E2E8F0;">
              Destino Libre · Viajes y experiencias con criterio<br>
              México · <a href="https://destinolibre.mx" style="color:#F97316; text-decoration:none;">destinolibre.mx</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [props.customerEmail],
      bcc: [ADMIN_EMAIL],
      subject,
      html,
    });
  } catch (error) {
    console.error("[Resend Error - Order Email]", error);
  }
}

export async function sendContactNotificationEmail(props: ContactEmailProps) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[Resend] RESEND_API_KEY no está configurado. Omitiendo envío de correo de contacto.");
    return;
  }

  const isEn = props.lang === "en";

  const adminSubject = `[Nuevo Mensaje] ${props.name} · Destino Libre`;
  const userSubject = isEn
    ? `We received your inquiry · Destino Libre`
    : `Hemos recibido tu mensaje · Destino Libre`;

  // 1. Email estilizado para el administrador / Concierge
  const adminHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${adminSubject}</title>
</head>
<body style="margin:0; padding:0; background-color:#F8FAFC; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; color:#0F172A;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#F8FAFC; padding:40px 10px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius:24px; overflow:hidden; border:1px solid #E2E8F0; box-shadow:0 10px 30px rgba(15,23,42,0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color:#0F172A; padding:32px 40px; text-align:center;">
              <h1 style="margin:0; color:#FFFFFF; font-size:24px; font-weight:800; letter-spacing:-0.5px;">DESTINOLIBRE</h1>
              <p style="margin:6px 0 0; color:#38BDF8; font-size:11px; text-transform:uppercase; letter-spacing:2px; font-family:monospace;">
                NUEVO MENSAJE DE CONTACTO
              </p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px; font-size:18px; font-weight:700; color:#0F172A;">Detalles de la consulta</h2>
              
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top:1px solid #E2E8F0; margin-bottom:24px;">
                <tr>
                  <td style="padding:14px 0; border-bottom:1px solid #F1F5F9; font-size:14px;">
                    <strong style="color:#0F172A;">Nombre:</strong> <span style="color:#475569;">${props.name}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0; border-bottom:1px solid #F1F5F9; font-size:14px;">
                    <strong style="color:#0F172A;">Email:</strong> <a href="mailto:${props.email}" style="color:#F97316; text-decoration:none;">${props.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0; border-bottom:1px solid #F1F5F9; font-size:14px;">
                    <strong style="color:#0F172A;">Teléfono:</strong> <span style="color:#475569;">${props.phone || "No proporcionado"}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0; border-bottom:1px solid #F1F5F9; font-size:14px;">
                    <strong style="color:#0F172A;">Interés:</strong> <span style="color:#475569;">${props.interest}</span>
                  </td>
                </tr>
              </table>

              <h3 style="margin:0 0 12px; font-size:15px; font-weight:700; color:#0F172A;">Mensaje:</h3>
              <div style="background-color:#F8FAFC; padding:20px; border-left:4px solid #F97316; border-radius:4px; font-size:14px; line-height:1.6; color:#475569; border-top:1px solid #E2E8F0; border-right:1px solid #E2E8F0; border-bottom:1px solid #E2E8F0;">
                ${props.message.replace(/\n/g, "<br>")}
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#F8FAFC; padding:24px 40px; text-align:center; font-size:12px; color:#64748B; border-top:1px solid #E2E8F0;">
              Destino Libre · Área de Concierge
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // 2. Email estilizado de confirmación para el usuario
  const userHtml = `
<!DOCTYPE html>
<html lang="${isEn ? "en" : "es"}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${userSubject}</title>
</head>
<body style="margin:0; padding:0; background-color:#F8FAFC; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; color:#0F172A;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#F8FAFC; padding:40px 10px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius:24px; overflow:hidden; border:1px solid #E2E8F0; box-shadow:0 10px 30px rgba(15,23,42,0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color:#0F172A; padding:32px 40px; text-align:center;">
              <h1 style="margin:0; color:#FFFFFF; font-size:24px; font-weight:800; letter-spacing:-0.5px;">DESTINOLIBRE</h1>
              <p style="margin:6px 0 0; color:#38BDF8; font-size:11px; text-transform:uppercase; letter-spacing:2px; font-family:monospace;">
                ${isEn ? "CONCIERGE DESK" : "CONCIERGE PERSONAL"}
              </p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px; font-size:22px; font-weight:700; color:#0F172A;">
                ${isEn ? `Thank you, ${props.name.split(" ")[0]}!` : `¡Gracias, ${props.name.split(" ")[0]}!`}
              </h2>
              <p style="margin:0 0 32px; font-size:15px; line-height:1.6; color:#475569;">
                ${
                  isEn
                    ? `We have received your message regarding <strong>"${props.interest}"</strong>. A Destino Libre concierge will review your request and get back to you personally.`
                    : `Hemos recibido tu mensaje acerca de <strong>"${props.interest}"</strong>. Un concierge de Destino Libre revisará tu solicitud y te escribirá personalmente.`
                }
              </p>

              <!-- Banner Concierge -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#F1F5F9; border-radius:16px; padding:24px; color:#0F172A; border:1px solid #E2E8F0;">
                <tr>
                  <td>
                    <p style="margin:0; font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:#0284C7; font-family:monospace; font-weight:bold;">
                      ${isEn ? "WHAT HAPPENS NEXT?" : "¿QUÉ SIGUE?"}
                    </p>
                    <p style="margin:8px 0 0; font-size:14px; line-height:1.5; color:#334155;">
                      ${
                        isEn
                          ? "Our team is already working on your request. Expect a reply in under 24 hours. If you need immediate assistance, simply reply to this email."
                          : "Nuestro equipo ya está analizando tu solicitud. Te responderemos en menos de 24 horas. Si necesitas asistencia inmediata, puedes responder directamente a este correo."
                      }
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#F8FAFC; padding:24px 40px; text-align:center; font-size:12px; color:#64748B; border-top:1px solid #E2E8F0;">
              Destino Libre · Viajes y experiencias con criterio<br>
              México · <a href="https://destinolibre.mx" style="color:#F97316; text-decoration:none;">destinolibre.mx</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    await Promise.all([
      resend.emails.send({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: adminSubject,
        html: adminHtml,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: [props.email],
        subject: userSubject,
        html: userHtml,
      }),
    ]);
  } catch (error) {
    console.error("[Resend Error - Contact Email]", error);
  }
}