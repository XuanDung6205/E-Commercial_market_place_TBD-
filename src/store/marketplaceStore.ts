import { useSyncExternalStore } from 'react';
import { CartItem, Order, Product, Review } from '@/src/types/models';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Dâu tây Đà Lạt',
    price: 85000,
    compareAtPrice: 105000,
    rating: 4.9,
    reviewCount: 128,
    tag: 'Mua 1 tặng 1',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
    description: 'Dâu tây Đà Lạt chín mọng, vị ngọt thanh tự nhiên xen lẫn chút chua nhẹ đặc trưng, hái tươi mỗi sáng tại vườn nông trại sạch.',
    stock: 45,
  },
  {
    id: 'prod-2',
    name: 'Bơ sáp Đắk Lắk',
    price: 45000,
    compareAtPrice: 60000,
    rating: 4.8,
    reviewCount: 96,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
    description: 'Bơ sáp chuẩn gốc Đắk Lắk, quả già cơm dẻo quánh, màu vàng ươm, béo ngậy tự nhiên, bổ dưỡng cho cả gia đình.',
    stock: 30,
  },
  {
    id: 'prod-3',
    name: 'Cam vàng mọng nước',
    price: 59000,
    compareAtPrice: 75000,
    rating: 4.9,
    reviewCount: 84,
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80',
    description: 'Cam vàng nhập khẩu mọng nước, vỏ mỏng thơm ngát, vị ngọt thanh mát, giàu vitamin C giúp tăng sức đề kháng.',
    stock: 50,
  },
  {
    id: 'prod-4',
    name: 'Tai nghe không dây Air',
    price: 890000,
    compareAtPrice: 1050000,
    rating: 4.8,
    reviewCount: 215,
    tag: 'Giảm 15%',
    variant: 'Màu trắng',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    description: 'Tai nghe Bluetooth thiết kế công thái học cao cấp, âm bass mạnh mẽ, chống ồn chủ động ANC và pin liên tục đến 30 giờ.',
    stock: 18,
  },
  {
    id: 'prod-5',
    name: 'Bình giữ nhiệt Daily 500ml',
    price: 219000,
    compareAtPrice: 269000,
    rating: 4.7,
    reviewCount: 52,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    description: 'Bình giữ nhiệt thép không gỉ 304 cao cấp 2 lớp chân không, giữ nóng 12h và giữ lạnh đến 24h, an toàn cho sức khỏe.',
    stock: 25,
  },
  {
    id: 'prod-6',
    name: 'Áo thun Cotton Basic',
    price: 189000,
    compareAtPrice: 229000,
    rating: 4.9,
    reviewCount: 140,
    tag: 'Mua 1 tặng 1',
    variant: 'Trắng / Size L',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    description: 'Áo thun phong cách basic chất liệu 100% cotton co giãn 4 chiều mềm mịn, thấm hút mồ hôi tối đa, dễ phối đồ.',
    stock: 60,
  },
];

type StoreState = {
  cart: CartItem[];
  favoriteIds: string[];
  orders: Order[];
  reviews: Review[];
  voucherCode: string;
  discountRate: number; // e.g. 0.1 for 10%
};

const INITIAL_STATE: StoreState = {
  cart: [
    {
      id: 'cart-1',
      product: MOCK_PRODUCTS[0], // Dâu tây Đà Lạt
      quantity: 2,
      variant: 'Hộp 500g',
      selected: true,
    },
    {
      id: 'cart-2',
      product: MOCK_PRODUCTS[3], // Tai nghe không dây Air
      quantity: 1,
      variant: 'Màu trắng',
      selected: true,
    },
  ],
  favoriteIds: ['prod-1', 'prod-2', 'prod-3', 'prod-4'],
  orders: [
    {
      id: 'ord-2026',
      orderNumber: '2026',
      date: '25/10/2026',
      time: '09:15',
      status: 'pending',
      items: [
        {
          id: 'item-2026-1',
          productId: 'prod-4',
          productName: 'Tai nghe không dây Air',
          variant: 'Màu trắng',
          quantity: 1,
          price: 890000,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        },
      ],
      subtotal: 890000,
      tax: 89000,
      shippingFee: 25000,
      discount: 0,
      total: 1004000,
      recipientName: 'Nguyễn Minh Anh',
      phone: '0912 345 678',
      address: '25 Nguyễn Thị Minh Khai, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      paymentMethod: 'cod',
      isPaid: false,
    },
    {
      id: 'ord-2024',
      orderNumber: '2024',
      date: '24/10/2026',
      status: 'shipped',
      items: [
        {
          id: 'item-2024-1',
          productId: 'prod-1',
          productName: 'Dâu tây Đà Lạt',
          variant: 'Hộp 500g',
          quantity: 2,
          price: 85000,
          image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'item-2024-2',
          productId: 'prod-2',
          productName: 'Bơ sáp Đắk Lắk',
          variant: '1 kg',
          quantity: 1,
          price: 45000,
          image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
        },
      ],
      subtotal: 215000,
      tax: 0,
      shippingFee: 17900,
      discount: 0,
      total: 232900,
      recipientName: 'Nguyễn Minh Anh',
      phone: '0912 345 678',
      address: '25 Nguyễn Thị Minh Khai, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      paymentMethod: 'cod',
      isPaid: false,
    },
    {
      id: 'ord-2025',
      orderNumber: '2025',
      date: '23/10/2026',
      receivedTime: '14:30 · 24/10/2026',
      status: 'delivered',
      items: [
        {
          id: 'item-2025-1',
          productId: 'prod-4',
          productName: 'Tai nghe không dây Air',
          variant: 'Màu trắng',
          quantity: 1,
          price: 890000,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        },
      ],
      subtotal: 890000,
      tax: 89000,
      shippingFee: 25000,
      discount: 0,
      total: 1004000,
      recipientName: 'Nguyễn Minh Anh',
      phone: '0912 345 678',
      address: '25 Nguyễn Thị Minh Khai, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      paymentMethod: 'cod',
      isPaid: true,
    },
    {
      id: 'ord-2023',
      orderNumber: '2023',
      date: '22/10/2026',
      status: 'cancelled',
      items: [
        {
          id: 'item-2023-1',
          productId: 'prod-1',
          productName: 'Dâu tây Đà Lạt',
          variant: 'Hộp 500g',
          quantity: 2,
          price: 85000,
          image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'item-2023-2',
          productId: 'prod-3',
          productName: 'Cam vàng mọng nước',
          variant: '1 kg',
          quantity: 1,
          price: 59000,
          image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80',
        },
      ],
      subtotal: 229000,
      tax: 0,
      shippingFee: 3900,
      discount: 0,
      total: 232900,
      recipientName: 'Nguyễn Minh Anh',
      phone: '0912 345 678',
      address: '25 Nguyễn Thị Minh Khai, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      paymentMethod: 'cod',
      isPaid: false,
    },
  ],
  reviews: [
    {
      id: 'rev-1',
      productId: 'prod-4',
      productName: 'Tai nghe không dây Air',
      userName: 'Trần Hoàng Long',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      isVerifiedBuyer: true,
      createdAt: '28/10/2026',
      comment: 'Tai nghe đeo rất êm tai, âm bass sâu và cách âm cực kỳ tốt. Pin dùng cả tuần chưa cần sạc lại. Đóng gói rất cẩn thận, shipper giao nhanh!',
      tags: ['Chất lượng tuyệt vời', 'Giao hàng nhanh'],
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=500&q=80',
      ],
    },
    {
      id: 'rev-2',
      productId: 'prod-4',
      productName: 'Tai nghe không dây Air',
      userName: 'Nguyễn Minh Trang',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      isVerifiedBuyer: true,
      createdAt: '26/10/2026',
      comment: 'Sản phẩm đúng như mô tả, kết nối Bluetooth với iPhone và MacBook đều rất nhanh, không bị delay khi xem phim. 10/10 sẽ ủng hộ shop tiếp!',
      tags: ['Đúng với mô tả', 'Đóng gói cẩn thận'],
    },
    {
      id: 'rev-3',
      productId: 'prod-4',
      productName: 'Tai nghe không dây Air',
      userName: 'Phạm Quốc Huy',
      userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      rating: 4,
      isVerifiedBuyer: true,
      createdAt: '20/10/2026',
      comment: 'Chất lượng âm thanh ổn áp trong tầm giá. Màu trắng nhìn rất sang trọng. Điểm trừ nhẹ là hộp sạc hơi dễ bám vân tay chút.',
      tags: ['Giá cả hợp lý'],
      images: [
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=500&q=80',
      ],
    },
    {
      id: 'rev-4',
      productId: 'prod-4',
      productName: 'Tai nghe không dây Air',
      userName: 'Lê Thu Thảo',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      isVerifiedBuyer: true,
      createdAt: '15/10/2026',
      comment: 'Đeo cả ngày đi làm không bị đau tai, micro đàm thoại rõ ràng ngay cả khi ngoài đường. Rất ưng ý!',
      tags: ['Chất lượng tuyệt vời'],
    },
    {
      id: 'rev-5',
      productId: 'prod-1',
      productName: 'Dâu tây Đà Lạt',
      userName: 'Đặng Ngọc Ánh',
      userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      isVerifiedBuyer: true,
      createdAt: '27/10/2026',
      comment: 'Dâu to tròn mọng nước, ăn ngọt thanh thơm lừng. Giao tới nơi còn nguyên vẹn không bị dập trái nào. Sẽ mua lại!',
      tags: ['Chất lượng tuyệt vời', 'Giao hàng nhanh'],
      images: [
        'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=500&q=80',
      ],
    },
    {
      id: 'rev-6',
      productId: 'prod-1',
      productName: 'Dâu tây Đà Lạt',
      userName: 'Bùi Hải Yến',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      isVerifiedBuyer: true,
      createdAt: '24/10/2026',
      comment: 'Mua đợt khuyến mãi mua 1 tặng 1 siêu hời, dâu rất tươi ngon!',
      tags: ['Giá cả hợp lý'],
    },
  ],
  voucherCode: '',
  discountRate: 0,
};

let state: StoreState = INITIAL_STATE;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export const marketplaceStore = {
  getState() {
    return state;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  // Shopping Cart Actions
  addToCart(product: Product, quantity = 1, variant?: string) {
    const existingIndex = state.cart.findIndex(
      (item) => item.product.id === product.id && item.variant === (variant ?? product.variant)
    );

    let nextCart: CartItem[];
    if (existingIndex > -1) {
      nextCart = state.cart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        product,
        quantity,
        variant: variant ?? product.variant,
        selected: true,
      };
      nextCart = [newItem, ...state.cart];
    }

    state = { ...state, cart: nextCart };
    notify();
  },

  updateQuantity(cartItemId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(cartItemId);
      return;
    }
    const nextCart = state.cart.map((item) =>
      item.id === cartItemId ? { ...item, quantity } : item
    );
    state = { ...state, cart: nextCart };
    notify();
  },

  removeFromCart(cartItemId: string) {
    const nextCart = state.cart.filter((item) => item.id !== cartItemId);
    state = { ...state, cart: nextCart };
    notify();
  },

  toggleSelectItem(cartItemId: string) {
    const nextCart = state.cart.map((item) =>
      item.id === cartItemId ? { ...item, selected: !item.selected } : item
    );
    state = { ...state, cart: nextCart };
    notify();
  },

  toggleSelectAll(select: boolean) {
    const nextCart = state.cart.map((item) => ({ ...item, selected: select }));
    state = { ...state, cart: nextCart };
    notify();
  },

  clearCart() {
    state = { ...state, cart: [] };
    notify();
  },

  clearSelectedCart() {
    state = { ...state, cart: state.cart.filter((item) => !item.selected) };
    notify();
  },

  applyVoucher(code: string): { success: boolean; message: string } {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      state = { ...state, voucherCode: '', discountRate: 0 };
      notify();
      return { success: false, message: 'Vui lòng nhập mã ưu đãi' };
    }
    if (normalized === 'MAYMOI10' || normalized === 'CHOMAY10') {
      state = { ...state, voucherCode: normalized, discountRate: 0.1 }; // 10%
      notify();
      return { success: true, message: 'Áp dụng mã giảm 10% thành công!' };
    }
    if (normalized === 'GIAM20' || normalized === 'SALE20') {
      state = { ...state, voucherCode: normalized, discountRate: 0.2 }; // 20%
      notify();
      return { success: true, message: 'Áp dụng mã giảm 20% thành công!' };
    }
    return { success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn' };
  },

  removeVoucher() {
    state = { ...state, voucherCode: '', discountRate: 0 };
    notify();
  },

  // Favorites Actions
  toggleFavorite(productId: string) {
    const exists = state.favoriteIds.includes(productId);
    const nextFavorites = exists
      ? state.favoriteIds.filter((id) => id !== productId)
      : [...state.favoriteIds, productId];

    state = { ...state, favoriteIds: nextFavorites };
    notify();
  },

  removeFavorite(productId: string) {
    state = {
      ...state,
      favoriteIds: state.favoriteIds.filter((id) => id !== productId),
    };
    notify();
  },

  isFavorite(productId: string) {
    return state.favoriteIds.includes(productId);
  },

  // Orders Actions
  placeOrder(params: {
    items: { product: Product; quantity: number; variant?: string }[];
    recipientName: string;
    phone: string;
    address: string;
    paymentMethod: 'cod' | 'bank_transfer' | 'e_wallet';
    note?: string;
  }): Order {
    const subtotal = params.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const tax = Math.round(subtotal * 0.1);
    const shippingFee = 25000;
    const discount = Math.round(subtotal * state.discountRate);
    const total = Math.max(0, subtotal + tax + shippingFee - discount);

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `${2027 + state.orders.length}`,
      date: dateStr,
      time: timeStr,
      status: 'pending',
      items: params.items.map((item, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        productId: item.product.id,
        productName: item.product.name,
        variant: item.variant ?? item.product.variant,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.image,
      })),
      subtotal,
      tax,
      shippingFee,
      discount,
      total,
      recipientName: params.recipientName,
      phone: params.phone,
      address: params.address,
      paymentMethod: params.paymentMethod,
      isPaid: false,
    };

    // Remove ordered items from cart
    const orderedProductIds = new Set(params.items.map((it) => it.product.id));
    const nextCart = state.cart.filter((item) => !orderedProductIds.has(item.product.id));

    state = {
      ...state,
      orders: [newOrder, ...state.orders],
      cart: nextCart,
      voucherCode: '',
      discountRate: 0,
    };
    notify();
    return newOrder;
  },

  cancelOrder(orderId: string): boolean {
    let updated = false;
    const nextOrders = state.orders.map((ord) => {
      if (ord.id === orderId || ord.orderNumber === orderId) {
        updated = true;
        return { ...ord, status: 'cancelled' as const };
      }
      return ord;
    });
    if (updated) {
      state = { ...state, orders: nextOrders };
      notify();
    }
    return updated;
  },

  getOrderById(id: string): Order | undefined {
    return state.orders.find((ord) => ord.id === id || ord.orderNumber === id);
  },

  // Reviews
  addReview(review: Omit<Review, 'id' | 'createdAt'>): Review {
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()}`;

    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      userName: review.userName || 'Nguyễn Minh Anh',
      isVerifiedBuyer: review.isVerifiedBuyer ?? true,
      createdAt: dateStr,
    };
    state = { ...state, reviews: [newReview, ...state.reviews] };
    notify();
    return newReview;
  },

  getReviewsByProductId(productId: string): Review[] {
    return state.reviews.filter((r) => r.productId === productId);
  },
};

// React Hooks
export function useCart() {
  const s = useSyncExternalStore(marketplaceStore.subscribe, marketplaceStore.getState);
  const selectedItems = s.cart.filter((i) => i.selected);
  const subtotal = selectedItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = Math.round(subtotal * s.discountRate);
  const tax = Math.round(subtotal * 0.1);
  const shippingFee = subtotal > 0 ? 25000 : 0;
  const total = Math.max(0, subtotal + tax + shippingFee - discount);
  const totalQuantity = s.cart.reduce((acc, item) => acc + item.quantity, 0);

  return {
    cart: s.cart,
    selectedItems,
    subtotal,
    discount,
    tax,
    shippingFee,
    total,
    totalQuantity,
    voucherCode: s.voucherCode,
    discountRate: s.discountRate,
    addToCart: marketplaceStore.addToCart.bind(marketplaceStore),
    updateQuantity: marketplaceStore.updateQuantity.bind(marketplaceStore),
    removeFromCart: marketplaceStore.removeFromCart.bind(marketplaceStore),
    toggleSelectItem: marketplaceStore.toggleSelectItem.bind(marketplaceStore),
    toggleSelectAll: marketplaceStore.toggleSelectAll.bind(marketplaceStore),
    clearCart: marketplaceStore.clearCart.bind(marketplaceStore),
    clearSelectedCart: marketplaceStore.clearSelectedCart.bind(marketplaceStore),
    applyVoucher: marketplaceStore.applyVoucher.bind(marketplaceStore),
    removeVoucher: marketplaceStore.removeVoucher.bind(marketplaceStore),
  };
}

export function useFavorites() {
  const s = useSyncExternalStore(marketplaceStore.subscribe, marketplaceStore.getState);
  const favorites = MOCK_PRODUCTS.filter((p) => s.favoriteIds.includes(p.id));

  return {
    favoriteIds: s.favoriteIds,
    favorites,
    count: s.favoriteIds.length,
    toggleFavorite: marketplaceStore.toggleFavorite.bind(marketplaceStore),
    removeFavorite: marketplaceStore.removeFavorite.bind(marketplaceStore),
    isFavorite: (productId: string) => s.favoriteIds.includes(productId),
  };
}

export function useOrders() {
  const s = useSyncExternalStore(marketplaceStore.subscribe, marketplaceStore.getState);

  return {
    orders: s.orders,
    getOrderById: marketplaceStore.getOrderById.bind(marketplaceStore),
    placeOrder: marketplaceStore.placeOrder.bind(marketplaceStore),
    cancelOrder: marketplaceStore.cancelOrder.bind(marketplaceStore),
  };
}

export function useReviews() {
  const s = useSyncExternalStore(marketplaceStore.subscribe, marketplaceStore.getState);

  return {
    reviews: s.reviews,
    addReview: marketplaceStore.addReview.bind(marketplaceStore),
    getReviewsByProductId: marketplaceStore.getReviewsByProductId.bind(marketplaceStore),
  };
}
