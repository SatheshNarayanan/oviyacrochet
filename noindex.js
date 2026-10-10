const fs = require('fs');
const path = require('path');

const layoutsToNoIndex = [
  'app/admin/layout.tsx',
  'app/(store)/account/layout.tsx',
  'app/(store)/checkout/layout.tsx',
  'app/(store)/track/layout.tsx',
  'app/(store)/cart/layout.tsx'
];

for (const relPath of layoutsToNoIndex) {
  const p = path.join(__dirname, relPath);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    if (!content.includes('robots: { index: false')) {
      if (content.includes('export const metadata: Metadata = {')) {
        content = content.replace(/export const metadata: Metadata = \{/, 'export const metadata: Metadata = {\n  robots: { index: false, follow: false },');
        fs.writeFileSync(p, content, 'utf8');
        console.log('Updated ' + relPath);
      } else {
         const newMeta = `import type { Metadata } from "next";\nexport const metadata: Metadata = { robots: { index: false, follow: false } };\n`;
         fs.writeFileSync(p, newMeta + content, 'utf8');
         console.log('Added ' + relPath);
      }
    }
  } else {
    const pagePath = p.replace('layout.tsx', 'page.tsx');
    if (fs.existsSync(pagePath)) {
      let content = fs.readFileSync(pagePath, 'utf8');
      if (!content.includes('robots: { index: false')) {
        if (content.includes('export const metadata: Metadata = {')) {
          content = content.replace(/export const metadata: Metadata = \{/, 'export const metadata: Metadata = {\n  robots: { index: false, follow: false },');
          fs.writeFileSync(pagePath, content, 'utf8');
          console.log('Updated page ' + pagePath);
        } else {
           const newMeta = `import type { Metadata } from "next";\nexport const metadata: Metadata = { robots: { index: false, follow: false } };\n`;
           fs.writeFileSync(pagePath, newMeta + content, 'utf8');
           console.log('Added to page ' + pagePath);
        }
      }
    }
  }
}
