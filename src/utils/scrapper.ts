import fetch from "node-fetch";
import * as cheerio from "cheerio";

const fetchHtml = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const text = await response.text();
    return text;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching html");
  }
};

type Response = {
  jobDescription: string;
};

export const scrapper = async (url: string): Promise<Response> => {
  try {
    const html = await fetchHtml(url);
    if (html) {
      const $ = cheerio.load(html);
      $(".jp-sidebar-primary-btn").remove();
      $(".jp-footer-primary-btn").remove();
      $(".jp-view-jobs-btn-sml").remove();
      let description = $(".jp-view").text();
      description = description.replace(/\n/g, "");
      description = description.replace(/ {2,}/g, "\n");

      return {
        jobDescription: description,
      };
    } else {
      throw new Error("No html found");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error scrapping");
  }
};
