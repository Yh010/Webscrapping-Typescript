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
const products = [];
function getResponseDatafromSite() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get("https://www.scrapingcourse.com/ecommerce/");
        const data = response.data;
        const $ = (0, cheerio_1.load)(data);
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
        // extract the data of interest from the product node
        for (const product of products) {
            console.log(product.Url);
            console.log(product.Image);
            console.log(product.Name);
            console.log(product.Price);
            console.log(`\n`);
            console.log(`\n`);
        }
        (0, format_1.writeToPath)("products.csv", products, { headers: true }).on("error", error => console.error(error));
    });
}
getResponseDatafromSite();
