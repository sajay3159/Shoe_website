import { createContext, useContext, useState, useMemo, useEffect } from "react";

const CRUDBASE = "https://crudcrud.com/api/6567584eb09848db9cad2e7f8a5136d5";
const CART_URL = `${CRUDBASE}/cart`;

const ShopContext = createContext(null);

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Total amount
  const total = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.qty, 0),
    [cart]
  );

  //   const replaceCart = useCallback((items) => {
  //     setCart(Array.isArray(items) ? items : []);
  //   }, []);

  const addLocalProduct = (p) => setProducts((prev) => [...prev, p]);

  const addToCart = (item) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (x) => x.id === item.id && x.size === item.size
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  //  Fetch cart from API on first load
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(CART_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (data.length > 0) {
          const latest = data[data.length - 1];
          if (latest.items) setCart(latest.items);
        }
      } catch (err) {
        console.error("Error fetching cart from API:", err);
      }
    })();
  }, []);

  return (
    <ShopContext.Provider
      value={{
        products,
        addLocalProduct,
        cart,
        addToCart,
        total,
        isCartOpen,
        setIsCartOpen,
        // replaceCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
