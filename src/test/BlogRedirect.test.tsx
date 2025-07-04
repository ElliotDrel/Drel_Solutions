import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import App from "@/App";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock window.location.replace
const replaceSpy = vi.fn();

describe("/blog route", () => {
  beforeEach(() => {
    replaceSpy.mockReset();
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { replace: replaceSpy };
  });

  it("calls window.location.replace with Substack URL", () => {
    window.history.pushState({}, "", "/blog");
    render(<App />);

    expect(replaceSpy).toHaveBeenCalledWith("https://drelsolutions.substack.com/");
  });
});