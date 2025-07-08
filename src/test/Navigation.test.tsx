import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navigation from "@/components/ui/Navigation";
import { describe, it, expect } from "vitest";

describe("Navigation component", () => {
  it("renders all primary links", () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /blog/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /let's talk/i })).toBeInTheDocument();
  });

  it("Blog link has correct external attributes", () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );
    const blogLink = screen.getByRole("link", { name: /blog/i });
    expect(blogLink).toHaveAttribute("href", "https://drelsolutions.substack.com/");
    expect(blogLink).toHaveAttribute("target", "_blank");
    expect(blogLink).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(blogLink).toHaveAttribute("rel", expect.stringContaining("noreferrer"));
  });

  it("has a navigation role and label", () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );
    const nav = screen.getByRole("navigation", { name: /main navigation/i });
    expect(nav).toBeInTheDocument();
  });

  it("toggles mobile menu when menu button is clicked", async () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );
    // Find the mobile menu button by its aria-label
    const menuButton = screen.getByRole("button", { name: /toggle menu/i });
    expect(menuButton).toBeInTheDocument();
    
    // Menu should not be open initially
    expect(screen.queryByText(/model advisor/i)).not.toBeInTheDocument();
    
    // Open menu
    fireEvent.click(menuButton);

    // Wait for the menu to appear
    await waitFor(() => {
      expect(screen.getByText(/model advisor/i)).toBeInTheDocument();
    });

    // Close menu
    fireEvent.click(menuButton);
    
    // Wait for the menu to disappear
    await waitFor(() => {
      expect(screen.queryByText(/model advisor/i)).not.toBeInTheDocument();
    });
  });
});