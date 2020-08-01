import { deep } from "@theme-ui/presets";
// This is the recommended way to extend themes before you flame me.
import { merge } from "theme-ui";

export default merge(deep, {
  colors: {
    visualisations: ["#003f5c", "#58508d", "#bc5090", "#ff6361", " #ffa600"],
  },
});
