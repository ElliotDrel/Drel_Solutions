import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ExternalRedirect } from "@/App";

describe("ExternalRedirect component", () => {
  it("calls the redirector with the correct URL", async () => {
    const replaceSpy = vi.fn();
    const url = "https://drelsolutions.substack.com/";
    
    render(<ExternalRedirect to={url} redirector={replaceSpy} />);

    await waitFor(() => {
      expect(replaceSpy).toHaveBeenCalledWith(url);
    });
  });

  it("shows loading screen initially", () => {
    const replaceSpy = vi.fn();
    const url = "https://drelsolutions.substack.com/";
    
    render(<ExternalRedirect to={url} redirector={replaceSpy} />);

    expect(screen.getByText("Redirecting to external site...")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("handles redirect errors gracefully", async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const failingRedirector = vi.fn(() => {
      throw new Error("Redirect failed");
    });
    const url = "https://drelsolutions.substack.com/";
    
    render(<ExternalRedirect to={url} redirector={failingRedirector} />);

    // Should hide loading screen immediately on error
    await waitFor(() => {
      expect(screen.queryByText("Redirecting to external site...")).not.toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith("Redirect failed:", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("uses default redirector when none provided", async () => {
    const url = "https://drelsolutions.substack.com/";
    
    // Mock window.location.replace
    const originalReplace = window.location.replace;
    const replaceMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { replace: replaceMock },
      writable: true,
    });
    
    render(<ExternalRedirect to={url} />);

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith(url);
    });

    // Restore original
    Object.defineProperty(window, 'location', {
      value: { replace: originalReplace },
      writable: true,
    });
  });

  it("provides fallback link for manual redirect", () => {
    const replaceSpy = vi.fn();
    const url = "https://drelsolutions.substack.com/";
    
    render(<ExternalRedirect to={url} redirector={replaceSpy} />);

    const fallbackLink = screen.getByText("click here");
    expect(fallbackLink).toBeInTheDocument();
    expect(fallbackLink.closest('a')).toHaveAttribute('href', url);
  });
});