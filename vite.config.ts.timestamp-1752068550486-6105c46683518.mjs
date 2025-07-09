// vite.config.ts
import { defineConfig } from "file:///mnt/c/Users/2supe/All%20Coding/Drel%20Solutions/Drel_Solutions/node_modules/vite/dist/node/index.js";
import react from "file:///mnt/c/Users/2supe/All%20Coding/Drel%20Solutions/Drel_Solutions/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/mnt/c/Users/2supe/All Coding/Drel Solutions/Drel_Solutions";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 6756,
    allowedHosts: ["drelsolutions.com"]
  },
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
    // Exclude Playwright e2e tests from Vitest
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
      "**/tests/e2e/**",
      // Exclude Playwright tests
      "**/e2e/**",
      "**/*.e2e.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"
    ],
    include: [
      "src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "tests/e2e/",
        "**/*.d.ts",
        "**/*.config.*",
        "dist/",
        "build/"
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L2MvVXNlcnMvMnN1cGUvQWxsIENvZGluZy9EcmVsIFNvbHV0aW9ucy9EcmVsX1NvbHV0aW9uc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL21udC9jL1VzZXJzLzJzdXBlL0FsbCBDb2RpbmcvRHJlbCBTb2x1dGlvbnMvRHJlbF9Tb2x1dGlvbnMvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL21udC9jL1VzZXJzLzJzdXBlL0FsbCUyMENvZGluZy9EcmVsJTIwU29sdXRpb25zL0RyZWxfU29sdXRpb25zL3ZpdGUuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3RcIiAvPlxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcclxuICBzZXJ2ZXI6IHtcclxuICAgIGhvc3Q6IFwiOjpcIixcclxuICAgIHBvcnQ6IDY3NTYsXHJcbiAgICBhbGxvd2VkSG9zdHM6IFtcImRyZWxzb2x1dGlvbnMuY29tXCJdLFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHRlc3Q6IHtcclxuICAgIGdsb2JhbHM6IHRydWUsXHJcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcclxuICAgIHNldHVwRmlsZXM6ICcuL3NyYy90ZXN0L3NldHVwLnRzJyxcclxuICAgIGNzczogdHJ1ZSxcclxuICAgIC8vIEV4Y2x1ZGUgUGxheXdyaWdodCBlMmUgdGVzdHMgZnJvbSBWaXRlc3RcclxuICAgIGV4Y2x1ZGU6IFtcclxuICAgICAgJyoqL25vZGVfbW9kdWxlcy8qKicsXHJcbiAgICAgICcqKi9kaXN0LyoqJyxcclxuICAgICAgJyoqL2N5cHJlc3MvKionLFxyXG4gICAgICAnKiovLntpZGVhLGdpdCxjYWNoZSxvdXRwdXQsdGVtcH0vKionLFxyXG4gICAgICAnKiove2thcm1hLHJvbGx1cCx3ZWJwYWNrLHZpdGUsdml0ZXN0LGplc3QsYXZhLGJhYmVsLG55YyxjeXByZXNzLHRzdXAsYnVpbGR9LmNvbmZpZy4qJyxcclxuICAgICAgJyoqL3Rlc3RzL2UyZS8qKicsIC8vIEV4Y2x1ZGUgUGxheXdyaWdodCB0ZXN0c1xyXG4gICAgICAnKiovZTJlLyoqJyxcclxuICAgICAgJyoqLyouZTJlLnt0ZXN0LHNwZWN9LntqcyxtanMsY2pzLHRzLG10cyxjdHMsanN4LHRzeH0nLFxyXG4gICAgXSxcclxuICAgIGluY2x1ZGU6IFtcclxuICAgICAgJ3NyYy8qKi8qLnt0ZXN0LHNwZWN9LntqcyxtanMsY2pzLHRzLG10cyxjdHMsanN4LHRzeH0nLFxyXG4gICAgXSxcclxuICAgIGNvdmVyYWdlOiB7XHJcbiAgICAgIHByb3ZpZGVyOiAndjgnLFxyXG4gICAgICByZXBvcnRlcjogWyd0ZXh0JywgJ2pzb24nLCAnaHRtbCddLFxyXG4gICAgICBleGNsdWRlOiBbXHJcbiAgICAgICAgJ25vZGVfbW9kdWxlcy8nLFxyXG4gICAgICAgICdzcmMvdGVzdC8nLFxyXG4gICAgICAgICd0ZXN0cy9lMmUvJyxcclxuICAgICAgICAnKiovKi5kLnRzJyxcclxuICAgICAgICAnKiovKi5jb25maWcuKicsXHJcbiAgICAgICAgJ2Rpc3QvJyxcclxuICAgICAgICAnYnVpbGQvJ1xyXG4gICAgICBdLFxyXG4gICAgICB0aHJlc2hvbGRzOiB7XHJcbiAgICAgICAgZ2xvYmFsOiB7XHJcbiAgICAgICAgICBicmFuY2hlczogODAsXHJcbiAgICAgICAgICBmdW5jdGlvbnM6IDgwLFxyXG4gICAgICAgICAgbGluZXM6IDgwLFxyXG4gICAgICAgICAgc3RhdGVtZW50czogODBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG59KSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBSGpCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sY0FBYyxDQUFDLG1CQUFtQjtBQUFBLEVBQ3BDO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsWUFBWTtBQUFBLElBQ1osS0FBSztBQUFBO0FBQUEsSUFFTCxTQUFTO0FBQUEsTUFDUDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUE7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQO0FBQUEsSUFDRjtBQUFBLElBQ0EsVUFBVTtBQUFBLE1BQ1IsVUFBVTtBQUFBLE1BQ1YsVUFBVSxDQUFDLFFBQVEsUUFBUSxNQUFNO0FBQUEsTUFDakMsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxZQUFZO0FBQUEsUUFDVixRQUFRO0FBQUEsVUFDTixVQUFVO0FBQUEsVUFDVixXQUFXO0FBQUEsVUFDWCxPQUFPO0FBQUEsVUFDUCxZQUFZO0FBQUEsUUFDZDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
