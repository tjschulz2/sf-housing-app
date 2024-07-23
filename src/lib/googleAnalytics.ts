import ReactGA from "react-ga4";

export const GTM_ID = "GTM-KBH5Q942";

ReactGA.initialize(GTM_ID);

export function reportContactEvent(
  action: "Email" | "SMS" | "Twitter",
  initiator: string,
  recipient: string
) {
  console.log("reportContactEvent", action, initiator, recipient);
  ReactGA.event({
    category: "Contact",
    action,
    label: `${initiator} --> ${recipient}`,
  });
}
