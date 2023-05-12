const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'output.csv',
    header: [
        {id: 'id', title: 'Id'},
        {id: 'name', title: 'Imię'},
        {id: 'lastname', title: 'Nazwisko'},
        {id: 'email', title: 'Email'},
        {id: 'street', title: 'Ulica'},
        {id: 'city', title: 'Miasto'},
        {id: 'zip_code', title: 'Kod pocztowy'}
    ]
});

async function scrapePageData(pageNumber, startIndex) {
  const pageUrl = '' + pageNumber + '';
  const browser = await puppeteer.launch({
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.goto(pageUrl, {timeout: 2400000});
  
  // Kod do pobierania danych ze strony
  const data = await page.evaluate((startIndex) => {
        const lawyers = [];
        const lawyersElements = document.querySelectorAll('.cw5');
        lawyersElements.forEach((lawyerElement, index) => {
          const lawyer = {};
          const fullName = lawyerElement.querySelector('b') ? lawyerElement.querySelector('b').textContent : '';
          if(fullName){
            // const fullNameArray = name_lastname.split(' ');
            // const fullName = fullNameArray.length > 2 ? fullNameArray.slice(-2).join(' ') : name_lastname;

            const titleRegex = /(Dr|Prof|Doc|inż|mgr|hab|nadzw)\.?\s?/gi; // regex dla tytułu naukowego
            const nameParts = fullName.split(' ');

            let firstName = '';
            let lastName = '';
            let title = '';

            if (titleRegex.test(nameParts[0])) {
              title = nameParts[0];
              nameParts.shift(); // usuń tytuł z listy imion i nazwisk
            }

            if (nameParts.length > 1) {
              firstName = nameParts[nameParts.length - 1];
              lastName = nameParts[0];
              for (let i = 1; i < nameParts.length - 1; i++) {
                if (nameParts[i].length === 1) {
                  firstName += ' ' + nameParts[i];
                } else {
                  firstName += ' ' + nameParts[i];
                }
              }
            } else {
              firstName = nameParts[0];
            }
            
            
            lawyer.name = firstName.trim(),
            lawyer.lastname = lastName.trim()

            // lawyer.lastname = fullName.split(' ')[0];
            // lawyer.name = fullName.split(' ')[1];
            lawyer.id = index + startIndex + 1;
            const address_area = lawyerElement.querySelectorAll('#adw_details > div > .caption');
            address_area.forEach(caption => {

              if(caption.textContent === "Adres"){
                const address = caption.nextElementSibling.textContent;
                lawyer.street = address.split(",")[0].trim();
                const addressParts = address.split(" ");
                lawyer.city = addressParts[addressParts.length-1].trim();
                lawyer.zip_code = addressParts[addressParts.length-2].trim();
              }

            });
            lawyer.email = lawyerElement.querySelector('span a') ? lawyerElement.querySelector('span a').textContent : '';
      
            lawyers.push(lawyer);
          }
          
        });
        return lawyers;
       }, startIndex);
       
      
  await csvWriter.writeRecords(data);
  console.log(data);
  await browser.close();
  return startIndex + data.length;
}


(async () => {
  let index = 0;
  for (let i = 1; i <= 719; i++) {
    index = await scrapePageData(i, index);
  }
})();



