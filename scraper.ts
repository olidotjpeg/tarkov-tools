import { AxiosError, AxiosResponse } from "axios";

const axios = require("axios");
const cheerio = require("cheerio");
const barterUrl = "https://escapefromtarkov.fandom.com/wiki/Barter_trades";
const tableSelector = ".wikitable > tbody";
const htmlStringDeleter = async (strInputCode: string) =>
  strInputCode.replace(/<\/?[^>]+(>|$)/g, "");
// const newLineRemote = (strInputCode) => strInputCode.replace(/\r?\n|\r/g, "");

let htmlRows: string[] = [];
let titles: string[] = [];

async function getData() {
  return axios
    .get(barterUrl)
    .then(function (response: AxiosResponse<any>) {
      return response;
    })
    .catch(function (error: AxiosError) {
      console.log(error);
    });
}

async function getHtmlRows() {
  const { data } = await getData();
  const $ = cheerio.load(data);

  const tables = $(tableSelector);

  tables.each((i: number, item: Element) => {
    const value = $(item).html();
    const newValue = value.split("</tr>");
    htmlRows = [...htmlRows, ...newValue];
  });
}

async function getHtmlTitles() {
  const dataRow = htmlRows[0];
  const cleanData = await htmlStringDeleter(dataRow);

  const joinedValues = cleanData.split("\n");
  titles = joinedValues.filter((str) => str);
}

async function scrapeContent() {
  await getHtmlRows();
  await getHtmlTitles();

  console.log(titles);
}

scrapeContent();
