Puppeteer.js

1. Opis kodu:
Poniższy kod jest skryptem napisanym w języku JavaScript, który używa bibliotek puppeteer i csv-writer do pobierania danych z witryny internetowej i zapisywania ich do pliku CSV.

2. Zależności:
puppeteer: Jest to biblioteka Node.js, która dostarcza wysokopoziomowe API do kontroli przeglądarki Chrome lub Chromium. Służy do automatyzacji interakcji z przeglądarką, takich jak nawigacja po stronach, klikanie elementów, wypełnianie formularzy, pobieranie danych itp.
csv-writer: Jest to biblioteka do tworzenia i zapisywania danych do pliku CSV. Umożliwia tworzenie struktury nagłówka CSV oraz zapisywanie rekordów danych w pliku CSV.

3. Struktura kodu:
Kod składa się z dwóch głównych części:

Funkcji scrapePageData, która odpowiada za pobieranie danych ze strony dla określonej liczby stron.
Bloku głównego (async () => {...})(), który uruchamia skrypt, iterując przez strony i wywołując funkcję scrapePageData.

4. Funkcja scrapePageData(pageNumber, startIndex):

Funkcja scrapePageData jest asynchroniczną funkcją, która pobiera dane ze strony dla określonej liczby stron.

5. Parametry

pageNumber (numer strony): Numer strony, z której będą pobierane dane.
startIndex (indeks początkowy): Indeks początkowy dla identyfikatorów danych, które będą pobierane. Jest to używane do nadawania unikalnych identyfikatorów dla każdego rekordu danych.

6. Algorytm

    Tworzenie adresu URL strony na podstawie numeru strony:

        const pageUrl = '' + pageNumber + '';

        Tworzy adres URL, na którym będą pobierane dane. Numer strony jest używany do zbudowania pełnego adresu URL.

    Uruchamianie przeglądarki przy użyciu biblioteki puppeteer:

        const browser = await puppeteer.launch({
            headless: 'new'
        });

        Tworzy nową instancję przeglądarki Chrome lub Chromium za pomocą biblioteki puppeteer. Parametr headless: 'new' określa, że przeglądarka będzie uruchomiona w trybie bezinterakcyjnym (bez okna graficznego)

    Tworzenie nowej strony:

        const page = await browser.newPage();

        Tworzy nową stronę w ramach otwartej przeglądarki.

    Przejście do strony o podanym adresie URL:

        await page.goto(pageUrl, {timeout: 2400000});

        Otwiera podaną stronę w przeglądarce. Parametr timeout określa czas oczekiwania na załadowanie strony (tutaj ustawiony na 2400000 ms).

    Pobieranie danych ze strony:

        const data = await page.evaluate((startIndex) => {
            // ...
        }, startIndex);

        Funkcja page.evaluate wykonuje kod JavaScript na stronie w kontekście przeglądarki. Tutaj zostaje przekazana funkcja anonimowa, która wykonuje się na stronie i zwraca pobrane dane.

    Zapisywanie danych do pliku CSV:

        await csvWriter.writeRecords(data);

        Zapisuje pobrane dane do pliku CSV przy użyciu obiektu csvWriter utworzonego za pomocą biblioteki csv-writer.

    Zamykanie przeglądarki:

        await browser.close();

        Zamyka przeglądarkę.

    Zwracanie nowego indeksu dla kolejnego wywołania funkcji scrapePageData:

        return startIndex + data.length;

        Zwraca sumę wartości startIndex i liczby rekordów danych pobranych z bieżącej strony. Ten nowy indeks będzie używany jako startIndex dla następnego wywołania funkcji.

7. Blok główny (async () => {...})()

Blok główny skryptu uruchamia funkcję scrapePageData w pętli, iterując przez strony.

    Inicjalizacja zmiennej index na wartość 0:

        let index = 0;

        Ta zmienna będzie przechowywać indeks początkowy dla identyfikatorów danych.

    Iteracja przez strony i wywołanie funkcji scrapePageData:

        for (let i = 1; i <= 719; i++) {
            index = await scrapePageData(i, index);
        }

        Pętla wykonuje się dla numerów stron od 1 do 719. Wywołuje funkcję scrapePageData dla każdej strony, przekazując numer strony i indeks początkowy.

8. Podsumowanie

Opisany powyżej kod jest skryptem napisanym w języku JavaScript, który używa bibliotek puppeteer i csv-writer do pobierania danych ze strony internetowej i zapisywania ich do pliku CSV. Skrypt iteruje przez strony i dla każdej strony pobiera określone dane, a następnie zapisuje je w pliku CSV.



        
Puppeteer1.js

1. Importowanie modułów

const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

Kod rozpoczyna się od importowania dwóch modułów: puppeteer oraz csv-writer. 
puppeteer jest biblioteką do kontroli przeglądarek, która umożliwia automatyzację działań w przeglądarce. 
csv-writer jest modułem do tworzenia plików CSV.

2. Inicjalizacja obiektu csvWriter

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

Obiekt csvWriter jest inicjalizowany z konfiguracją, która zawiera ścieżkę do pliku CSV (path) oraz nagłówki kolumn w pliku CSV.

3. Funkcja scrapePageData

async function scrapePageData(pageNumber) {
  // ...
}

Jest to funkcja asynchroniczna, która pobiera dane ze strony dla określonej pageNumber.

4. Uruchomienie przeglądarki

const browser = await puppeteer.launch({
    headless: 'new'
});

Tworzy nową instancję przeglądarki przy użyciu modułu puppeteer.

5. Utworzenie nowej strony

const page = await browser.newPage();

Tworzy nową stronę internetową przy użyciu przeglądarki.

6. Przejdź do strony

await page.goto(pageUrl, {timeout: 240000});

Przechodzi do określonego adresu URL za pomocą strony.

7. Oczekiwanie na selektory

await page.waitForSelector('td.icon_link a');
await page.waitForSelector('tr td:nth-child(1)');

Oczekuje na pojawienie się selektorów 'td.icon_link a' i 'tr td:nth-child(1)' na stronie.

8. Pobieranie elementów

const searchIcons = await page.$$('td.icon_link a');
const searchIds = await page.$$('tr td:nth-child(1)');

Pobiera listy elementów pasujących do selektorów 'td.icon_link a' i 'tr td:nth-child(1)' na stronie.

9. Iteracja przez elementy i pobieranie danych

for (let i = 0; i < searchIcons.length; i++) {
    // ...
}

Iteruje przez elementy na stronie i pobiera dane dla każdego z nich.

10. Pobieranie danych z elementów strony

const searchId = await searchIds[i].getProperty('textContent');
const text = await searchId.jsonValue();

Pobiera tekst zawarty w elemencie searchIds[i] na stronie.

11. Utworzenie nowej strony i przejście do adresu URL

const newPage = await browser.newPage();
const href = await searchIcons[i].evaluate((node) => node.getAttribute('href'));
if (href) {
    await newPage.goto(href);
    console.log(href);
}

Tworzy nową stronę i przechodzi do adresu URL pobranego z atrybutu 'href' dla searchIcons[i].

12. Pobieranie danych z nowej strony

const data = await newPage.evaluate((text) => {
    // ...
}, text);

Pobiera dane z nowej strony przy użyciu funkcji evaluate i przekazuje do niej tekst text.

13. Zapis danych do pliku CSV

await csvWriter.writeRecords(data);

Zapisuje pobrane dane do pliku CSV przy użyciu obiektu csvWriter.

14. Zamykanie strony

await newPage.close();

Zamyka nową stronę.

15. Zamyknie przeglądarki

await browser.close();

Zamyka przeglądarkę.

16. Uruchomienie skryptu

(async () => {
    for (let i = 1; i <= 215; i++) {
        await scrapePageData(i);
    }
})();

Uruchamia skrypt asynchroniczny, który iteruje przez strony od 1 do 215 i wywołuje funkcję scrapePageData dla każdej strony.
