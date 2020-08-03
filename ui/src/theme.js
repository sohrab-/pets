import { deep } from "@theme-ui/presets";
// This is the recommended way to extend themes before you flame me.
import { merge } from "theme-ui";

export default merge(deep, {
  colors: {
    visualisations: ["#003f5c", "#58508d", "#bc5090", "#ff6361", "#ffa601"],
  },
  cards: {
    primary: {
      bg: "muted",
      p: [2, 2, 2, 3],
      position: "relative",
    },
  },
  forms: {
    select: {
      fontSize: "12px",
      fontWeight: "bold",
      p: 1,
    },
  },
  buttons: {
    primary: {
      bg: "muted",
    },
  },
  alerts: {
    error: {
      bg: "#E96245",
    },
  },
});
