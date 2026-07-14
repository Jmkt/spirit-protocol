function calculateOrderTotal(items, discountPercent) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  const discount = total * (discountPercent / 100);
  return total - discount;
}

function applyBulkDiscount(orders) {
  return orders.map(order => {
    const total = calculateOrderTotal(order.items, order.discountPercent);
    return { ...order, total: total.toFixed(2) };
  });
}

module.exports = { calculateOrderTotal, applyBulkDiscount };
