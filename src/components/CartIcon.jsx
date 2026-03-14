import { FiShoppingBag } from "react-icons/fi";
import { useCart } from "../context/CartContext";

const CartIcon = ({ onClick }) => {
  const { getCartTotal } = useCart();
  const count = getCartTotal();

  return (
    <button className="cart-icon-btn" onClick={onClick} aria-label="Open cart">
      <FiShoppingBag size={20} />
      {count > 0 && <span className="cart-count">{count}</span>}
    </button>
  );
};

export default CartIcon;
