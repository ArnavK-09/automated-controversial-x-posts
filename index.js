/*
 * Importing modules
 */
import fs from "fs";
import OpenAI from "openai";

/*
 * Meta values defined as constants
 */
const PROMPT = fs.readFileSync("./prompt.md", "utf-8");
const AI_MODEL = "gemma-7b";
const AI_API_KEY = process.env.AI_API_KEY;
const OAUTH_HEADER = process.env.OAUTH_HEADER;

/**
 * If by any chance anything missing
 */
if (!PROMPT || !AI_API_KEY || !OAUTH_HEADER || !AI_MODEL) {
  console.log("[MISSING] Compulsary meta variables are missing!");
  console.log(
    `Status:-\n\tPROMPT:- ${!!PROMPT}\n\tAI_MODEL:- ${!!AI_MODEL}\n\tAI_API_KEY:- ${!!AI_API_KEY}\n\tOAUTH_HEADER:- ${!!OAUTH_HEADER}`,
  );
  process.exit(1);
}

/**
 * Creating new API Client to acesss AI
 */
const AI_CLIENT = new OpenAI({
  apiKey: AI_API_KEY,
  baseURL: "https://llm.mdb.ai/",
});
console.log("[CLIENT] New AI client initiated with specified token.");

/*
 * Method to post message
 */
const postMessage = async (content) => {
  // Organizing Headers
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", OAUTH_HEADER);

  // Request Body
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      text: content.toString(),
    }),
    redirect: "follow",
  };

  // Posting Data
  fetch("https://api.twitter.com/2/tweets", requestOptions)
    .then((response) => response.text())
    .then((e) =>
      console.log(`[POST] Result during executing "postMessage" func:-\n ${e}`),
    )
    .catch((e) =>
      console.log(
        `[ERROR] An error occured during executing "postMessage" func:-\n ${e}`,
      ),
    );
};

/**
 * Fetched post content with llm
 */
const getPostContent = async () => {
  /**
   * Fetching completion
   */
  const chatCompletion = await AI_CLIENT.chat.completions.create({
    messages: [{ role: "user", content: PROMPT }],
    model: AI_MODEL,
  });
  const content = chatCompletion.choices[0]?.message?.content ?? "";
  console.log(
    `[LLM] Contacted LLM to get content and resulted with:- ${content}`,
  );
  return content;
};

/**
 * Running main logic
 */
(async () => {
  /**
   * Fetching content from llm
   */
  const contentToBePosted = await getPostContent().catch((e) =>
    console.log(
      `[ERROR] An error occured during executing "getPostContent" method:-\n ${e.message}`,
    ),
  );

  /**
   * Validation
   */
  if (contentToBePosted?.toString().trim().length == 0) return;

  /**
   * Posting resulted content to X
   */
  await postMessage(contentToBePosted).catch((e) =>
    console.log(
      `[ERROR] An error occured during executing "postMessage" func:-\n ${e}`,
    ),
  );
})();
