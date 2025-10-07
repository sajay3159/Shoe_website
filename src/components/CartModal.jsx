import { useEffect, useRef } from "react";
import { Modal, Button, ListGroup, Row, Col } from "react-bootstrap";
import { useShop } from "../store/ShopContext";

const CRUDBASE = "https://crudcrud.com/api/6567584eb09848db9cad2e7f8a5136d5";
const CART_URL = `${CRUDBASE}/cart`;

export default function CartModal() {
  const { cart, total, isCartOpen, setIsCartOpen } = useShop();
  const postedRef = useRef(false);

  useEffect(() => {
    if (!isCartOpen) {
      postedRef.current = false;
      return;
    }

    (async () => {
      try {
        if (!cart.length) {
          // 1) Reload case: fetch latest saved cart from backend
          const res = await fetch(CART_URL);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const docs = await res.json();
          if (Array.isArray(docs) && docs.length) {
            const latest = [...docs].sort(
              (a, b) => new Date(b.openedAt) - new Date(a.openedAt)
            )[0];
          }
        } else if (!postedRef.current) {
          // 2) Normal open: post a one-time snapshot
          postedRef.current = true;
          const res = await fetch(CART_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: cart,
              total,
              openedAt: new Date().toISOString(),
            }),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          await res.json();
        }
      } catch (err) {
        console.error("cart sync error", err);
      }
    })();
  }, [isCartOpen, cart, total]);

  return (
    <Modal show={isCartOpen} onHide={() => setIsCartOpen(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cart</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          {cart.map((it, i) => (
            <ListGroup.Item key={i}>
              <Row>
                <Col>{it.name}</Col>
                <Col xs="auto">{it.size}</Col>
                <Col xs="auto">
                  {it.qty} × {it.price}
                </Col>
                <Col xs="auto" className="fw-semibold">
                  {it.qty * it.price}
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div className="d-flex justify-content-end mt-3">
          <div className="fw-bold">Total {total}</div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setIsCartOpen(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
