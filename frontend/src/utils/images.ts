/**
 * Deterministic string hash → consistent Unsplash image per filename.
 * Same filename always maps to the same photo across renders/sessions.
 */
function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

// Curated Unsplash photo IDs — travel / adventure / experience themed
const EXPERIENCE_PHOTOS = [
  "1506905591-40d9-40c7-aba0-5f9f15a5e7d1", // mountain trail
  "1476514525-5fd9f01f2be4",                 // aerial lake
  "1469854523086-cc02fe5d8800",              // road through mountains
  "1528360983277-13d401cdc186",              // kayaking
  "1414235077428-338989a2e8c0",              // food plating
  "1513635269975-59663e0ac1ad",              // art gallery
  "1534438327276-14e5300c3a48",              // outdoor yoga/fitness
  "1452860606245-08befc0ff44b",              // craft workshop
  "1448375240586-882707db888b",              // forest path
  "1507525428034-b723cf961d3e",              // beach at sunrise
  "1519904981063-b0cf448d9b0b",              // rock climbing
  "1510812431401-41d2bd2722f3",              // wine tasting
  "1466637574441-749b8f19452f",              // cooking class
  "1555400038-63f5ba517a47",                 // night market
  "1480714378408-67cf0d13bc1b",              // city rooftop
  "1551632811-561732d1e306",                 // mountain summit
  "1530521954074-e0a103ceff39",              // tropical paradise
  "1500534314209-a25ddb2bd429",              // forest waterfall
  "1464822759023-fed622ff2c3b",              // desert dunes
  "1544551763-46457f85ca69",                 // scuba / coral reef
];

// Unsplash face / portrait photos for user avatars
const USER_PHOTOS = [
  "1494790108377-be9c29b29330", // woman portrait
  "1500648767791-00dcc994a43e", // man portrait
  "1438761681033-6461ffad8d80", // woman smiling
  "1472099645785-5658abf4ff4e", // man outdoor
  "1544005313-94ddf0286df2",    // woman laughing
  "1507003211169-0a1dd7228f2d", // man serious
  "1531746020798-e6953c6e8e04", // woman travel
  "1522075469751-3a6694fb2f61", // man casual
  "1542206395-9eb29e1b69a4",    // woman outdoor
  "1570295999919-56ceb5ecca61", // man happy
  "1539571696357-5a69c17a67c6", // woman glasses
  "1519345182560-3f2917c472ef", // man glasses
  "1488426862026-3ee34a7d66df", // woman portrait 2
  "1534528741775-53994a69daeb", // person adventure
];

/**
 * Returns an Unsplash URL for an experience image filename.
 * width  – requested pixel width (default 900)
 */
export function getExperienceImage(
  filename: string,
  width = 900,
  height = 600
): string {
  const idx = hashString(filename) % EXPERIENCE_PHOTOS.length;
  const id = EXPERIENCE_PHOTOS[idx];
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

/**
 * Returns a consistent Unsplash portrait URL for a user photo filename.
 */
export function getUserAvatar(filename: string, size = 150): string {
  const idx = hashString(filename) % USER_PHOTOS.length;
  const id = USER_PHOTOS[idx];
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${size}&h=${size}&q=80`;
}
