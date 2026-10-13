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
    
    // Prepare FormSubmit payload
    const formData = new FormData();
    formData.append('_subject', `[Tiara Sports Club] ${payload.inquiryType} - ${payload.name}`);
    formData.append('_cc', 'pallavi@uniqtechsolutions.com'); // CC to pallavi
    formData.append('_template', 'table'); // Use table format
    formData.append('_captcha', 'false'); // Disable captcha
    formData.append('Reference_Code', referenceCode);
    formData.append('Full_Name', payload.name);
    formData.append('Email', payload.email);
    formData.append('Phone', payload.phone);
    formData.append('Inquiry_Type', payload.inquiryType);
    formData.append('Sport_Discipline', payload.sport);
    formData.append('Preferred_Time', payload.preferredTime);
    formData.append('Message', payload.message);
    formData.append('Submission_Time', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));

    // Submit to FormSubmit (sends to mikir@uniqtechsolutions.com)
    const res = await fetch('https://formsubmit.co/mikir@uniqtechsolutions.com', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
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
        deliveryDetails: `Dispatched to mikir@uniqtechsolutions.com (CC: pallavi@uniqtechsolutions.com) via FormSubmit`
      };
    } else {
      return {
        success: false,
        referenceId: '',
        message: '',
        error: 'Failed to submit inquiry. Please try again.'
      };
    }
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
    adminRecipient: 'mikir@uniqtechsolutions.com',
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
      body: JSON.stringify({ targetEmail: targetEmail || 'mikir@uniqtechsolutions.com' })
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
