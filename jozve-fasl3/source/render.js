const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch();
  let p = await b.newPage();
  await p.goto('file:///tmp/build/bg.html');
  await p.pdf({ path: '/tmp/build/bg.pdf', format: 'A4', preferCSSPageSize: true, printBackground: true, pageRanges: '1' });
  await p.close();
  const src = fs.readFileSync('/tmp/build/jozve.html','utf8');
  for (const [mode, out] of [['', 'body.pdf'], ['hl', 'body-hl.pdf']]) {
    fs.writeFileSync('/tmp/build/_r.html', src.replace('__MODE__', mode));
    p = await b.newPage();
    await p.goto('file:///tmp/build/_r.html'); await p.evaluate(() => document.fonts.ready);
    await p.pdf({ path: '/tmp/build/' + out, format: 'A4', preferCSSPageSize: true, printBackground: true });
    await p.close();
  }
  await b.close();
})();
