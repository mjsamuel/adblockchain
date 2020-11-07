export const FILTERS = [
  "*://*.doubleclick.net/*",
  "*://partner.googleadservices.com/*",
  "*://*.googleadservices.com/*",
  "*://*.googlesyndication.com/*",
  "*://*.google-analytics.com/*",
  "*://creative.ak.fbcdn.net/*",
  "*://*.adbrite.com/*",
  "*://*.exponential.com/*",
  "*://*.quantserve.com/*",
  "*://*.scorecardresearch.com/*",
  "*://*.zedo.com/*",
  "*://mrjb7hvcks.com/*",
  "*://mr2cnjuh34jb.com/*",
  "*://track.wg-aff.com/*",
  "*://meowpushnot.com/*"
]

/**
 * Named callback function for adblocker that returns a blocking response (used 
 * to determine the lifecycle of the request)
 * Returns true meaning that the request is cancelled
 * @param {*} details: an object that contains info for the current callback request
 */
export async function adblock_callback(details) {
  console.log("Blocking: " + details.url);
  return { cancel: true };
}

