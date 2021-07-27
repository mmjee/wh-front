export function humanizeStatusId (id) {
  switch (id) {
    case 'AWAITING_PAYMENT':
      return 'Order is on hold, payment has not been attempted or processed.'
    case 'PAYMENT_NOT_CONFIRMED':
      return 'Payment has not been confirmed yet, check back in 20 minutes.'
    case 'PAID_AWAITING_SHIPMENT':
      return 'Order will be dispatched soon.'
    case 'DELIVERED':
      return 'Order has been delivered.'
    default:
      throw new Error('How did this happen?')
  }
}

export function summarizeCartItems (items) {
  return items.map(item => {
    return '5 \u00D7 ' + item.product.name
  }).join(', ')
}
