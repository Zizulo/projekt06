const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'output.csv',
    header: [
        {id: 'id', title: 'Id'},
        {id: 'name', title: 'Imię'},
        {id: 'lastname', title: 'Nazwisko'},
        {id: 'lawyer_nr', title: 'Numer zawodu'},
        {id: 'email', title: 'Email'},
        {id: 'street', title: 'Ulica'},
        {id: 'city', title: 'Miasto'},
        {id: 'zip_code', title: 'Kod pocztowy'}
    ]
});

async function scrapePageData(pageNumber) {
  const pageUrl = '' + pageNumber + '';
  
  const browser = await puppeteer.launch({
    headless: 'new'
  });
  
  const page = await browser.newPage();

  await page.goto(pageUrl, {timeout: 240000});
  console.log("wszedłem na stronę: " + pageUrl);

  await page.waitForSelector('td.icon_link a');
  await page.waitForSelector('tr td:nth-child(1)');
  const searchIcons = await page.$$('td.icon_link a');
  const searchIds = await page.$$('tr td:nth-child(1)');

  
  for (let i = 0; i < searchIcons.length; i++) {
        
        const searchId = await searchIds[i].getProperty('textContent');
        const text = await searchId.jsonValue();

        const newPage = await browser.newPage();
        const href = await searchIcons[i].evaluate((node) => node.getAttribute('href'));
        if (href) {
          await newPage.goto(href);
          console.log(href);
        }

        const data = await newPage.evaluate((text) => {
          const lawyers = [];
          const lawyersElements = document.querySelectorAll('section');
          lawyersElements.forEach((lawyerElement) => {
            const lawyer = {};
            const fullName = lawyerElement.querySelector('h2') ? lawyerElement.querySelector('h2').textContent : '';
            if(fullName){
  
              const titleRegex = /(Dr|Prof|Doc|inż|mgr|hab|nadzw)\.?\s?/gi; // regex dla tytułu naukowego
              const nameParts = fullName.trim().split(' ');
  
              let firstName = '';
              let lastName = '';
              let title = '';
  
              if (titleRegex.test(nameParts[0])) {
                title = nameParts[0];
                nameParts.shift(); // usuń tytuł z listy imion i nazwisk
              }
  
              if (nameParts.length > 1) {
                lastName = nameParts[0];
                for (let i = 1; i < nameParts.length; i++) {
                  firstName += nameParts[i] + " ";
                }
                firstName = firstName.trim();
              } else {
                lastName = nameParts[0];
              }
              
              lawyer.name = firstName;
              lawyer.lastname = lastName;
  
              lawyer.id = text;
              
              const emailElement = lawyerElement.querySelector('.address_e');
              if (emailElement) {
                const email1 = emailElement.getAttribute('data-ea');
                const email2 = emailElement.getAttribute('data-eb');
                const email = email1 + "@" + email2;
                lawyer.email = email;
                
              }
              
              lawyer.lawyer_nr = lawyerElement.querySelector('h3') ? lawyerElement.querySelector('h3')?.textContent : '';

              const address_area = lawyerElement.querySelectorAll('section div.line_list_K > div > span');
              address_area.forEach(span => {
  
                if(span.textContent === "Adres do korespondencji:"){
                  const address = span.nextElementSibling.textContent;
                  
                  const addressLines = address.split('\t').map(str => str.trim());
                  const addressLines_1 = addressLines[addressLines.length - 1].split('\n').map(str => str.trim());
                  
                  const zip_city = addressLines_1[addressLines_1.length - 1].split(' ');
                  lawyer.street = addressLines_1[0];
                  lawyer.zip_code = zip_city[0];
                  lawyer.city = zip_city[1];
                            
                }
  
              });
          
              lawyers.push(lawyer);
            }
            
          });
          return lawyers;
         }, text);
        await csvWriter.writeRecords(data);
        console.log(data);
        await page.bringToFront();
        await newPage.close();
      
  }
     
await browser.close();
  
}

(async () => {
  for (let i = 1; i <= 215; i++) {
    await scrapePageData(i);
  }
})();





