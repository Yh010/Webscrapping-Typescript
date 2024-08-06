"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const format_1 = require("@fast-csv/format");
const puppeteer_1 = __importDefault(require("puppeteer"));
function scrapeUsingPuppeteer() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        yield page.goto('https://www.youtube.com/watch?v=tmNXKqeUtJM');
        const videosTitleSelector = '#items h3 #video-title';
        yield page.waitForSelector(videosTitleSelector);
        const titles = yield page.$$eval(videosTitleSelector, titles => titles.map(title => title.innerText));
        console.log(titles);
        yield browser.close();
    });
}
function scrapeSite() {
    return __awaiter(this, void 0, void 0, function* () {
        const products = [];
        const firstPage = "https://www.scrapingcourse.com/ecommerce/page/1/";
        const pagesToScrape = [firstPage];
        const pagesDiscovered = [firstPage];
        let i = 1;
        const limit = 5;
        while (pagesToScrape.length !== 0 && i <= limit) {
            const pageURL = pagesToScrape.shift();
            const response = yield axios_1.default.get("https://www.scrapingcourse.com/ecommerce/", {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
                },
                proxy: {
                    protocol: "http",
                    host: "51.89.14.70",
                    port: 80,
                },
            });
            const html = response.data;
            const $ = (0, cheerio_1.load)(html);
            $("a.page-numbers").each((j, paginationHTMLElement) => {
                const paginationURL = $(paginationHTMLElement).attr("href");
                if (paginationURL && !pagesDiscovered.includes(paginationURL)) {
                    pagesDiscovered.push(paginationURL);
                    if (!pagesToScrape.includes(paginationURL)) {
                        pagesToScrape.push(paginationURL);
                    }
                }
            });
            $("li.product").each((i, productHTMLElement) => {
                const url = $(productHTMLElement).find("a").first().attr("href");
                const image = $(productHTMLElement).find("img").first().attr("src");
                const name = $(productHTMLElement).find("h2").first().text();
                const price = $(productHTMLElement).find("span").first().text();
                const product = {
                    Url: url,
                    Image: image,
                    Name: name,
                    Price: price
                };
                products.push(product);
            });
            i++;
        }
        (0, format_1.writeToPath)("products.csv", products, { headers: true })
            .on("error", error => console.error(error));
    });
}
/*TODO: SCRAPING WITH HEADLESS BROWSER USING PUPPETER: https://www.zenrows.com/blog/puppeteer-web-scraping#use*/
scrapeUsingPuppeteer();
