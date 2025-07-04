import React from "react";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import App from "@/App";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock window.location.replace
const replaceSpy = vi.fn();

describe("/blog route", () => {
  beforeEach(() => {
    replaceSpy.mockReset();
    vi.spyOn(window.location, "replace").mockImplementation(replaceSpy as any);
  });

  it("calls window.location.replace with Substack URL", async () => {
    window.history.pushState({}, "", "/blog");
    render(<App />);

    await waitFor(() => {
      expect(replaceSpy).toHaveBeenCalledWith("https://drelsolutions.substack.com/");
    });
  });
});