/*
 * Importing modules
 */
const { TwitterApi: X_API } = require("twitter-api-v2");

/*
 * Meta values defined as constants
 */
const X_TOKEN = "todo";

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
  const content = "";
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
      `[ERROR] An error occured during executing "getPostContent" method:-\n ${e}`,
    ),
  );

  /**
   * Validation
   */
  if (contentToBePosted.toString().trim().length == 0) return;

  /**
   * Posting resulted content to X
   */
  await postMessage(contentToBePosted).catch((e) =>
    console.log(
      `[ERROR] An error occured during executing "postMessage" method:-\n ${e}`,
    ),
  );
})();
