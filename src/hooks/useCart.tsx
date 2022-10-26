import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const { data } = await api.get(`products/${productId}`);
      const product = data as Product;
      const existProductInCart = cart.find(product => product.id === productId);
      if (existProductInCart) {
        await updateProductAmount({productId, amount: existProductInCart.amount + 1});
        return;
      } else {
        product.amount = 1;
        setCart([...cart, product]);
      }
      localStorage.setItem('@RocketShoes:cart', JSON.stringify([...cart, product]));
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const existProduct = cart.find(product => product.id === productId);
      if (!existProduct) {
        throw new Error();
      }
      const removeCart: Product[] = [];
      const removeFromCart = cart.reduce((prevProduct, product) => {
        if (product.id !== productId) {
          prevProduct.push(product);
        }
        return prevProduct;
      }, removeCart)
      setCart(removeFromCart);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(removeFromCart));
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if (amount <= 0) {
        throw new Error();
      }
      const { data } = await api.get(`stock/${productId}`);
      const stock = data as Stock;
      if (amount > stock.amount) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }
      const updateCart = cart.map(product => {
        if (product.id === productId) {
          product.amount = amount;
        }
        return product;
      });
      setCart(updateCart);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updateCart));
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
