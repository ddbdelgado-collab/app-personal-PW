import { Injectable, Logger } from '@nestjs/common';
import * as tls from 'tls';
import * as net from 'net';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Envía un correo electrónico real con el enlace único de recuperación de contraseña.
   * Utiliza nodemailer si está instalado en el entorno, o un cliente SMTP TLS nativo de Node.js.
   */
  async enviarCorreoRecuperacion(
    destinatario: string,
    nombreUsuario: string,
    resetLink: string,
  ): Promise<{ enviado: boolean; modo: string }> {
    const host = (this.configService.get('MAIL_HOST') || process.env.MAIL_HOST || 'smtp.gmail.com').replace(/['"]/g, '').trim();
    const port = Number((this.configService.get('MAIL_PORT') || process.env.MAIL_PORT || '465').replace(/['"]/g, '').trim());
    const user = (this.configService.get('MAIL_USER') || process.env.MAIL_USER || '').replace(/['"]/g, '').trim();
    const pass = (this.configService.get('MAIL_PASS') || process.env.MAIL_PASS || '').replace(/['"]/g, '').trim();

    const asunto = 'Recuperación de Contraseña - Sistema PW';
    const html = this.construirPlantillaHtml(nombreUsuario, resetLink);

    this.logger.log(`================================================================`);
    this.logger.log(`[RECUPERACIÓN DE CONTRASEÑA] Destinatario (email1): ${destinatario}`);
    this.logger.log(`[ENLACE ÚNICO]: ${resetLink}`);
    this.logger.log(`================================================================`);

    const credencialesConfiguradas =
      Boolean(user) &&
      Boolean(pass) &&
      user !== 'tu_correo@gmail.com' &&
      pass !== 'tu_clave_de_aplicacion';

    if (!credencialesConfiguradas) {
      this.logger.warn(
        'Credenciales SMTP de ejemplo detectadas en .env.development (MAIL_USER / MAIL_PASS). ' +
        'Configure su correo y contraseña de aplicación para el despacho SMTP externo. ' +
        'Puede usar el enlace impreso arriba para probar el flujo.',
      );
      return { enviado: true, modo: 'consola-desarrollo' };
    }

    // 1. Intentar con nodemailer si el paquete se encuentra instalado
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      await transporter.sendMail({
        from: `"Soporte Sistema PW" <${user}>`,
        to: destinatario,
        subject: asunto,
        html,
      });

      this.logger.log(`Correo enviado exitosamente vía Nodemailer a ${destinatario}`);
      return { enviado: true, modo: 'smtp-nodemailer' };
    } catch (err: any) {
      if (err?.code !== 'MODULE_NOT_FOUND') {
        this.logger.error(`Error al enviar con Nodemailer: ${err?.message}. Intentando cliente SMTP nativo...`);
      }
    }

    // 2. Cliente SMTP sobre TLS nativo de Node.js (sin dependencias adicionales)
    await this.enviarSmtpNativo({
      host,
      port,
      user,
      pass,
      from: user,
      to: destinatario,
      subject: asunto,
      html,
    });

    this.logger.log(`Correo enviado exitosamente vía SMTP TLS nativo a ${destinatario}`);
    return { enviado: true, modo: 'smtp-tls-nativo' };
  }

  private construirPlantillaHtml(nombre: string, resetLink: string): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Recuperación de Contraseña</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:40px 16px;">
          <tr>
            <td align="center">
              <table width="100%" style="max-width:540px;background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.08);">
                <tr>
                  <td style="background:linear-gradient(135deg,#4f46e5,#6366f1);padding:32px 40px;text-align:center;color:#ffffff;">
                    <h1 style="margin:0;font-size:24px;font-weight:700;">Recuperación de Contraseña</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:36px 40px;color:#334155;font-size:15px;line-height:1.6;">
                    <p style="margin-top:0;">Hola <strong>${nombre}</strong>,</p>
                    <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el siguiente botón para crear una nueva contraseña segura:</p>
                    <div style="text-align:center;margin:32px 0;">
                      <a href="${resetLink}" style="display:inline-block;background-color:#4f46e5;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;font-size:16px;">
                        Restablecer mi Contraseña
                      </a>
                    </div>
                    <p style="font-size:13px;color:#64748b;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                    <p style="word-break:break-all;font-size:13px;color:#4f46e5;background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">
                      <a href="${resetLink}" style="color:#4f46e5;">${resetLink}</a>
                    </p>
                    <p style="font-size:13px;color:#64748b;margin-bottom:0;">
                      Este enlace es de un solo uso y expirará en <strong>15 minutos</strong>. Si no solicitaste este cambio, puedes ignorar este mensaje de forma segura.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  private enviarSmtpNativo(opciones: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      const { host, port, user, pass, from, to, subject, html } = opciones;

      const codificarAsunto = `=?UTF-8?B?${Buffer.from(subject, 'utf8').toString('base64')}?=`;
      const htmlBase64 =
        Buffer.from(html, 'utf8')
          .toString('base64')
          .match(/.{1,76}/g)
          ?.join('\r\n') || '';

      const mensajeMime = [
        `From: "Soporte Sistema PW" <${from}>`,
        `To: <${to}>`,
        `Subject: ${codificarAsunto}`,
        `Date: ${new Date().toUTCString()}`,
        `MIME-Version: 1.0`,
        `Content-Type: text/html; charset=UTF-8`,
        `Content-Transfer-Encoding: base64`,
        ``,
        htmlBase64,
        `.`,
      ].join('\r\n');

      const ejecutarDialogoAutenticado = (socket: tls.TLSSocket | net.Socket, enviarEhloInicial: boolean) => {
        const pasos: Array<{ comando?: string; codigosEsperados: number[] }> = [];

        if (enviarEhloInicial) {
          pasos.push({ comando: `EHLO localhost`, codigosEsperados: [250] });
        }

        pasos.push(
          { comando: `AUTH LOGIN`, codigosEsperados: [334] },
          { comando: Buffer.from(user, 'utf8').toString('base64'), codigosEsperados: [334] },
          { comando: Buffer.from(pass, 'utf8').toString('base64'), codigosEsperados: [235] },
          { comando: `MAIL FROM:<${from}>`, codigosEsperados: [250] },
          { comando: `RCPT TO:<${to}>`, codigosEsperados: [250, 251] },
          { comando: `DATA`, codigosEsperados: [354] },
          { comando: mensajeMime, codigosEsperados: [250] },
          { comando: `QUIT`, codigosEsperados: [221, 250] },
        );

        let indicePaso = -1;
        let buffer = '';

        const procesarRespuesta = (codigo: number, textoCompleto: string) => {
          if (indicePaso >= 0) {
            const pasoActual = pasos[indicePaso];
            if (!pasoActual.codigosEsperados.includes(codigo)) {
              socket.destroy();
              return reject(new Error(`Error SMTP (${codigo}): ${textoCompleto.trim()}`));
            }
          }

          indicePaso++;
          if (indicePaso >= pasos.length) {
            socket.end();
            return resolve();
          }

          const siguientePaso = pasos[indicePaso];
          if (siguientePaso.comando) {
            socket.write(`${siguientePaso.comando}\r\n`);
          }
        };

        socket.on('data', (chunk: Buffer) => {
          buffer += chunk.toString('utf8');
          const lineas = buffer.split('\r\n');
          buffer = lineas.pop() || '';

          for (const linea of lineas) {
            if (linea.length >= 4 && linea[3] === ' ') {
              const codigo = parseInt(linea.substring(0, 3), 10);
              procesarRespuesta(codigo, linea);
            } else if (linea.length === 3 && /^\d{3}$/.test(linea)) {
              const codigo = parseInt(linea, 10);
              procesarRespuesta(codigo, linea);
            }
          }
        });

        socket.on('error', (err) => reject(err));
        socket.setTimeout(15000, () => {
          socket.destroy();
          reject(new Error('Tiempo de espera agotado al conectar con el servidor SMTP'));
        });

        if (!enviarEhloInicial) {
          // Si ya recibimos el 250 tras STARTTLS, iniciar desde el primer comando
          indicePaso = 0;
          socket.write(`${pasos[0].comando}\r\n`);
        }
      };

      if (port === 465) {
        const tlsSocket = tls.connect(
          { host, port, servername: host, rejectUnauthorized: false },
          () => {
            ejecutarDialogoAutenticado(tlsSocket, true);
          },
        );
        tlsSocket.on('error', (err) => reject(err));
      } else {
        // Puerto 587 (STARTTLS)
        const netSocket = net.connect({ host, port });
        let etapa = 0;
        let bufferInicial = '';

        const onDataInicial = (chunk: Buffer) => {
          bufferInicial += chunk.toString('utf8');
          const lineas = bufferInicial.split('\r\n');
          bufferInicial = lineas.pop() || '';

          for (const linea of lineas) {
            if ((linea.length >= 4 && linea[3] === ' ') || (linea.length === 3 && /^\d{3}$/.test(linea))) {
              const codigo = parseInt(linea.substring(0, 3), 10);
              if (etapa === 0 && codigo === 220) {
                etapa = 1;
                netSocket.write(`EHLO localhost\r\n`);
              } else if (etapa === 1 && codigo === 250) {
                etapa = 2;
                netSocket.write(`STARTTLS\r\n`);
              } else if (etapa === 2 && codigo === 220) {
                netSocket.removeListener('data', onDataInicial);
                const tlsSocket = tls.connect(
                  { socket: netSocket, servername: host, rejectUnauthorized: false },
                  () => {
                    tlsSocket.write(`EHLO localhost\r\n`);
                    let ehloBuffer = '';
                    const onEhlo = (ehloChunk: Buffer) => {
                      ehloBuffer += ehloChunk.toString('utf8');
                      const ehloLineas = ehloBuffer.split('\r\n');
                      ehloBuffer = ehloLineas.pop() || '';
                      for (const l of ehloLineas) {
                        if (l.length >= 4 && l[3] === ' ' && l.startsWith('250')) {
                          tlsSocket.removeListener('data', onEhlo);
                          ejecutarDialogoAutenticado(tlsSocket, false);
                        }
                      }
                    };
                    tlsSocket.on('data', onEhlo);
                  },
                );
                tlsSocket.on('error', (err) => reject(err));
              } else {
                netSocket.destroy();
                reject(new Error(`Respuesta inesperada en STARTTLS (${codigo}): ${linea}`));
              }
            }
          }
        };

        netSocket.on('data', onDataInicial);
        netSocket.on('error', (err) => reject(err));
      }
    });
  }
}
