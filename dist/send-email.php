<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (empty($input['name']) || empty($input['email']) || empty($input['phone'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

// Sanitize inputs
$name = htmlspecialchars(strip_tags($input['name']));
$email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$phone = preg_replace('/[^0-9]/', '', $input['phone']);
$inquiryType = htmlspecialchars(strip_tags($input['inquiryType'] ?? 'General Sports Inquiry'));
$sport = htmlspecialchars(strip_tags($input['sport'] ?? 'All Disciplines'));
$preferredTime = htmlspecialchars(strip_tags($input['preferredTime'] ?? 'Flexible'));
$message = htmlspecialchars(strip_tags($input['message'] ?? 'No message provided'));

// Validate phone is exactly 10 digits
if (strlen($phone) !== 10) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Phone number must be exactly 10 digits']);
    exit;
}

// Generate reference code
$referenceCode = 'TSC-' . date('Y') . '-' . rand(1000, 9999);

// Zoho SMTP Configuration
$smtpHost = 'smtp.zoho.com';
$smtpPort = 465; // SSL
$smtpUser = 'web@uniqtechsolutions.com';
$smtpPassword = 'Web@281989#';
$adminEmail = 'pallavi@uniqtechsolutions.com';

// Beautiful HTML Email Template
$emailHTML = '
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
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
          ' . $referenceCode . '
        </div>
      </div>

      <table style="width:100%; border-collapse:collapse; margin-bottom:24px; font-size:13px;">
        <tr style="border-bottom:1px solid #F1F5F9;">
          <td style="padding:10px 0; color:#64748B; width:140px; font-weight:600;">Applicant Name:</td>
          <td style="padding:10px 0; font-weight:700; color:#0F172A; font-size:14px;">' . $name . '</td>
        </tr>
        <tr style="border-bottom:1px solid #F1F5F9;">
          <td style="padding:10px 0; color:#64748B; font-weight:600;">Email Address:</td>
          <td style="padding:10px 0;"><a href="mailto:' . $email . '" style="color:#0A192F; font-weight:600; text-decoration:underline;">' . $email . '</a></td>
        </tr>
        <tr style="border-bottom:1px solid #F1F5F9;">
          <td style="padding:10px 0; color:#64748B; font-weight:600;">Telephone:</td>
          <td style="padding:10px 0;"><a href="tel:' . $phone . '" style="color:#0F172A; font-weight:600; text-decoration:none;">' . $phone . '</a></td>
        </tr>
        <tr style="border-bottom:1px solid #F1F5F9;">
          <td style="padding:10px 0; color:#64748B; font-weight:600;">Inquiry Category:</td>
          <td style="padding:10px 0; color:#0A192F; font-weight:700;">' . $inquiryType . '</td>
        </tr>
        <tr style="border-bottom:1px solid #F1F5F9;">
          <td style="padding:10px 0; color:#64748B; font-weight:600;">Sport / Arena:</td>
          <td style="padding:10px 0; color:#C5A059; font-weight:700;">' . $sport . '</td>
        </tr>
        <tr>
          <td style="padding:10px 0; color:#64748B; font-weight:600;">Preferred Timing:</td>
          <td style="padding:10px 0; color:#334155; font-weight:600;">' . $preferredTime . '</td>
        </tr>
      </table>

      <div style="background:#F8FAFC; border-left:4px solid #C5A059; padding:16px 18px; border-radius:3px;">
        <strong style="color:#0F172A; font-size:12px; text-transform:uppercase; letter-spacing:0.8px; display:block; margin-bottom:6px;">APPLICANT STATEMENT / REQUIREMENTS:</strong>
        <p style="margin:0; font-size:13.5px; line-height:1.6; color:#334155; white-space:pre-wrap;">' . $message . '</p>
      </div>
    </div>

    <!-- Footer Information -->
    <div style="background:#0A192F; color:#94A3B8; padding:18px 28px; font-size:11px; line-height:1.6;">
      <strong style="color:#ffffff;">Tiara Sports Club Vadodara</strong><br/>
      Tiara Sports Club, Besides Red Coral greens, opposite Nayara petrol pump, sama-savli road Vadodara<br/>
      Received: ' . date('d/m/Y, h:i:s A') . '
    </div>
  </div>
</body>
</html>
';

// Plain text version
$emailText = "TIARA SPORTS CLUB - NEW INQUIRY NOTIFICATION\n\n";
$emailText .= "Reference: $referenceCode\n";
$emailText .= "Time: " . date('d/m/Y, h:i:s A') . "\n\n";
$emailText .= "Applicant Name: $name\n";
$emailText .= "Email: $email\n";
$emailText .= "Phone: $phone\n";
$emailText .= "Inquiry Category: $inquiryType\n";
$emailText .= "Sport / Arena: $sport\n";
$emailText .= "Preferred Timing: $preferredTime\n\n";
$emailText .= "Message:\n$message\n\n";
$emailText .= "----------------------------------------\n";
$emailText .= "Tiara Sports Club Vadodara\n";
$emailText .= "Besides Red Coral greens, opposite Nayara petrol pump, sama-savli road Vadodara";

// Send email using PHP mail() with SMTP configuration
$subject = "[Tiara Sports Club Inquiry] $inquiryType - $name ($sport) [#$referenceCode]";
$headers = "From: Tiara Sports Club Inquiry Desk <$smtpUser>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

// Configure PHP mail to use Zoho SMTP
ini_set('SMTP', $smtpHost);
ini_set('smtp_port', $smtpPort);
ini_set('sendmail_from', $smtpUser);

// Try to send email
$mailSent = mail($adminEmail, $subject, $emailHTML, $headers);

if ($mailSent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'referenceId' => $referenceCode,
        'message' => 'Your inquiry has been registered with the sports help desk at Tiara Sports Club.',
        'deliveryDetails' => 'Dispatched to pallavi@uniqtechsolutions.com via Zoho SMTP'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to send email. Please try again or contact us directly.'
    ]);
}
?>
