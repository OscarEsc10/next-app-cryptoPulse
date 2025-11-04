import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const base = "src";

const structure = {
  components: {
    ui: {
      "Button.tsx": "",
      "Card.tsx": "",
      "Loader.tsx": "",
    },
    layout: {
      "Navbar.tsx": "",
      "Sidebar.tsx": "",
      "Footer.tsx": "",
      "Header.tsx": "",
    },
    crypto: {
      "CoinList.tsx": "",
      "CoinChart.tsx": "",
      "CoinDetails.tsx": "",
    },
  },
  lib: {
    "coingecko.ts": "",
    "formatters.ts": "",
    "constants.ts": "",
  },
  hooks: {
    "useFetch.ts": "",
    "useCoinData.ts": "",
    "useTheme.ts": "",
  },
  types: {
    "coin.ts": "",
    "api.ts": "",
  },
  styles: {
    "theme.css": "",
    "variables.css": "",
  },
  utils: {
    "helpers.ts": "",
  },
  app: {
    "(routes)": {
      dashboard: {
        "page.tsx": "",
        components: {},
      },
      coin: {
        "[id]": {
          "page.tsx": "",
        },
      },
    },
  },
};

// Helper
function createStructure(basePath, obj) {
  for (const [key, value] of Object.entries(obj)) {
    const target = join(basePath, key);
    if (typeof value === "object") {
      mkdirSync(target, { recursive: true });
      createStructure(target, value);
    } else {
      if (!existsSync(target)) {
        writeFileSync(target, value);
        console.log(`🟢 Archivo creado: ${target}`);
      } else {
        console.log(`⚪ Ya existe: ${target}`);
      }
    }
  }
}

mkdirSync(base, { recursive: true });
createStructure(base, structure);

console.log("\n Structure created success");
