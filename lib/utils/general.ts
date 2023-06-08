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
