import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export const PdfGenerator = {
  generateInvoice: async (
    tx: any,
    item: any,
    contact: any,
    identity: any
  ) => {
    const dateStr = new Date(tx.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const qty = tx.qty || 1;
    const subtotal = item.price * qty;
    const taxAmount = (subtotal * identity.taxRate) / 100;
    const total = subtotal + taxAmount;

    const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Invoice</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        padding: 50px;
        color: #1e293b;
        line-height: 1.5;
        background: #fff;
      }
      .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 60px;
      }
      .logo {
        width: 80px;
        height: 80px;
        background: #f1f5f9;
        border-radius: 20px;
        object-fit: contain;
      }
      .business-name {
        font-size: 24px;
        font-weight: 800;
        color: #0f172a;
        margin-bottom: 8px;
      }
      .business-details {
        font-size: 14px;
        color: #64748b;
      }
      .invoice-meta {
        text-align: right;
      }
      .invoice-label {
        font-size: 48px;
        font-weight: 900;
        color: #f1f5f9;
        margin-top: -20px;
        text-transform: uppercase;
        letter-spacing: 2px;
      }
      .bill-to {
        margin-bottom: 40px;
      }
      .section-label {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #94a3b8;
        margin-bottom: 12px;
      }
      .client-name {
        font-size: 18px;
        font-weight: 700;
        color: #0f172a;
      }
      .client-type {
        font-size: 14px;
        color: #64748b;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 40px 0;
      }
      th {
        text-align: left;
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
        padding: 12px 0;
        border-bottom: 2px solid #f1f5f9;
      }
      td {
        padding: 20px 0;
        border-bottom: 1px solid #f1f5f9;
      }
      .item-info {
        font-weight: 600;
        color: #0f172a;
      }
      .item-desc {
        font-size: 12px;
        color: #94a3b8;
        margin-top: 4px;
      }
      .totals {
        margin-left: auto;
        width: 250px;
      }
      .total-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        font-size: 14px;
      }
      .grand-total {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 2px solid #0f172a;
        font-size: 20px;
        font-weight: 800;
        color: #0f172a;
      }
      .footer {
        margin-top: 100px;
        text-align: center;
        border-top: 1px solid #f1f5f9;
        padding-top: 40px;
        font-size: 12px;
        color: #94a3b8;
      }
      .signature {
        margin-top: 40px;
        text-align: left;
      }
      .sig-line {
        width: 200px;
        border-bottom: 1px solid #0f172a;
        margin-bottom: 8px;
      }
      .sig-name {
        font-weight: 600;
        font-style: italic;
        color: #0f172a;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <img src="${identity.logoUrl}" class="logo" />
        <div class="business-name" style="margin-top: 20px;">${identity.name}</div>
        <div class="business-details">${identity.address || ''}</div>
        <div class="business-details">${identity.email || ''}</div>
      </div>
      <div class="invoice-meta">
        <div class="invoice-label">INVOICE</div>
        <div style="font-weight: 700; color: #0f172a;">#${tx.id.replace('tx_', '').padStart(6, '0')}</div>
        <div style="color: #64748b; font-size: 14px;">Issued: ${dateStr}</div>
      </div>
    </div>

    <div class="bill-to">
      <div class="section-label">Bill To</div>
      <div class="client-name">${contact.name}</div>
      <div class="client-type">${contact.type}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 50%;">Description</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Price</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="item-info">${item.name}</div>
            <div class="item-desc">${item.category}</div>
            ${tx.note ? `<div class="item-desc">${tx.note}</div>` : ''}
          </td>
          <td style="text-align: center;">${qty}</td>
          <td style="text-align: right;">${identity.currency}${item.price.toLocaleString()}</td>
          <td style="text-align: right; font-weight: 700;">${identity.currency}${subtotal.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <div class="total-row">
        <span style="color: #64748b;">Subtotal</span>
        <span style="font-weight: 600;">${identity.currency}${subtotal.toLocaleString()}</span>
      </div>
      <div class="total-row">
        <span style="color: #64748b;">Tax (${identity.taxRate}%)</span>
        <span style="font-weight: 600;">${identity.currency}${taxAmount.toLocaleString()}</span>
      </div>
      <div class="total-row grand-total">
        <span>Total Due</span>
        <span>${identity.currency}${total.toLocaleString()}</span>
      </div>
    </div>

    <div class="signature">
      <div class="sig-line"></div>
      <div class="sig-name">${identity.signatureName}</div>
      <div style="font-size: 12px; color: #94a3b8;">Authorized Signature</div>
    </div>

    <div class="footer">
      <div>${identity.name} &bull; ${identity.email || ''} &bull; ${identity.phone || ''}</div>
      <div style="margin-top: 8px;">Thank you for your business!</div>
    </div>
  </body>
</html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error('PDF Generation failed:', error);
      throw error;
    }
  },
};
