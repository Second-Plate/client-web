import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import InvitationCode from "./InvitationCode";

describe("InvitationCode", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("submits automatically after six characters and navigates to receipt confirm", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          isValid: true,
          settlementId: "1",
          settlementTitle: "테스트 정산",
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          participantId: "10",
          settlementId: "1",
          role: "MEMBER",
          joinTime: "2025-01-01T00:00:00",
        }),
      });

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/invitationcode"]}>
        <Routes>
          <Route path="/invitationcode" element={<InvitationCode />} />
          <Route path="/receiptconfirm" element={<div>receipt-confirm-page</div>} />
        </Routes>
      </MemoryRouter>
    );

    const inputs = screen.getAllByRole("textbox");
    const values = ["A", "B", "C", "1", "2", "3"];

    for (const [index, value] of values.entries()) {
      await user.type(inputs[index], value);
    }

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "/api/invitation/verify?code=ABC123",
      expect.objectContaining({
        method: "GET",
      })
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/invitation/join",
      expect.objectContaining({
        method: "POST",
      })
    );

    expect(await screen.findByText("receipt-confirm-page")).toBeInTheDocument();
  });
});
