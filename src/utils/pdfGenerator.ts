import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Transaction, Item, Contact, BusinessIdentity } from '@/store/useOSStore';

export const PdfGenerator = {
  generateInvoice: async (
    tx: Transaction,
    item: Item,
    contact: Contact,
    identity: BusinessIdentity
  ) => {
    const dateStr = new Date(tx.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const taxAmount = (tx.amount * identity.taxRate) / (100 + identity.taxRate);
    const subtotal = tx.amount - taxAmount;

    const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <style>
      body {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        padding: 40px;
        color: #1a1a1a;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 60px;
      }
      .logo {
        width: 60px;
        height: 60px;
        border-radius: 12px;
      }
      .business-info {
        text-align: right;
      }
      .business-name {
        font-size: 24px;
        font-weight: 800;
        margin-bottom: 4px;
      }
      .business-sub {
        font-size: 12px;
        color: #666;
        margin-bottom: 2px;
      }
      .invoice-title {
        font-size: 42px;
        font-weight: 800;
        letter-spacing: -1px;
        margin-bottom: 40px;
      }
      .details-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 40px;
      }
      .detail-group label {
        display: block;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        color: #999;
        margin-bottom: 8px;
        letter-spacing: 1px;
      }
      .detail-group value {
        display: block;
        font-size: 14px;
        font-weight: 600;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 40px;
      }
      th {
        text-align: left;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        color: #999;
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
        letter-spacing: 0.5px;
      }
      td {
        padding: 20px 0;
        border-bottom: 1px solid #f9f9f9;
        font-size: 14px;
      }
      .item-name {
        font-weight: 600;
      }
      .item-cat {
        font-size: 11px;
        color: #888;
        margin-top: 4px;
      }
      .totals {
        width: 250px;
        margin-left: auto;
      }
      .total-row {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
      }
      .total-row.grand {
        border-top: 2px solid #1a1a1a;
        margin-top: 10px;
        padding-top: 20px;
      }
      .total-row.grand label {
        font-weight: 800;
        font-size: 18px;
      }
      .total-row.grand value {
        font-weight: 800;
        font-size: 24px;
      }
      .footer {
        margin-top: 100px;
        padding-top: 40px;
        border-top: 1px solid #eee;
        font-size: 11px;
        color: #999;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <img src="${identity.logoUrl}" class="logo" />
      <div class="business-info">
        <div class="business-name">${identity.name}</div>
        <div class="business-sub">${identity.address || ''}</div>
        <div class="business-sub">${identity.phone || ''}</div>
        <div class="business-sub">${identity.email || ''}</div>
      </div>
    </div>

    <div class="invoice-title">Invoice</div>

    <div class="details-row">
      <div class="detail-group">
        <label>Bill To</label>
        <value>${contact.name}</value>
        <value style="font-weight: 400; color: #666; font-size: 12px;">${contact.type}</value>
      </div>
      <div class="detail-group" style="text-align: right;">
        <label>Invoice Number</label>
        <value>#${tx.id.split('_').pop()}</value>
        <label style="margin-top: 20px;">Date</label>
        <value>${dateStr}</value>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Unit Price</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="item-name">${item.name}</div>
            <div class="item-cat">${item.category}</div>
            ${tx.note ? `<div class="item-cat" style="color: #666;">${tx.note}</div>` : ''}
          </td>
          <td style="text-align: center;">${tx.qty || 1}</td>
          <td style="text-align: right;">${identity.currency}${item.price.toLocaleString()}</td>
          <td style="text-align: right; font-weight: 700;">${identity.currency}${(item.price * (tx.qty || 1)).toLocaleString()}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <div class="total-row">
        <span style="color: #999;">Subtotal</span>
        <span style="font-weight: 600;">${identity.currency}${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div class="total-row">
        <span style="color: #999;">Tax (${identity.taxRate}%)</span>
        <span style="font-weight: 600;">${identity.currency}${taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div class="total-row grand">
        <label>Total</label>
        <value>${identity.currency}${tx.amount.toLocaleString()}</value>
      </div>
    </div>

    <div class="footer">
      <div style="font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">${identity.signatureName}</div>
      <div>Thank you for your business.</div>
      <div style="margin-top: 15px;">Generated by Business OS</div>
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
