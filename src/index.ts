import { WaitTimeoutOptions } from './../node_modules/puppeteer-core/lib/cjs/puppeteer/api/Page.d';
import axios from "axios"
import { load } from "cheerio"
import { writeToPath } from "@fast-csv/format"
import puppeteer from "puppeteer";

type Product = {
    Url?: string
    Image?: string
    Name?: string
    Price?: string
}

async function scrapeUsingPuppeteer() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.youtube.com/watch?v=tmNXKqeUtJM'); 
 
	const videosTitleSelector = '#items h3 #video-title'; 
	await page.waitForSelector(videosTitleSelector); 
	const titles = await page.$$eval( 
		videosTitleSelector, 
		titles => titles.map(title =>  (title as HTMLElement).innerText) 
	); 
	console.log(titles ); 
 

    const videoLinks = await page.$$eval( 
	'#items .details a', 
	links => links.map(link => link.href) 
    ); 
    
    console.log(videoLinks);

    const cookieConsentSelector = 'tp-yt-paper-dialog .eom-button-row:first-child ytd-button-renderer:first-child'; 
 
    await page.waitForSelector(cookieConsentSelector); 
    page.click(cookieConsentSelector); 
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    const searchInputEl = await page.$('#search-form input'); 
    await searchInputEl?.type('top 10 songs'); 
    await searchInputEl?.press('Enter');
    await page.waitForSelector('ytd-two-column-search-results-renderer ytd-video-renderer'); 
    await page.screenshot({ path: 'youtube_search.png', fullPage: true });


	await browser.close(); 
}

async function scrapeSite() {

    const products: Product[] = []

    const firstPage = "https://www.scrapingcourse.com/ecommerce/page/1/"

    const pagesToScrape = [firstPage]
    const pagesDiscovered = [firstPage]

    let i = 1

    const limit = 5

    while (pagesToScrape.length !== 0 && i <= limit) {
        const pageURL = pagesToScrape.shift()

        const response = await axios.get(
            "https://www.scrapingcourse.com/ecommerce/",
            {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
                },
                proxy: {
                    protocol: "http",
                    host: "51.89.14.70",
                    port: 80,
                },
            }
        )
        const html = response.data
        const $ = load(html)

        $("a.page-numbers").each((j, paginationHTMLElement) => {

            const paginationURL = $(paginationHTMLElement).attr("href")

            if (paginationURL && !pagesDiscovered.includes(paginationURL)) {
                pagesDiscovered.push(paginationURL)

                if (!pagesToScrape.includes(paginationURL)) {
                    pagesToScrape.push(paginationURL)
                }
            }
        })

        $("li.product").each((i, productHTMLElement) => {

            const url = $(productHTMLElement).find("a").first().attr("href")
            const image = $(productHTMLElement).find("img").first().attr("src")
            const name = $(productHTMLElement).find("h2").first().text()
            const price = $(productHTMLElement).find("span").first().text()

            const product: Product = {
                Url: url,
                Image: image,
                Name: name,
                Price: price
            }
            products.push(product)
        })

        i++
    }

    writeToPath("products.csv", products, { headers: true })
        .on("error", error => console.error(error));
}
/*TODO: SCRAPING WITH HEADLESS BROWSER USING PUPPETER: https://www.zenrows.com/blog/puppeteer-web-scraping#use*/
scrapeUsingPuppeteer()
