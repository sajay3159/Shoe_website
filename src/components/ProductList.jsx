import { useEffect } from "react";
import { Button, Card, Row, Col, Badge } from "react-bootstrap";
import { useShop } from "../store/ShopContext";

const CRUD_BASE = "https://crudcrud.com/api/6567584eb09848db9cad2e7f8a5136d5";
const PRODUCTS_URL = `${CRUD_BASE}/products`;
const CART_URL = `${CRUD_BASE}/cart`;

export default function ProductList() {
  const { products, addToCart, addLocalProduct } = useShop();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(PRODUCTS_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const list = await res.json();
        list.forEach(addLocalProduct);
      } catch (err) {
        console.error("load products error", err);
      }
    })();
  }, []);

  const buy = async (p, size) => {
    const line = {
      id: p._id || p.id || p.name,
      name: p.name,
      price: p.price,
      size,
      qty: 1,
    };
    addToCart(line); // local UI update

    try {
      const res = await fetch(CART_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...line, addedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await res.json(); // CrudCrud returns created doc with _id
    } catch (err) {
      console.error("cart save error", err);
    }
  };

  return (
    <div className="p-3 border rounded mb-3">
      {products.map((p, idx) => (
        <Card key={p._id || idx} className="mb-3">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={4}>
                <div className="fw-semibold">{p.name}</div>
                <div className="text-muted small">{p.description}</div>
              </Col>
              <Col md={2} className="text-muted">
                100% cotton
              </Col>
              <Col md={2} className="fw-semibold">
                {p.price}
              </Col>
              <Col md={4} className="d-flex gap-2 justify-content-md-end">
                <Button size="sm" onClick={() => buy(p, "L")}>
                  Buy Large <Badge bg="secondary">{p.sizes?.L ?? 0}</Badge>
                </Button>
                <Button size="sm" onClick={() => buy(p, "M")}>
                  Buy Medium <Badge bg="secondary">{p.sizes?.M ?? 0}</Badge>
                </Button>
                <Button size="sm" onClick={() => buy(p, "S")}>
                  Buy Small <Badge bg="secondary">{p.sizes?.S ?? 0}</Badge>
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
