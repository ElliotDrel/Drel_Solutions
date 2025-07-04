import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Layout from "@/components/Layout";
import { describe, it, expect } from "vitest";

const Dummy = () => <div data-testid="dummy">Content</div>;

describe("Layout wrapper", () => {
  it("renders Navigation and child content", () => {
    render(
      <MemoryRouter>
        <Layout>
          <Dummy />
        </Layout>
      </MemoryRouter>
    );

    // Navigation brand should be in the document
    expect(screen.getByText(/drel solutions/i)).toBeInTheDocument();
    // Child content should render
    expect(screen.getByTestId("dummy")).toBeInTheDocument();
  });
});