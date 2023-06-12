import Vue from "vue";
import VueI18n, { LocaleMessages } from "vue-i18n";
import enLocale from "element-ui/lib/locale/lang/en";
import zhLocale from "element-ui/lib/locale/lang/zh-CN";

Vue.use(VueI18n);

function loadLocaleMessages(): LocaleMessages {
  const locales = require.context(
    "../locales",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const messages: LocaleMessages = {};
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      const msg = locales(key);

      // add element support
      const msgWithElemnt = addElementLocale(msg, locale);
      messages[locale] = msgWithElemnt;
    }
  });
  return messages;
}

function addElementLocale(origin: any, locale: string) {
  if (locale === "en") {
    return Object.assign(origin, enLocale);
  }

  if (locale === "zh-cn") {
    return Object.assign(origin, zhLocale);
  }

  return origin;
}

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || "en",
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
  messages: loadLocaleMessages()
});
