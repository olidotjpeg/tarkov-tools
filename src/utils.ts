import fs from "fs";

export const htmlStringDeleter = (strInputCode: string) =>
  strInputCode.replace(/<\/?[^>]+(>|$)/g, "");

export const removeLineBreaks = (input: string) => {
  const joinedValues = input.split("\n");
  return joinedValues.filter((str) => str);
};

export const removeArrowStrings = (input: string[]) => {
  return input.filter((str) => str !== "→");
};

export async function writeToFileDEBUG(content: any) {
  try {
    const data = fs.writeFileSync(
      "./test.json",
      JSON.stringify(content, null, 2)
    );
    //file written successfully
  } catch (err) {
    console.error(err);
  }
}
