export function getCurrentTimestamp() {
  const now = new Date();

  // Convert to UTC
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");
  const seconds = String(now.getUTCSeconds()).padStart(2, "0");
  const milliseconds = String(now.getUTCMilliseconds()).padStart(3, "0");

  // Construct the UTC timestamp string
  const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}Z`; // 'Z' denotes UTC

  return timestamp;
}

export const dateDiff = (compDate: string) => {
  const parsedCompDate = new Date(Date.parse(compDate));
  const now = new Date();
  const diffInMS = now.getTime() - parsedCompDate.getTime();
  const diffHours = Math.floor(diffInMS / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  return { diffHours, diffDays };
};

export function cleanURL(url: string) {
  return url.replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/$/, "");
}

export function addProtocolToURL(url: string) {
  try {
    let newURL = url.trim();
    if (!newURL) {
      return "";
    }
    if (!newURL.startsWith("http://") && !newURL.startsWith("https://")) {
      newURL = "http://" + newURL;
    }
    return new URL(newURL).toString();
  } catch {
    return "";
  }
}

export function isValidUUID(uuid: string): boolean {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}
