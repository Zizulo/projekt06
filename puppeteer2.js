const puppeteer = require('puppeteer');

async function autoScroll(page){
  await page.evaluate(async() => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        const element = document.querySelectorAll('.section-scrollbox')[1];
        var scrollHeight = element.scrollHeight;
        element.scrollBy(0, distance);
        totalHeight += distance;

        if(totalHeight >= scrollHeight){
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

async function parsePlaces(page){
  let places = [];
  const elements = await page.$$('.qBF1Pd.fontHeadlineSmall');
  if(elements && elements.length){
    for(const el of elements){
      const name = await el.evaluate(document.querySelector('.qBF1Pd.fontHeadlineSmall')?.textContent);

      places.push({name});
    }
  }
  return places;
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  const pageUrl = 'https://www.google.com/maps/search/medycyna+estetyczna+%C5%9Bwi%C4%99tokrzyskie/@50.7919049,20.1154947,9.08z'; 
  await page.goto(pageUrl, {timeout: 12000});

  const places = await parsePlaces(page);
  await autoScroll(page);
  console.log(places);

  // await browser.close();
})();