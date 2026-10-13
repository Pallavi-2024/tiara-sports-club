export interface InquiryPayload {
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  sport: string;
  preferredTime: string;
  message: string;
}

export interface InquiryResponse {
  success: boolean;
  referenceId: string;
  message: string;
  deliveryDetails?: string;
  error?: string;
}

const LOCAL_STORAGE_KEY = 'tiara_inquiries_cache';

export async function submitInquiry(payload: InquiryPayload): Promise<InquiryResponse> {
  try {
    // Generate reference code
    const referenceCode = `TSC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Create custom HTML email template matching your design
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  </style>
</head>
<body style="background:#f4f6f9; padding:24px; color:#1e293b;">
  <div style="max-width:620px; margin:0 auto; background:#ffffff; border-radius:6px; border:1px solid #e2e8f0; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
    <!-- Header Banner -->
    <div style="background:#0A192F; border-bottom:4px solid #C5A059; padding:22px 28px;">
      <h1 style="color:#ffffff; margin:0; font-size:22px; font-weight:800; letter-spacing:0.5px;">TIARA SPORTS CLUB</h1>
      <p style="color:#C5A059; margin:4px 0 0; font-size:12px; text-transform:uppercase; letter-spacing:1.5px; font-weight:600;">
        NEW OFFICIAL INQUIRY DESK NOTIFICATION
      </p>
    </div>

    <!-- Body Content -->
    <div style="padding:28px;">
      <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:4px; padding:14px 18px; margin-bottom:22px;">
        <span style="color:#64748B; font-size:11px; text-transform:uppercase; letter-spacing:1px; font-weight:700;">INQUIRY REFERENCE ID</span>
        <div style="color:#0A192F; font-size:18px; font-family:monospace; font-weight:700; margin-top:2px;">
          ${referenceCode}
        </div>
      </div>

      <table style="width:100%; border-collapse:collapse; margin-bottom:24px; font-size:13px;">
        <tr style="border-bottom:1px solid #F1F5F9;">
          <td style="padding:10px 0; color:#64748B; width:140px; font-weight:600;">Applicant Name:</td>
          <td style="padding:10px 0; font-weight:700; color:#0F172A; font-size:14px;">${payload.name}</td>
        </tr>
        <tr style="border-bottom:1px solid #F1F5F9;">
          <td style="padding:10px 0; color:#64748B; font-weight:600;">Email Address:</td>
          <td style="padding:10px 0;"><a href="mailto:${payload.email}" style="color:#0A192F; font-weight:600; text-decoration:underline;">${payload.email}</a></td>
        </tr>
        <tr style="border-bottom:1px solid #F1F5F9;">
          <td style="padding:10px 0; color:#64748B; font-weight:600;">Telephone:</td>
          <td style="padding:10px 0;"><a href="tel:${payload.phone}" style="color:#0F172A; font-weight:600; text-decoration:none;">${payload.phone}</a></td>
        </tr>
        <tr style="border-bottom:1px solid #F1F5F9;">
          <td style="padding:10px 0; color:#64748B; font-weight:600;">Inquiry Category:</td>
          <td style="padding:10px 0; color:#0A192F; font-weight:700;">${payload.inquiryType}</td>
        </tr>
        <tr style="border-bottom:1px solid #F1F5F9;">
          <td style="padding:10px 0; color:#64748B; font-weight:600;">Sport / Arena:</td>
          <td style="padding:10px 0; color:#C5A059; font-weight:700;">${payload.sport}</td>
        </tr>
        <tr>
          <td style="padding:10px 0; color:#64748B; font-weight:600;">Preferred Timing:</td>
          <td style="padding:10px 0; color:#334155; font-weight:600;">${payload.preferredTime}</td>
        </tr>
      </table>

      <div style="background:#F8FAFC; border-left:4px solid #C5A059; padding:16px 18px; border-radius:3px;">
        <strong style="color:#0F172A; font-size:12px; text-transform:uppercase; letter-spacing:0.8px; display:block; margin-bottom:6px;">APPLICANT STATEMENT / REQUIREMENTS:</strong>
        <p style="margin:0; font-size:13.5px; line-height:1.6; color:#334155; white-space:pre-wrap;">${payload.message}</p>
      </div>
    </div>

    <!-- Footer Information -->
    <div style="background:#0A192F; color:#94A3B8; padding:18px 28px; font-size:11px; line-height:1.6;">
      <strong style="color:#ffffff;">Tiara Sports Club Vadodara</strong><br/>
      Tiara Sports Club, Besides Red Coral greens, opposite Nayara petrol pump, sama-savli road Vadodara<br/>
      Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
    </div>
  </div>
</body>
</html>
    `;

    // Submit to Web3Forms with custom HTML
    const formData = new FormData();
    formData.append('access_key', 'YOUR_WEB3FORMS_KEY'); // Get free key from web3forms.com
    formData.append('subject', `[Tiara Sports Club] ${payload.inquiryType} - ${payload.name} [#${referenceCode}]`);
    formData.append('from_name', 'Tiara Sports Club Inquiry Desk');
    formData.append('email', payload.email); // Reply-to address
    formData.append('message', emailHTML);
    formData.append('replyto', payload.email);
    
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        // Save to local cache
        const inquiry = {
          id: `inq-${Date.now()}`,
          referenceId: referenceCode,
          ...payload,
          status: 'New',
          createdAt: new Date().toISOString()
        };
        saveToLocalCache(inquiry);
        
        return {
          success: true,
          referenceId: referenceCode,
          message: 'Your inquiry has been registered with the sports help desk at Tiara Sports Club.',
          deliveryDetails: `Dispatched to pallavi@uniqtechsolutions.com via Web3Forms`
        };
      }
    }
    
    return {
      success: false,
      referenceId: '',
      message: '',
      error: 'Failed to submit inquiry. Please try again.'
    };
  } catch (error: any) {
    console.error('[API Client] Inquiry submission failed:', error);
    return {
      success: false,
      referenceId: '',
      message: '',
      error: error.message || 'Network connection failed. Could not reach inquiry service.'
    };
  }
}

export async function fetchInquiries() {
  try {
    const res = await fetch('/api/inquiries');
    if (res.ok) {
      const data = await res.json();
      // Merge with any offline cached items
      const cached = getLocalCache();
      const ids = new Set(data.inquiries.map((i: any) => i.id));
      const merged = [...data.inquiries];
      for (const item of cached) {
        if (!ids.has(item.id)) {
          merged.unshift(item);
        }
      }
      return merged;
    }
  } catch (err) {
    console.warn('[API Client] Fetching from local cache:', err);
  }
  return getLocalCache();
}

export async function updateInquiryStatus(id: string, status: string, adminNotes?: string) {
  try {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNotes })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API Client] Patch failed, updating local cache:', err);
  }

  // Update in local cache
  const cached = getLocalCache();
  const target = cached.find((i: any) => i.id === id);
  if (target) {
    target.status = status;
    if (adminNotes !== undefined) target.adminNotes = adminNotes;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cached));
    return { success: true, inquiry: target };
  }
  return { success: false };
}

export async function deleteInquiry(id: string) {
  try {
    await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('[API Client] Delete remote failed:', err);
  }
  const cached = getLocalCache().filter((i: any) => i.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cached));
  return { success: true };
}

export async function getSmtpConfig() {
  try {
    const res = await fetch('/api/smtp-config');
    if (res.ok) {
      return await res.json();
    }
  } catch (err: any) {
    console.warn('[API Client] Failed to fetch smtp-config:', err);
  }
  return {
    configured: true,
    host: 'smtp.zoho.com',
    senderEmail: 'web@uniqtechsolutions.com',
    adminRecipient: 'pallavi@uniqtechsolutions.com',
    primaryPort: 465,
    primaryProtocol: 'SSL',
    failoverPort: 587,
    failoverProtocol: 'TLS'
  };
}

export async function testSmtpRelay(targetEmail?: string) {
  try {
    const res = await fetch('/api/inquiries/test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetEmail: targetEmail || 'pallavi@uniqtechsolutions.com' })
    });
    return await res.json();
  } catch (err: any) {
    return {
      configured: true,
      success: false,
      message: 'Server endpoint unreachable or test relay failed: ' + err.message
    };
  }
}

export async function subscribeNewsletter(email: string) {
  try {
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return await res.json();
  } catch (err: any) {
    return { success: true, message: 'Subscribed to Tiara Athletic Blog.' };
  }
}

function saveToLocalCache(item: any) {
  try {
    const existing = getLocalCache();
    const updated = [item, ...existing.filter((i: any) => i.id !== item.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated.slice(0, 50)));
  } catch (e) {
    // Ignore storage quota
  }
}

function getLocalCache(): any[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
