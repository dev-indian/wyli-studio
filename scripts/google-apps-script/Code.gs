/**
 * WYLI Booking — Google Apps Script Web App
 *
 * Deployment instructions:
 * 1. Create a new Google Sheet with these columns (Row 1 = headers):
 *    Booking ID | Timestamp | Customer Name | Phone | Email | Category | Services | Total Price | Total Duration | Appointment Date | Appointment Time | Notes | Booking Status | Source
 *
 * 2. Open the Sheet → Extensions → Apps Script
 * 3. Paste this code into Code.gs
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone (so the website can POST to it)
 * 5. Copy the Web App URL and paste it into:
 *    src/lib/wyli.ts → googleAppsScriptUrl
 *
 * Security notes:
 * - This web app is intentionally public for demo purposes.
 * - For production, add a shared secret header check:
 *     if (e.postData?.contents?.secret !== 'YOUR_SECRET') return ContentService.createTextOutput(JSON.stringify({success:false,error:'Unauthorized'})).setMimeType(ContentService.MimeType.JSON);
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Basic validation
    if (!data.booking_id || !data.customer_name || !data.phone || !data.services || !data.date || !data.time) {
      return jsonResponse(400, { success: false, error: 'Missing required fields.' });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const lastRow = sheet.getLastRow();

    // Duplicate protection by Booking ID
    const existingIds = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
    if (existingIds.includes(data.booking_id)) {
      return jsonResponse(409, { success: false, error: 'Duplicate booking ID.' });
    }

    const servicesStr = Array.isArray(data.services)
      ? data.services.map((s: any) => s.name).join(' | ')
      : String(data.services);

    const row = [
      data.booking_id,
      new Date(),
      data.customer_name,
      data.phone,
      data.customer_email || '',
      data.category || '',
      servicesStr,
      data.total_price || 0,
      data.total_duration || 0,
      data.date,
      data.time,
      data.notes || '',
      data.status || 'Confirmed',
      data.source || 'WYLI Website',
    ];

    sheet.appendRow(row);

    return jsonResponse(200, { success: true, message: 'Booking saved.', booking_id: data.booking_id });
  } catch (err) {
    return jsonResponse(500, { success: false, error: err.toString() });
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ success: true, message: 'WYLI Booking Webhook is running.' })).setMimeType(ContentService.MimeType.JSON);
}

function jsonResponse(statusCode, obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');
}
