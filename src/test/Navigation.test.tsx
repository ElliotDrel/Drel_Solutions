import React from "react";
import { render, screen } from "@testing-library/react";
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

  it("toggles mobile menu when menu button is clicked", () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );
    // Mobile menu button is only visible on small screens, so force window width
    window.innerWidth = 500;
    window.dispatchEvent(new Event("resize"));
    const menuButton = screen.getByRole("button", { name: /toggle menu/i });
    expect(menuButton).toBeInTheDocument();
    // Menu should not be open initially
    expect(screen.queryByText(/model advisor/i)).not.toBeVisible();
    // Open menu
    menuButton.click();
    expect(screen.getByText(/model advisor/i)).toBeVisible();
    // Close menu
    menuButton.click();
    expect(screen.queryByText(/model advisor/i)).not.toBeVisible();
  });
});