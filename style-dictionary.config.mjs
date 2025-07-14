export default {
  source: ["tokens/colors.json"],
  format: {
    'tailwind/semantic-colors': function({ dictionary }) {
      const colors = {};
      
      dictionary.allTokens.forEach(token => {
        if (token.path[0] === 'brand') {
          const semanticName = token.path.slice(1).join('-');
          colors[semanticName] = token.value;
        }
      });
      
      return `export const semanticColors = ${JSON.stringify(colors, null, 2)};`;
    }
  },
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
          destination: "tailwind-colors.js",
          format: "tailwind/semantic-colors"
        }
      ]
    }
  }
};