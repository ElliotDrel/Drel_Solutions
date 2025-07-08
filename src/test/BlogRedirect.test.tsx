import React from "react";
import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ExternalRedirect } from "@/App"; // Assuming ExternalRedirect is exported from App.tsx

describe("ExternalRedirect component", () => {
  it("calls the redirector with the correct URL", async () => {
    const replaceSpy = vi.fn();
    const url = "https://drelsolutions.substack.com/";
    
    render(<ExternalRedirect to={url} redirector={replaceSpy} />);

    await waitFor(() => {
      expect(replaceSpy).toHaveBeenCalledWith(url);
    });
  });
});