import { useState } from "react";
import { Form, Row, Col, Button, InputGroup } from "react-bootstrap";
import { useShop } from "../store/ShopContext";

const CRUD_BASE = "https://crudcrud.com/api/6567584eb09848db9cad2e7f8a5136d5";
const PRODUCTS_URL = `${CRUD_BASE}/products`;

export default function ProductForm() {
  const { addLocalProduct } = useShop();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    l: 0,
    m: 0,
    s: 0,
  });

  const [errors, setErrors] = useState({});

  const onChange = (e) =>
    setForm((f) => ({
      ...f,
      [e.target.name]:
        e.target.type === "number"
          ? Number(e.target.value || 0)
          : e.target.value,
    }));

  const validateForm = () => {
    let newErrors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (!form.price || form.price <= 0)
      newErrors.price = "Price must be greater than 0";

    const sizeTotal = form.l + form.m + form.s;
    if (sizeTotal <= 0)
      newErrors.size = "Add at least one item (L / M / S quantity)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        sizes: { L: form.l, M: form.m, S: form.s },
      };

      const res = await fetch(PRODUCTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      addLocalProduct({ ...data });
      setForm({ name: "", description: "", price: "", l: 0, m: 0, s: 0 });
      setErrors({});
    } catch (err) {
      console.error("add product error", err);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3 border rounded mb-3 bg-light">
      <Row className="g-3 align-items-end">
        <Col md>
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            name="name"
            value={form.name}
            onChange={onChange}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
        </Col>

        <Col md>
          <Form.Label>Description</Form.Label>
          <Form.Control
            name="description"
            value={form.description}
            onChange={onChange}
            isInvalid={!!errors.description}
          />
          <Form.Control.Feedback type="invalid">
            {errors.description}
          </Form.Control.Feedback>
        </Col>

        <Col md>
          <Form.Label>Price</Form.Label>
          <InputGroup>
            <InputGroup.Text>₹</InputGroup.Text>
            <Form.Control
              name="price"
              type="number"
              value={form.price}
              onChange={onChange}
              isInvalid={!!errors.price}
            />
            <Form.Control.Feedback type="invalid">
              {errors.price}
            </Form.Control.Feedback>
          </InputGroup>
        </Col>

        <Col xs="auto">
          <Form.Label>L</Form.Label>
          <Form.Control
            name="l"
            type="number"
            value={form.l}
            onChange={onChange}
            min={0}
          />
        </Col>
        <Col xs="auto">
          <Form.Label>M</Form.Label>
          <Form.Control
            name="m"
            type="number"
            value={form.m}
            onChange={onChange}
            min={0}
          />
        </Col>
        <Col xs="auto">
          <Form.Label>S</Form.Label>
          <Form.Control
            name="s"
            type="number"
            value={form.s}
            onChange={onChange}
            min={0}
          />
        </Col>

        <Col xs="auto">
          <Button type="submit">Add Product</Button>
        </Col>
      </Row>

      {errors.size && <div className="text-danger mt-2">{errors.size}</div>}
    </Form>
  );
}
