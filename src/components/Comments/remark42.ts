import { loadScript } from '@nextgis/dom';

export const remarkConfig = {
  host: 'https://remark42.staging.nextgis.com', // hostname of Remark42 server, same as REMARK_URL in backend config, e.g. "https://demo.remark42.com"
  // host: 'http://127.0.0.1:8090',
  site_id: 'pastandnow',
  components: ['embed'], // optional param; which components to load. default to ["embed"]
  // to load all components define components as ['embed', 'last-comments', 'counter']
  // available component are:
  //   - 'embed': basic comments widget
  //   - 'last-comments': last comments widget, see `Last Comments` section below
  //   - 'counter': counter widget, see `Counter` section below
  // url: '', // optional param; if it isn't defined
  // `window.location.origin + window.location.pathname` will be used
  //
  // Note that if you use query parameters as significant part of URL
  // (the one that actually changes content on page)
  // you will have to configure URL manually to keep query params, as
  // `window.location.origin + window.location.pathname` doesn't contain query params and
  // hash. For example, default URL for `https://example/com/example-post?id=1#hash`
  // would be `https://example/com/example-post`
  //
  // The problem with query params is that they often contain useless params added by
  // various trackers (utm params) and doesn't have defined order, so Remark42 treats differently
  // all this examples:
  // https://example.com/?postid=1&date=2007-02-11
  // https://example.com/?date=2007-02-11&postid=1
  // https://example.com/?date=2007-02-11&postid=1&utm_source=google
  //
  // If you deal with query parameters make sure you pass only significant part of it
  // in well defined order
  max_shown_comments: 10, // optional param; if it isn't defined default value (15) will be used
  theme: 'light', // optional param; if it isn't defined default value ('light') will be used
  page_title: '', // optional param; if it isn't defined `document.title` will be used
  locale: 'ru', // set up locale and language, if it isn't defined default value ('en') will be used
  show_email_subscription: true, // optional param; by default it is `true` and you can see email subscription feature
  // in interface when enable it from backend side
  // if you set this param in `false` you will get notifications email notifications as admin
  // but your users won't have interface for subscription
  simple_view: true, // optional param; overrides the parameter from the backend
  // minimized UI with basic info only
};

export function initRemark42(
  config_: Partial<typeof remarkConfig> = {},
): Promise<unknown[]> {
  const config = { ...remarkConfig, ...config_ };
  // @ts-ignore
  window.remark_config = config;
  const promises = config.components.map((c) => {
    const url = config.host + '/web/' + c + '.js';
    return loadScript(url, { defer: true });
  });
  return Promise.all(promises);
}
