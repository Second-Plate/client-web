import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import Router from "./Router";

describe("Router", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
  });

  it("redirects root path to /login", async () => {
    window.history.pushState({}, "", "/");
    render(<Router />);

    expect(await screen.findByText("구글 계정으로 계속하기")).toBeInTheDocument();
  });

  it("redirects unknown path to /login", async () => {
    window.history.pushState({}, "", "/not-found");
    render(<Router />);

    expect(await screen.findByText("구글 계정으로 계속하기")).toBeInTheDocument();
  });
});
