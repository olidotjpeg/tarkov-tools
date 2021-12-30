import axios, { AxiosError, AxiosResponse } from "axios";
import cheerio, { CheerioAPI } from "cheerio";

import { barterUrl, tableSelector } from "./constants";
import {
  getImageUrls,
  extractUrlMetaData,
  htmlStringDeleter,
  removeArrowStrings,
  removeLineBreaks,
  writeToFileDEBUG,
} from "./utils";

interface GeneratedObject {
  trader: string;
  barters: BarterItem[];
  titles: string[];
}

interface BarterItem {
  images: string[];
  lines: string[];
}

const traders = [
  "Prapor",
  "Therapist",
  "Skier",
  "Peacekeeper",
  "Mechanic",
  "Ragman",
  "Jaeger",
];
const GlobalBarters: GeneratedObject[] = [];

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

async function buildTableStructure() {
  const { data }: any = await getData();
  const $ = cheerio.load(data);

  const tables = $(tableSelector).toArray();
  tables.forEach((table, idx) => {
    extractBarters(table, idx, $);
  });
}

async function extractBarters(table: any, idx: number, $: CheerioAPI) {
  const generatedObject: GeneratedObject = {
    trader: "",
    barters: [],
    titles: [],
  };

  generatedObject.trader = traders[idx];
  const $deepTable = $("tbody", table).toArray();
  const rows = $("tr", $deepTable).toArray();
  const barters = rows.map((row, idx) => {
    const htmlRow = $(row).html() ?? "";
    const imagesHtml = getImageUrls(htmlRow) ?? [];
    const images = extractUrlMetaData(imagesHtml);
    const internalBarters = removeLineBreaks(htmlStringDeleter(htmlRow));

    const newBarter = {
      images,
      lines: removeArrowStrings(internalBarters),
    };

    return newBarter;
  });

  generatedObject.titles = barters[0].lines;
  barters.shift();
  generatedObject.barters = barters;
  GlobalBarters.push(generatedObject);
}

async function scrapeContent() {
  await buildTableStructure();
  writeToFileDEBUG(GlobalBarters);
}

scrapeContent();
