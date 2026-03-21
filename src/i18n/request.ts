import { getRequestConfig } from "next-intl/server";
import { routing } from "../routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that the incoming locale is valid
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  let messages;
  switch (locale) {
    case 'en':
      messages = (await import('../../messages/en.json')).default;
      break;
    case 'es':
    default:
      messages = (await import('../../messages/es.json')).default;
      break;
  }

  return {
    locale,
    messages,
  };
});
