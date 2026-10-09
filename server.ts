import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import type { SendMailOptions } from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '1mb' }));

interface InquiryRecord {
  id: string;
  referenceId: string;
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  sport: string;
  preferredTime: string;
  message: string;
  status: 'New' | 'In Review' | 'Contacted' | 'Enrolled' | 'Archived';
  createdAt: string;
  adminNotes?: string;
  smtpDetails?: string;
}

// In-memory inquiry store seeded with initial sample data for the club admin
let inquiries: InquiryRecord[] = [
  {
    id: 'inq-101',
    referenceId: 'TSC-2026-8941',
    name: 'Rajesh Gaekwad',
    email: 'rajesh.gaekwad@vadodara.org',
    phone: '+91 98250 88219',
    inquiryType: 'General Sports Inquiry',
    sport: 'Tennis Academy',
    preferredTime: 'Morning (06:30 - 08:30)',
    message: 'Interested in sports facilities and court access. Would like to schedule an on-campus tour this Saturday.',
    status: 'In Review',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    adminNotes: 'Requested Saturday morning campus walkthrough. Assigned to Front Desk.',
    smtpDetails: 'Dispatched to pallavi@uniqtechsolutions.com via Zoho SMTP (Port 465 SSL)'
  },
  {
    id: 'inq-102',
    referenceId: 'TSC-2026-8942',
    name: 'Dr. Meera Parikh',
    email: 'meera.parikh@medicare.in',
    phone: '+91 94260 11940',
    inquiryType: 'Junior Development Academy',
    sport: 'Pickleball Pro Arena',
    preferredTime: 'Evening (05:00 - 07:00)',
    message: 'Inquiring for my 12-year-old daughter who is competing in state junior pickleball circuits. Looking for high-performance squad coaching.',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    smtpDetails: 'Dispatched to pallavi@uniqtechsolutions.com via Zoho SMTP (Port 465 SSL)'
  },
  {
    id: 'inq-103',
    referenceId: 'TSC-2026-8943',
    name: 'Kabir Varma',
    email: 'kabir.v@fintechgujarat.com',
    phone: '+91 97129 33021',
    inquiryType: 'Court & Pitch Booking',
    sport: 'High-Performance GYM & Conditioning',
    preferredTime: 'Morning (06:30 - 08:30 AM)',
    message: 'Corporate wellness and Olympic platform strength training program for 20 executives. Require personal trainer evaluation and InBody screenings.',
    status: 'Contacted',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    adminNotes: 'Quotation sent for executive gym coaching.',
    smtpDetails: 'Dispatched to pallavi@uniqtechsolutions.com via Zoho SMTP (Port 465 SSL)'
  }
];

let newsletterSubscribers: { email: string; date: string }[] = [
  { email: 'member.bulletin@vadodara.com', date: new Date().toISOString() }
];

// Zoho SMTP Configuration Constants
const ZOHO_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.zoho.com',
  user: process.env.SMTP_USER || 'web@uniqtechsolutions.com',
  pass: process.env.SMTP_PASSWORD || 'Web@281989#',
  adminRecipient: process.env.CONTACT_RECEIVER_EMAIL || 'pallavi@uniqtechsolutions.com',
  senderName: 'Tiara Sports Club Inquiry Desk'
};

interface ZohoDispatchResult {
  success: boolean;
  portUsed?: number;
  protocol?: string;
  messageId?: string;
  error?: string;
  details: string;
}

// Dispatches email using Zoho SMTP with Port 465 SSL & Port 587 TLS failover
async function dispatchZohoEmail(mailOptions: {
  to: string;
  from?: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}): Promise<ZohoDispatchResult> {
  const host = process.env.SMTP_HOST || ZOHO_CONFIG.host;
  const user = process.env.SMTP_USER || ZOHO_CONFIG.user;
  const pass = process.env.SMTP_PASSWORD || ZOHO_CONFIG.pass;

  const defaultFrom = `"${ZOHO_CONFIG.senderName}" <${user}>`;
  const finalPayload: SendMailOptions = {
    ...mailOptions,
    from: mailOptions.from || defaultFrom
  };

  // 1. Primary Attempt: Port 465 (SSL)
  try {
    console.log(`[Zoho SMTP] Attempting dispatch via Port 465 (SSL) to ${mailOptions.to}...`);
    const transporter465 = nodemailer.createTransport({
      host,
      port: 465,
      secure: true, // SSL
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000,
      greetingTimeout: 8000,
      socketTimeout: 12000
    });

    const info = await transporter465.sendMail(finalPayload);
    console.log(`[Zoho SMTP] Success via Port 465 (SSL). Message ID: ${info.messageId}`);
    return {
      success: true,
      portUsed: 465,
      protocol: 'SSL',
      messageId: info.messageId,
      details: `Dispatched to ${mailOptions.to} via Zoho SMTP (Port 465 SSL)`
    };
  } catch (err465: any) {
    console.warn(`[Zoho SMTP] Port 465 SSL failed (${err465.message}). Triggering failover to Port 587 (TLS)...`);

    // 2. Failover Attempt: Port 587 (TLS)
    try {
      const transporter587 = nodemailer.createTransport({
        host,
        port: 587,
        secure: false, // TLS
        requireTLS: true,
        auth: { user, pass },
        tls: {
          rejectUnauthorized: false
        },
        connectionTimeout: 10000,
        greetingTimeout: 8000,
        socketTimeout: 12000
      });

      const info = await transporter587.sendMail(finalPayload);
      console.log(`[Zoho SMTP] Success via Port 587 (TLS Failover). Message ID: ${info.messageId}`);
      return {
        success: true,
        portUsed: 587,
        protocol: 'TLS',
        messageId: info.messageId,
        details: `Dispatched to ${mailOptions.to} via Zoho SMTP (Port 587 TLS Failover)`
      };
    } catch (err587: any) {
      console.error(`[Zoho SMTP] Failover failed. Port 465: ${err465.message} | Port 587: ${err587.message}`);
      return {
        success: false,
        error: `Port 465: ${err465.message} | Port 587: ${err587.message}`,
        details: `Zoho SMTP transmission error: ${err587.message || err465.message}`
      };
    }
  }
}

// Simple rate limiter tracking (in-memory IP map)
const requestRateMap = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = requestRateMap.get(ip) || [];
  const recent = timestamps.filter(t => now - t < 60000); // 1 minute window
  if (recent.length >= 10) {
    return false; // Exceeded 10 requests per minute
  }
  recent.push(now);
  requestRateMap.set(ip, recent);
  return true;
}

// POST /api/contact - User inquiry submission
app.post('/api/contact', async (req: Request, res: Response): Promise<void> => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'local';
  if (!checkRateLimit(clientIp)) {
    res.status(429).json({ error: 'Too many requests. Please wait a moment before submitting again.' });
    return;
  }

  const { name, email, phone, inquiryType, sport, preferredTime, message } = req.body;

  // Validation
  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    res.status(400).json({ error: 'Please provide a valid full name (2 to 100 characters).' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    res.status(400).json({ error: 'Please provide a valid email address.' });
    return;
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length < 6 || phone.trim().length > 25) {
    res.status(400).json({ error: 'Please provide a valid contact telephone number.' });
    return;
  }

  const finalMessage = (message && typeof message === 'string' && message.trim().length > 0)
    ? message.trim()
    : 'Inquiry submitted for Tiara Sports Club facilities.';

  const referenceCode = `TSC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newInquiry: InquiryRecord = {
    id: `inq-${Date.now()}`,
    referenceId: referenceCode,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    inquiryType: inquiryType || 'General Sports Inquiry',
    sport: sport || 'All Disciplines',
    preferredTime: preferredTime || 'Flexible',
    message: finalMessage,
    status: 'New',
    createdAt: new Date().toISOString()
  };

  inquiries.unshift(newInquiry);

  // Attempt email delivery via Zoho SMTP Engine (Port 465 SSL & Port 587 TLS Failover)
  const adminEmail = process.env.CONTACT_RECEIVER_EMAIL || ZOHO_CONFIG.adminRecipient;
  let deliveryDetails = `Logged to Club Admin Registry`;

  try {
    const adminMailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background:#f4f6f9; padding:24px; color:#1e293b;">
        <div style="max-width:620px; margin:0 auto; background:#ffffff; border-radius:6px; border:1px solid #e2e8f0; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
          <!-- Header Banner -->
          <div style="background:#0A192F; border-bottom:4px solid #C5A059; padding:22px 28px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <h1 style="color:#ffffff; margin:0; font-size:22px; font-weight:800; letter-spacing:0.5px;">TIARA SPORTS CLUB</h1>
                <p style="color:#C5A059; margin:4px 0 0; font-size:12px; text-transform:uppercase; letter-spacing:1.5px; font-weight:600;">
                  New Official Inquiry Desk Notification
                </p>
              </div>
            </div>
          </div>

          <!-- Body Content -->
          <div style="padding:28px;">
            <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:4px; padding:14px 18px; margin-bottom:22px;">
              <span style="color:#64748B; font-size:11px; text-transform:uppercase; letter-spacing:1px; font-weight:700;">Inquiry Reference ID</span>
              <div style="color:#0A192F; font-size:18px; font-family:monospace; font-weight:700; margin-top:2px;">
                ${referenceCode}
              </div>
            </div>

            <table style="width:100%; border-collapse:collapse; margin-bottom:24px; font-size:13px;">
              <tr style="border-bottom:1px solid #F1F5F9;">
                <td style="padding:10px 0; color:#64748B; width:140px; font-weight:600;">Applicant Name:</td>
                <td style="padding:10px 0; font-weight:700; color:#0F172A; font-size:14px;">${name.trim()}</td>
              </tr>
              <tr style="border-bottom:1px solid #F1F5F9;">
                <td style="padding:10px 0; color:#64748B; font-weight:600;">Email Address:</td>
                <td style="padding:10px 0;"><a href="mailto:${email.trim()}" style="color:#0A192F; font-weight:600; text-decoration:underline;">${email.trim()}</a></td>
              </tr>
              <tr style="border-bottom:1px solid #F1F5F9;">
                <td style="padding:10px 0; color:#64748B; font-weight:600;">Telephone:</td>
                <td style="padding:10px 0;"><a href="tel:${phone.trim()}" style="color:#0F172A; font-weight:600; text-decoration:none;">${phone.trim()}</a></td>
              </tr>
              <tr style="border-bottom:1px solid #F1F5F9;">
                <td style="padding:10px 0; color:#64748B; font-weight:600;">Inquiry Category:</td>
                <td style="padding:10px 0; color:#0A192F; font-weight:700;">${inquiryType}</td>
              </tr>
              <tr style="border-bottom:1px solid #F1F5F9;">
                <td style="padding:10px 0; color:#64748B; font-weight:600;">Sport / Arena:</td>
                <td style="padding:10px 0; color:#C5A059; font-weight:700;">${sport}</td>
              </tr>
              <tr>
                <td style="padding:10px 0; color:#64748B; font-weight:600;">Preferred Timing:</td>
                <td style="padding:10px 0; color:#334155; font-weight:600;">${preferredTime}</td>
              </tr>
            </table>

            <div style="background:#F8FAFC; border-left:4px solid #C5A059; padding:16px 18px; border-radius:3px;">
              <strong style="color:#0F172A; font-size:12px; text-transform:uppercase; letter-spacing:0.8px; display:block; margin-bottom:6px;">Applicant Statement / Requirements:</strong>
              <p style="margin:0; font-size:13.5px; line-height:1.6; color:#334155; white-space:pre-wrap;">${message.trim()}</p>
            </div>
          </div>

          <!-- Footer Information -->
          <div style="background:#0A192F; color:#94A3B8; padding:18px 28px; font-size:11px; line-height:1.6;">
            <strong style="color:#ffffff;">Tiara Sports Club Vadodara</strong><br/>
            Tiara Sports Club, Besides Red Coral greens, opposite Nayara petrol pump, sama-savli road Vadodara<br/>
            Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </div>
        </div>
      </div>
    `;

    const adminMailText = `TIARA SPORTS CLUB - NEW INQUIRY NOTIFICATION
Reference: ${referenceCode}
Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Applicant Name: ${name.trim()}
Email: ${email.trim()}
Phone: ${phone.trim()}
Inquiry Category: ${inquiryType}
Sport / Arena: ${sport}
Preferred Timing: ${preferredTime}

Message:
${message.trim()}

--------------------------------------------------
Tiara Sports Club Vadodara
Besides Red Coral greens, opposite Nayara petrol pump, sama-savli road Vadodara
`;

    // Dispatch exclusively to designated admin email (pallavi@uniqtechsolutions.com)
    const dispatchResult = await dispatchZohoEmail({
      to: adminEmail,
      replyTo: `${name.trim()} <${email.trim()}>`,
      subject: `[Tiara Sports Club Inquiry] ${inquiryType} - ${name.trim()} (${sport}) [#${referenceCode}]`,
      text: adminMailText,
      html: adminMailHtml
    });

    if (dispatchResult.success) {
      deliveryDetails = `${dispatchResult.details}`;
      newInquiry.smtpDetails = dispatchResult.details;
    } else {
      deliveryDetails = `Recorded in Desk System (Zoho SMTP: ${dispatchResult.error})`;
      newInquiry.smtpDetails = `Zoho SMTP relay notice: ${dispatchResult.error}`;
    }
  } catch (error: any) {
    console.error('[Zoho SMTP Dispatch Exception]', error.message);
    deliveryDetails = 'Registered in Admin Desk System; SMTP relay note: ' + error.message;
    newInquiry.smtpDetails = 'Encountered: ' + error.message;
  }

  res.status(200).json({
    success: true,
    referenceId: referenceCode,
    message: 'Your inquiry has been registered with the sports help desk at Tiara Sports Club.',
    deliveryDetails,
    inquiry: newInquiry
  });
});

// GET /api/smtp-config - Get live Zoho SMTP configuration info
app.get('/api/smtp-config', (_req: Request, res: Response): void => {
  res.json({
    configured: true,
    host: process.env.SMTP_HOST || ZOHO_CONFIG.host,
    senderEmail: process.env.SMTP_USER || ZOHO_CONFIG.user,
    adminRecipient: process.env.CONTACT_RECEIVER_EMAIL || ZOHO_CONFIG.adminRecipient,
    primaryPort: 465,
    primaryProtocol: 'SSL',
    failoverPort: 587,
    failoverProtocol: 'TLS',
    workflow: 'Inquiries sent directly from web@uniqtechsolutions.com to admin pallavi@uniqtechsolutions.com with dual-port failover.'
  });
});

// GET /api/inquiries - Admin list inquiries
app.get('/api/inquiries', (_req: Request, res: Response) => {
  res.json({
    total: inquiries.length,
    inquiries
  });
});

// PATCH /api/inquiries/:id - Update status or notes
app.patch('/api/inquiries/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const target = inquiries.find(inq => inq.id === id);
  if (!target) {
    res.status(404).json({ error: 'Inquiry not found' });
    return;
  }

  if (status && ['New', 'In Review', 'Contacted', 'Enrolled', 'Archived'].includes(status)) {
    target.status = status;
  }
  if (adminNotes !== undefined) {
    target.adminNotes = adminNotes;
  }

  res.json({ success: true, inquiry: target });
});

// DELETE /api/inquiries/:id - Remove inquiry
app.delete('/api/inquiries/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const initialLength = inquiries.length;
  inquiries = inquiries.filter(inq => inq.id !== id);

  if (inquiries.length === initialLength) {
    res.status(404).json({ error: 'Inquiry not found' });
    return;
  }

  res.json({ success: true, message: 'Inquiry deleted' });
});

// POST /api/inquiries/test-email - Test Zoho SMTP configuration directly to admin
app.post('/api/inquiries/test-email', async (req: Request, res: Response): Promise<void> => {
  const { targetEmail } = req.body;
  const to = targetEmail || process.env.CONTACT_RECEIVER_EMAIL || ZOHO_CONFIG.adminRecipient;
  const sender = process.env.SMTP_USER || ZOHO_CONFIG.user;
  const host = process.env.SMTP_HOST || ZOHO_CONFIG.host;

  console.log(`[Zoho SMTP Test] Triggering test email to ${to} via ${host}...`);

  try {
    const testResult = await dispatchZohoEmail({
      to,
      subject: `[Zoho SMTP Test] Tiara Sports Club Relay Verification (${new Date().toLocaleTimeString('en-IN')})`,
      text: `Zoho SMTP Test Message for Tiara Sports Club Vadodara.
Sender: ${sender}
Admin Recipient: ${to}
Host: ${host} (Port 465 SSL & Port 587 TLS failover)
Timestamp: ${new Date().toISOString()}

This message confirms that Zoho SMTP credentials and delivery workflow are properly configured and operational.`,
      html: `
        <div style="font-family: Arial, sans-serif; background:#f4f6f9; padding:24px; color:#1e293b;">
          <div style="max-width:580px; margin:0 auto; background:#ffffff; border-radius:6px; border:1px solid #e2e8f0; overflow:hidden;">
            <div style="background:#0A192F; border-bottom:4px solid #C5A059; padding:20px 24px;">
              <h2 style="color:#ffffff; margin:0; font-size:18px;">TIARA SPORTS CLUB - ZOHO SMTP TEST</h2>
              <p style="color:#C5A059; margin:4px 0 0; font-size:12px; text-transform:uppercase; letter-spacing:1px;">
                Relay Diagnostic Verification
              </p>
            </div>
            <div style="padding:24px; font-size:13px; line-height:1.6;">
              <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:4px; padding:12px 16px; margin-bottom:18px; color:#15803D; font-weight:600;">
                ✓ Zoho SMTP Connection & Relay Verified Successfully
              </div>
              <table style="width:100%; border-collapse:collapse; margin-bottom:16px;">
                <tr><td style="padding:6px 0; color:#64748B; width:130px;">Sender:</td><td style="font-weight:600; color:#0F172A;">${sender}</td></tr>
                <tr><td style="padding:6px 0; color:#64748B;">Admin Recipient:</td><td style="font-weight:600; color:#0F172A;">${to}</td></tr>
                <tr><td style="padding:6px 0; color:#64748B;">Host:</td><td style="font-weight:600; color:#0F172A;">${host}</td></tr>
                <tr><td style="padding:6px 0; color:#64748B;">Ports:</td><td style="font-weight:600; color:#0F172A;">Port 465 (SSL) / Port 587 (TLS Failover)</td></tr>
                <tr><td style="padding:6px 0; color:#64748B;">Sent At:</td><td style="color:#64748B;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
              </table>
              <p style="color:#64748B; font-size:12px; margin-bottom:0;">
                Club Address: Tiara Sports Club, Besides Red Coral greens, opposite Nayara petrol pump, sama-savli road Vadodara
              </p>
            </div>
          </div>
        </div>
      `
    });

    if (testResult.success) {
      res.json({
        configured: true,
        success: true,
        message: `Zoho SMTP test email successfully delivered to ${to} (${testResult.details}).`,
        portUsed: testResult.portUsed,
        protocol: testResult.protocol,
        messageId: testResult.messageId,
        details: testResult.details,
        sender,
        recipient: to,
        host
      });
    } else {
      res.status(502).json({
        configured: true,
        success: false,
        error: `Zoho SMTP attempt failed: ${testResult.error}`,
        sender,
        recipient: to,
        host
      });
    }
  } catch (err: any) {
    res.status(500).json({
      configured: true,
      success: false,
      error: 'SMTP test error: ' + err.message
    });
  }
});

// POST /api/newsletter - Join bulletin
app.post('/api/newsletter', (req: Request, res: Response): void => {
  const { email } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email address' });
    return;
  }

  const existing = newsletterSubscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
  if (!existing) {
    newsletterSubscribers.push({ email: email.toLowerCase(), date: new Date().toISOString() });
  }

  res.json({ success: true, message: 'Successfully subscribed to the Tiara Athletic Blog.' });
});

// Vite or Static file serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tiara Sport Club server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
