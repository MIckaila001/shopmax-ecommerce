import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddToCart } from "@/components/product/add-to-cart";

const mockProduct = {
  id: 1,
  name: "iPhone 15 Pro 128 Go",
  price: 1499000,
  image: "https://example.com/iphone.jpg",
};

describe("AddToCart component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("affiche le bouton Ajouter au panier", () => {
    render(<AddToCart product={mockProduct} />);
    expect(screen.getByText(/ajouter au panier/i)).toBeInTheDocument();
  });

  it("affiche le bouton Acheter maintenant", () => {
    render(<AddToCart product={mockProduct} />);
    expect(screen.getByText(/acheter maintenant/i)).toBeInTheDocument();
  });

  it("commence avec une quantité de 1", () => {
    render(<AddToCart product={mockProduct} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("incrémente la quantité au clic sur +", async () => {
    const user = userEvent.setup();
    render(<AddToCart product={mockProduct} />);

    const incrementBtn = screen.getByLabelText("Augmenter la quantité");
    await user.click(incrementBtn);

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("décrémente la quantité au clic sur -", async () => {
    const user = userEvent.setup();
    render(<AddToCart product={mockProduct} />);

    const incrementBtn = screen.getByLabelText("Augmenter la quantité");
    const decrementBtn = screen.getByLabelText("Diminuer la quantité");

    await user.click(incrementBtn);
    await user.click(incrementBtn);
    await user.click(decrementBtn);

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("ne descend pas en dessous de 1", async () => {
    const user = userEvent.setup();
    render(<AddToCart product={mockProduct} />);

    const decrementBtn = screen.getByLabelText("Diminuer la quantité");
    await user.click(decrementBtn);

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("désactive le bouton - quand la quantité est 1", () => {
    render(<AddToCart product={mockProduct} />);
    const decrementBtn = screen.getByLabelText("Diminuer la quantité");
    expect(decrementBtn).toBeDisabled();
  });

  it("affiche le prix total quand quantité > 1", async () => {
    const user = userEvent.setup();
    render(<AddToCart product={mockProduct} />);

    const incrementBtn = screen.getByLabelText("Augmenter la quantité");
    await user.click(incrementBtn);

    expect(screen.getByText(/total/i)).toBeInTheDocument();
  });

  it("ajoute le produit au panier au clic", async () => {
    const user = userEvent.setup();
    render(<AddToCart product={mockProduct} />);

    const addBtn = screen.getByText(/ajouter au panier/i);
    await user.click(addBtn);

    const stored = localStorage.getItem("shopmax_cart");
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].id).toBe(1);
  });
});
