export const RESPONSE_MESSAGES = {
    AUTH: {
        LOGIN_SUCCESS: 'Login successful.' ,
        INVALID_CREDENTIALS: 'Invalid email or password',
        UNAUTHORIZED: 'Unauthorized access.',
    },
    USER: {
        CREATED: 'User created successfully.',
        NOT_FOUND: 'User not found. Please try again!',
        INVALID_ROLE: 'Invalid Role. Please try again!',
    },
    GENERAL: {
        SERVER_ERROR: 'Internal server error.',
        BAD_REQUEST: 'Bad request.',
        SUCCESS: 'Operation completed successfully.',
        ERROR: 'Something went wrong.',
    },
    ORDERS: {
        ORDER_DELETED: 'Order have been successfully deleted.',
        ORDER_NOT_FOUND: 'Order not found or doesnt exist.',
    },
    PRODUCT: {
        CATEGORY_NOT_FOUND: 'Invalid categoryId: The referenced category does not exist.',
    },
    INVOICES: {
        ORDER_PAYMENT_PENDING: 'Payment is pending, your request for invoice has been rejected.'
    },
    CART: {
    ITEM_UPDATED: 'Cart item quantity updated successfully.',
    ITEM_REMOVED: 'Item removed from cart successfully.',
    ITEM_NOT_FOUND: 'Item not found in cart.',
    INSUFFICIENT_STOCK: (productName: string, stock: number, requested: number) =>
      `Cannot update ${requested} of "${productName}". Only ${stock} left in stock.`,
  },
};