import axios from "axios";
import { load } from "cheerio"
import { writeToPath } from "@fast-csv/format"

type Product = {
    Url?: string
    Image?: string
    Name?: string
    Price?: string
}

const products: Product[] = [];
async function getResponseDatafromSite() {
    const response = await axios.get("https://www.scrapingcourse.com/ecommerce/");
    const data = response.data;

    const $ = load(data);

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

        products.push(product);

    })


    for (const product of products) {
        console.log(product.Url)
        console.log(product.Image)
        console.log(product.Name)
        console.log(product.Price)
        console.log(`\n`)
        console.log(`\n`)
    }

    writeToPath("products.csv", products, { headers: true }).on("error", error => console.error(error));

}

getResponseDatafromSite();