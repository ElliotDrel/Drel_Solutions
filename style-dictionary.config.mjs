export default {
  source: ["tokens/colors.json"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "src/styles/",
      files: [
        {
          destination: "theme.css",
          format: "css/variables",
          selector: ":root"
        }
      ]
    },
    tailwind: {
      transformGroup: "js",
      buildPath: "build/",
      files: [
        {
          destination: "tokens.js",
          format: "javascript/es6"
        }
      ]
    }
  }
};