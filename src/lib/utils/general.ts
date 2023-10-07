export function getCurrentTimestamp() {
  const now = new Date();

  // Get the date components
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  // Get the time components
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

  // Get the time zone offset
  const offsetHours = String(Math.floor(now.getTimezoneOffset() / 60)).padStart(
    2,
    "0"
  );
  const offsetMinutes = String(Math.abs(now.getTimezoneOffset() % 60)).padStart(
    2,
    "0"
  );
  const offsetSign = now.getTimezoneOffset() > 0 ? "-" : "+";

  // Construct the timestamp string
  const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}${offsetSign}${offsetHours}:${offsetMinutes}`;

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
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "http://" + url;
  }
  return url;
}
