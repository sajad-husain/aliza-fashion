import { createContext, useContext, useReducer, useEffect } from "react";

const WishlistContext = createContext();

const loadWishlistFromStorage = () => {
  try {
    const saved = localStorage.getItem("aliza-wishlist");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveWishlistToStorage = (wishlist) => {
  try {
    localStorage.setItem("aliza-wishlist", JSON.stringify(wishlist));
  } catch (e) {
    console.error("Failed to save wishlist:", e);
  }
};

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      if (state.some((item) => item.id === action.payload.id)) {
        return state;
      }
      return [...state, action.payload];
    }
    case "REMOVE_ITEM":
      return state.filter((item) => item.id !== action.payload);
    case "TOGGLE_ITEM": {
      const exists = state.some((item) => item.id === action.payload.id);
      if (exists) {
        return state.filter((item) => item.id !== action.payload.id);
      }
      return [...state, action.payload];
    }
    case "CLEAR_WISHLIST":
      return [];
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, dispatch] = useReducer(wishlistReducer, [], loadWishlistFromStorage);

  useEffect(() => {
    saveWishlistToStorage(wishlist);
  }, [wishlist]);

  const addItem = (product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  };

  const removeItem = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const toggleItem = (product) => {
    dispatch({ type: "TOGGLE_ITEM", payload: product });
  };

  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" });
  };

  const isInWishlist = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  const getWishlistTotal = () => {
    return wishlist.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addItem,
        removeItem,
        toggleItem,
        clearWishlist,
        isInWishlist,
        getWishlistTotal,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
