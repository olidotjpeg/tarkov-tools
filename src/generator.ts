import axios, { AxiosError, AxiosResponse } from "axios";
import dotenv from "dotenv";
import { API_URL } from "./constants";
import { default as data } from "./test.json";

dotenv.config({ path: "../.env" });

let token = "";

async function getToken() {
  return axios
    .get(`${API_URL}/token`)
    .then(function (response: AxiosResponse<any>) {
      token = response.data;
      return response;
    })
    .catch(function (error: AxiosError) {
      console.log(error);
    });
}

async function generateTraders() {
  return data.map((trader) => {
    APIClient(`${API_URL}/trader/create`, {
      name: trader.trader,
      asset_url: "https://via.placeholder.com/500",
    });
  });
}

async function generateBarters() {
  return data.map((trader) => {
    trader.barters.map((barter) => {
      APIClient(`${API_URL}/barter/create`, {
        name: barter.lines[2],
        lines: JSON.stringify(barter.lines),
        images: JSON.stringify(barter.images),
        trader_name: trader.trader,
      }).then((res) => console.log(res));
    });
  });
}

getToken().then(async () => {
  await generateTraders();
  await generateBarters();
});

function APIClient(url: string, data: any) {
  return axios
    .post(url, data, {
      headers: {
        "X-CSRF-TOKEN": token,
      },
    })
    .then((res) => res)
    .catch((error) => error);
}
