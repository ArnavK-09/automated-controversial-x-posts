/*
 * Importing modules
 */
const fs = require("fs");
const OpenAI = require("openai");
const { TwitterApi: X_API } = require("twitter-api-v2");

/*
 * Meta values defined as constants
 */
const X_TOKEN = process.env.X_API_KEY;
const AI_API_KEY = process.env.AI_API_KEY;
const PROMPT = fs.readFileSync("./prompt.md", "utf-8");

/**
 * Creating new API Client to acesss AI
 */
const AI_CLIENT = new OpenAI({
  apiKey: AI_API_KEY,
  baseURL: "https://llm.mdb.ai/",
});
console.log("[CLIENT] New AI client initiated with specified token.");

/*
 * New X client initialize
 */
const X_CLIENT = new X_API(X_TOKEN);
console.log("[CLIENT] New X client initiated with specified token.");

/*
 * Usable api client
 */
const X_CLIENT_READONLY = X_CLIENT.readOnly;

/*
 * Method to post message
 */
const postMessage = async (content) => {
  await X_CLIENT_READONLY.v2.tweet(content.toString().trim());
  console.log(
    `[NEW MESSAGE] New message posted from X Account with content \` ${content.toString().trim()}\` at time ${new Date()}.`,
  );
};

/**
 * Fetched post content with llm
 */
const getPostContent = async () => {
  /**
   * If by any chance
   */
  if (!PROMPT) {
    console.log("[FILESYSTEM] Isn't able to read prompt from markdown file!");
    return "";
  }

  /**
   * Fetching completion
   */
  const chatCompletion = await AI_CLIENT.chat.completions.create({
    messages: [{ role: "user", content: PROMPT }],
    model: "mixtral-8x7b",
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
      `[ERROR] An error occured during executing "postMessage" method:-\n ${e.message}`,
    ),
  );
})();
