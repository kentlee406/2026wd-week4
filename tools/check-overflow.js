const { chromium } = require('playwright');

const BASE = 'http://localhost:5174/2026wd-week4/';
const PAGES = ['index.html','products.html','product.html','collect.html','login.html','story.html'];
const WIDTHS = [375, 414, 768, 1024, 1310];

function selectorFor(el){
  if(!el) return '';
  let s = el.tagName.toLowerCase();
  if(el.id) s += `#${el.id}`;
  if(el.classList && el.classList.length) s += `.${[...el.classList].join('.')}`;
  return s;
}

(async ()=>{
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const results = [];
  for(const pageFile of PAGES){
    const url = BASE + pageFile;
    for(const w of WIDTHS){
      const page = await context.newPage();
      await page.setViewportSize({width: w, height: 900});
      try{
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
      }catch(e){
        console.log(`Failed to load ${url}: ${e.message}`);
        await page.close();
        continue;
      }
      const overflow = await page.evaluate(()=>{
        const winW = window.innerWidth;
        const docW = document.documentElement.scrollWidth;
        const isOverflow = docW > winW;
        const outEls = [];
        const all = Array.from(document.querySelectorAll('body *'));
        for(const el of all){
          const r = el.getBoundingClientRect();
          if(r.right > winW || r.left < 0){
            outEls.push({
              tag: el.tagName,
              id: el.id || null,
              class: el.className || null,
              rect: {left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width)}
            });
          }
        }
        return {isOverflow, docW, winW, count: outEls.length, elements: outEls.slice(0, 15)};
      });
      results.push({page: pageFile, width: w, overflow});
      await page.close();
    }
  }
  await browser.close();
  console.log('Overflow check results:\n');
  for(const r of results){
    const {page,width,overflow} = r;
    if(overflow.isOverflow){
      console.log(`${page} @ ${width}px => OVERFLOW (docW:${overflow.docW} winW:${overflow.winW}) elements:${overflow.count}`);
      overflow.elements.forEach((el,i)=>{
        console.log(`  ${i+1}. <${el.tag.toLowerCase()}> id=${el.id} class="${el.class}" rect=${JSON.stringify(el.rect)}`);
      });
    } else {
      console.log(`${page} @ ${width}px => OK (docW:${overflow.docW} winW:${overflow.winW})`);
    }
  }
})();
