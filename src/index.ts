import axios from "axios";
import { load } from "cheerio"

async function getResponseDatafromSite() {
    const response = await axios.get("https://www.scrapingcourse.com/ecommerce/");
    const data = response.data;

    const $ = load(data);

    const productHTMLElement = $("li.product").first()

    // extract the data of interest from the product node
    const url = $(productHTMLElement).find("a").first().attr("href")
    const image = $(productHTMLElement).find("img").first().attr("src")
    const name = $(productHTMLElement).find("h2").first().text()
    const price = $(productHTMLElement).find("span").first().text()


    console.log(url)
    console.log(image)
    console.log(name)
    console.log(price)
}

getResponseDatafromSite();