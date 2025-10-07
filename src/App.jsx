import { Badge, Button, Container, Navbar } from "react-bootstrap";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import CartModal from "./components/CartModal";
import { useShop } from "./store/ShopContext";

export default function App() {
  const { cart, setIsCartOpen } = useShop();
  const count = cart.reduce((n, it) => n + it.qty, 0);

  const openCart = () => setIsCartOpen(true);
  return (
    <>
      <Navbar
        bg="dark"
        className="text-white px-4 py-3 justify-content-between"
      >
        <Navbar.Brand className="text-white fw-semibold">
          Shoe Store
        </Navbar.Brand>
        <Button
          variant="outline-light"
          onClick={openCart}
          aria-label={`Open cart with ${count} item${count === 1 ? "" : "s"}`}
          title="Open cart"
          className="d-flex align-items-center gap-2"
        >
          <span>Cart</span>
          <Badge bg="primary">{count}</Badge>
        </Button>
      </Navbar>

      <Container className="py-5">
        <ProductForm />
        <ProductList />
      </Container>
      <CartModal />
    </>
  );
}
