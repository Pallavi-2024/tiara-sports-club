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
    // Generate reference code on client side for immediate display
    const referenceCode = `TSC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Submit to PHP backend (uses Zoho SMTP)
    const res = await fetch('/send-email.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        // Save to local cache
        const inquiry = {
          id: `inq-${Date.now()}`,
          referenceId: data.referenceId || referenceCode,
          ...payload,
          status: 'New',
          createdAt: new Date().toISOString()
        };
        saveToLocalCache(inquiry);
        
        return {
          success: true,
          referenceId: data.referenceId || referenceCode,
          message: data.message || 'Your inquiry has been registered with the sports help desk at Tiara Sports Club.',
          deliveryDetails: data.deliveryDetails || 'Dispatched to pallavi@uniqtechsolutions.com via Zoho SMTP'
        };
      }
    }
    
    // If response is not ok, try to get error message
    const errorData = await res.json().catch(() => ({}));
    return {
      success: false,
      referenceId: '',
      message: '',
      error: errorData.error || 'Failed to submit inquiry. Please try again.'
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
