import fs from "fs";
import cheerio from "cheerio";

export const htmlStringDeleter = (strInputCode: string) => {
  return strInputCode.replace(/<\/?[^>]+(>|$)/g, "");
};

export const getImageUrls = (strInputCode: string) => {
  return strInputCode.match(/<img([\w\W]+?)>/g);
};

export const removeLineBreaks = (input: string) => {
  const joinedValues = input.split("\n");
  return joinedValues.filter((str) => str);
};

export const removeArrowStrings = (input: string[]) => {
  return input.filter((str) => str !== "→");
};

export const extractUrlMetaData = (input: any) => {
  return input.map((element: any) => {
    const $ = cheerio.load(element);
    const imgSrc = $("img").map((idx, img) => $(img).attr("data-src"));
    const imgAlt = $("img").map((idx, img) => $(img).attr("alt"));
    return {
      src: imgSrc[0],
      alt: imgAlt[0],
    };
  });
};

export async function writeToFileDEBUG(content: any) {
  try {
    const data = fs.appendFileSync(
      "./test.json",
      JSON.stringify(content, null, 2)
    );
    //file written successfully
  } catch (err) {
    console.error(err);
  }
}
