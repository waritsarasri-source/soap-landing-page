# Natural Soap storefront

Minimal Thai soap storefront built with Next.js 14.

## Products
- SOAP-001 Oatmeal Gentle Bar — THB 129
- SOAP-002 Bamboo Charcoal Bar — THB 149

## Google Sheets setup
1. Create a Google Spreadsheet.
2. Open Extensions → Apps Script and paste `google-apps-script/Code.gs`.
3. Save, select and run `setupNaturalSoapSheets` once. Authorize the script.
4. Deploy → New deployment → Web app. Execute as **Me** and set access to **Anyone**.
5. Copy the Web app URL ending in `/exec`.
6. In Vercel Project Settings → Environment Variables, add `GOOGLE_SHEETS_WEB_APP_URL` for Production, Preview and Development. Redeploy.

The script creates Products, Orders, and OrderItems tabs with sample products. Replace sample stock/prices as needed.

## Run locally
```bash
npm install
npm run dev
```

Without the Google Apps Script URL, the storefront renders normally but order submission reports that Sheets setup is pending.
