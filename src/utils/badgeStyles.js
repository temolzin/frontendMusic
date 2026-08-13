const darkRed = { style: 'background: rgba(255, 82, 82, 0.15); color: #ff5252' };
const darkOrange = { style: 'background: rgba(255, 152, 0, 0.15); color: #ffb74d' };
const darkGreen = { style: 'background: rgba(76, 175, 80, 0.15); color: #81c784' };
const darkBlue = { style: 'background: rgba(33, 150, 243, 0.15); color: #64b5f6' };
const darkGrey = { style: 'background: rgba(158, 158, 158, 0.15); color: #e0e0e0' };
const darkTeal = { style: 'background: rgba(38, 166, 154, 0.15); color: #4db6ac' };

export function getDiscountBadgeColor(isDark) {
  if (isDark) return darkOrange;
  return { color: 'orange-1', 'text-color': 'orange-9' };
}

export function getSupportTicketCategoryColor(category, isDark) {
  if (isDark) {
    const map = {
      no_show: darkRed,
      delay: darkOrange,
      bad_service: darkRed,
      cancellation: darkRed,
      other: darkGrey,
    };
    return map[category] || darkBlue;
  }
  const map = {
    no_show: { color: 'red-1', 'text-color': 'red-9' },
    delay: { color: 'orange-1', 'text-color': 'orange-9' },
    bad_service: { color: 'red-1', 'text-color': 'red-9' },
    cancellation: { color: 'red-1', 'text-color': 'red-9' },
    other: { color: 'grey-2', 'text-color': 'grey-8' },
  };
  return map[category] || { color: 'blue-1', 'text-color': 'blue-9' };
}

export function getSupportTicketStatusColor(status, isDark) {
  if (isDark) {
    const map = {
      open: darkOrange,
      under_review: darkBlue,
      resolved: darkGreen,
      rejected: darkRed,
    };
    return map[status] || darkGrey;
  }
  const map = {
    open: { color: 'orange-1', 'text-color': 'orange-9' },
    under_review: { color: 'blue-1', 'text-color': 'blue-9' },
    resolved: { color: 'green-1', 'text-color': 'green-9' },
    rejected: { color: 'grey-2', 'text-color': 'grey-8' },
  };
  return map[status] || { color: 'grey-2', 'text-color': 'grey-8' };
}

export function getEventStatusColor(status, isDark) {
  if (status === 'completed') {
    if (isDark) return darkGreen;
    return { color: 'green-1', 'text-color': 'green-9' };
  }
  if (status === 'expired' || status === 'rejected') {
    if (isDark) return darkRed;
    return { color: 'red-1', 'text-color': 'red-9' };
  }
  if (status === 'cancelled') {
    if (isDark) return darkGrey;
    return { color: 'grey-2', 'text-color': 'grey-8' };
  }
  if (isDark) return darkOrange;
  return { color: 'orange-1', 'text-color': 'orange-9' };
}

export function getOrderPaymentStatusColor(purchase, isDark) {
  if (!purchase) {
    if (isDark) return darkOrange;
    return { color: 'orange-1', 'text-color': 'orange-9' };
  }
  if (purchase.approval_status === 'pending_approval') {
    if (isDark) return darkOrange;
    return { color: 'orange-1', 'text-color': 'orange-9' };
  }
  if (purchase.approval_status === 'rejected' || purchase.approval_status === 'expired' || purchase.approval_status === 'cancelled') {
    if (isDark) return darkRed;
    return { color: 'red-1', 'text-color': 'red-9' };
  }
  if (purchase.status === 'completed') {
    if (isDark) return darkGreen;
    return { color: 'green-1', 'text-color': 'green-9' };
  }
  if (isDark) return darkOrange;
  return { color: 'orange-1', 'text-color': 'orange-9' };
}

export function getPaymentStatusColor(status, isDark) {
  if (status === 'completed') {
    if (isDark) return darkGreen;
    return { color: 'green-1', 'text-color': 'green-9' };
  }
  if (status === 'failed' || status === 'cancelled' || status === 'expired') {
    if (isDark) return darkRed;
    return { color: 'red-1', 'text-color': 'red-9' };
  }
  if (isDark) return darkOrange;
  return { color: 'orange-1', 'text-color': 'orange-9' };
}

export function getApprovalHistoryStatusColor(status, isDark) {
  if (status === 'accepted') {
    if (isDark) return darkGreen;
    return { color: 'green-1', 'text-color': 'green-9' };
  }
  if (status === 'rejected') {
    if (isDark) return darkRed;
    return { color: 'red-1', 'text-color': 'red-9' };
  }
  if (isDark) return darkGrey;
  return { color: 'grey-2', 'text-color': 'grey-8' };
}

export function getRefundStatusColor(status, isDark) {
  if (status === 'processed') {
    if (isDark) return darkGreen;
    return { color: 'green-1', 'text-color': 'green-9' };
  }
  if (status === 'failed') {
    if (isDark) return darkRed;
    return { color: 'red-1', 'text-color': 'red-9' };
  }
  if (isDark) return darkOrange;
  return { color: 'orange-1', 'text-color': 'orange-9' };
}

export function getPayoutStatusColor(row, isDark) {
  if (row.status === 'liquidated') {
    if (isDark) return darkGreen;
    return { color: 'green-1', 'text-color': 'green-9' };
  }
  if (isDark) return darkOrange;
  return { color: 'orange-1', 'text-color': 'orange-9' };
}

export function getWebhookTimeColor(date, isDark) {
  if (!date) {
    if (isDark) return darkGrey;
    return { color: 'grey-2', 'text-color': 'grey-8' };
  }
  const now = new Date()
  const diff = now - new Date(date)
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) {
    if (isDark) return darkGreen;
    return { color: 'green-1', 'text-color': 'green-9' };
  }
  if (hours < 24) {
    if (isDark) return darkOrange;
    return { color: 'orange-1', 'text-color': 'orange-9' };
  }
  if (isDark) return darkGrey;
  return { color: 'grey-2', 'text-color': 'grey-8' };
}

export function getUserSanctionStatusColor(status, isDark) {
  if (status === 'active') {
    if (isDark) return darkGreen;
    return { color: 'green-1', 'text-color': 'green-9' };
  }
  if (status === 'restricted') {
    if (isDark) return darkOrange;
    return { color: 'orange-1', 'text-color': 'orange-9' };
  }
  if (isDark) return darkGrey;
  return { color: 'grey-2', 'text-color': 'grey-8' };
}

export function getUserSanctionCategoryColor(category, isDark) {
  return getSupportTicketCategoryColor(category, isDark);
}

export function getUserSanctionTicketsColor(isDark) {
  if (isDark) return darkRed;
  return { color: 'red-1', 'text-color': 'red-9' };
}

export function getUserSanctionFaultsColor(count, isDark) {
  if (count >= 2) {
    if (isDark) return darkRed;
    return { color: 'red-1', 'text-color': 'red-9' };
  }
  if (isDark) return darkOrange;
  return { color: 'orange-1', 'text-color': 'orange-9' };
}

export function getOfferStatusColor(isActive, isDark) {
  if (isActive) {
    if (isDark) return darkGreen;
    return { color: 'green-1', 'text-color': 'green-9' };
  }
  if (isDark) return darkOrange;
  return { color: 'orange-1', 'text-color': 'orange-9' };
}

export function getArtistApprovalTypeColor(type, isDark) {
  if (type === 'creation') {
    if (isDark) return darkBlue;
    return { color: 'blue-1', 'text-color': 'blue-9' };
  }
  if (isDark) return darkTeal;
  return { color: 'teal-1', 'text-color': 'teal-9' };
}

export function getArtistApprovalStatusColor(status, isDark) {
  if (status === 'pending_approval') {
    if (isDark) return darkOrange;
    return { color: 'orange-1', 'text-color': 'orange-9' };
  }
  if (status === 'accepted') {
    if (isDark) return darkGreen;
    return { color: 'green-1', 'text-color': 'green-9' };
  }
  if (status === 'rejected') {
    if (isDark) return darkRed;
    return { color: 'red-1', 'text-color': 'red-9' };
  }
  if (isDark) return darkGrey;
  return { color: 'grey-2', 'text-color': 'grey-8' };
}
