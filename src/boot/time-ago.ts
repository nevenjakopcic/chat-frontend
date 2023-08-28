import { boot } from "quasar/wrappers";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

export default boot(() => {
    TimeAgo.addDefaultLocale(en);
});
