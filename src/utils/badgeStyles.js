export function getDiscountBadgeColor(isDark) {
  return isDark
    ? { color: 'orange-9', 'text-color': 'white' }
    : { color: 'orange-1', 'text-color': 'orange-9' };
}

export function getSupportTicketCategoryColor(category, isDark) {
  const map = {
    no_show: { color: isDark ? 'red-9' : 'red-1', 'text-color': isDark ? 'white' : 'red-9' },
    delay: { color: isDark ? 'orange-9' : 'orange-1', 'text-color': isDark ? 'white' : 'orange-9' },
    bad_service: { color: isDark ? 'red-9' : 'red-1', 'text-color': isDark ? 'white' : 'red-9' },
    cancellation: { color: isDark ? 'red-9' : 'red-1', 'text-color': isDark ? 'white' : 'red-9' },
    other: { color: isDark ? 'grey-8' : 'grey-2', 'text-color': isDark ? 'white' : 'grey-8' },
  };
  return map[category] || { color: isDark ? 'blue-9' : 'blue-1', 'text-color': isDark ? 'white' : 'blue-9' };
}

export function getSupportTicketStatusColor(status, isDark) {
  const map = {
    open: { color: isDark ? 'orange-9' : 'orange-1', 'text-color': isDark ? 'white' : 'orange-9' },
    under_review: { color: isDark ? 'blue-9' : 'blue-1', 'text-color': isDark ? 'white' : 'blue-9' },
    resolved: { color: isDark ? 'green-9' : 'green-1', 'text-color': isDark ? 'white' : 'green-9' },
    rejected: { color: isDark ? 'grey-8' : 'grey-2', 'text-color': isDark ? 'white' : 'grey-8' },
  };
  return map[status] || { color: isDark ? 'grey-8' : 'grey-2', 'text-color': isDark ? 'white' : 'grey-8' };
}

export function getEventStatusColor(status, isDark) {
  if (status === 'completed') return { color: isDark ? 'green-9' : 'green-1', 'text-color': isDark ? 'white' : 'green-9' };
  if (status === 'expired' || status === 'rejected') return { color: isDark ? 'red-9' : 'red-1', 'text-color': isDark ? 'white' : 'red-9' };
  if (status === 'cancelled') return { color: isDark ? 'grey-8' : 'grey-2', 'text-color': isDark ? 'white' : 'grey-8' };
  return { color: isDark ? 'orange-9' : 'orange-1', 'text-color': isDark ? 'white' : 'orange-9' };
}

export function getOrderPaymentStatusColor(purchase, isDark) {
  if (!purchase) return { color: isDark ? 'orange-9' : 'orange-1', 'text-color': isDark ? 'white' : 'orange-9' };
  if (purchase.approval_status === 'pending_approval') return { color: isDark ? 'orange-9' : 'orange-1', 'text-color': isDark ? 'white' : 'orange-9' };
  if (purchase.approval_status === 'rejected' || purchase.approval_status === 'expired' || purchase.approval_status === 'cancelled') return { color: isDark ? 'red-9' : 'red-1', 'text-color': isDark ? 'white' : 'red-9' };
  return purchase.status === 'completed' ? { color: isDark ? 'green-9' : 'green-1', 'text-color': isDark ? 'white' : 'green-9' } : { color: isDark ? 'orange-9' : 'orange-1', 'text-color': isDark ? 'white' : 'orange-9' };
}

export function getPaymentStatusColor(status, isDark) {
  if (status === 'completed') return { color: isDark ? 'green-9' : 'green-1', 'text-color': isDark ? 'white' : 'green-9' };
  if (status === 'failed' || status === 'cancelled' || status === 'expired') return { color: isDark ? 'red-9' : 'red-1', 'text-color': isDark ? 'white' : 'red-9' };
  return { color: isDark ? 'orange-9' : 'orange-1', 'text-color': isDark ? 'white' : 'orange-9' };
}

export function getApprovalHistoryStatusColor(status, isDark) {
  if (status === 'accepted') return { color: isDark ? 'green-9' : 'green-1', 'text-color': isDark ? 'white' : 'green-9' };
  if (status === 'rejected') return { color: isDark ? 'red-9' : 'red-1', 'text-color': isDark ? 'white' : 'red-9' };
  return { color: isDark ? 'grey-8' : 'grey-2', 'text-color': isDark ? 'white' : 'grey-8' };
}

export function getRefundStatusColor(status, isDark) {
  if (status === 'processed') return { color: isDark ? 'green-9' : 'green-1', 'text-color': isDark ? 'white' : 'green-9' };
  if (status === 'failed') return { color: isDark ? 'red-9' : 'red-1', 'text-color': isDark ? 'white' : 'red-9' };
  return { color: isDark ? 'orange-9' : 'orange-1', 'text-color': isDark ? 'white' : 'orange-9' };
}

export function getPayoutStatusColor(row, isDark) {
  if (row.status === 'liquidated') return { color: isDark ? 'green-9' : 'green-1', 'text-color': isDark ? 'white' : 'green-9' };
  if (!row.can_release) return { color: isDark ? 'orange-9' : 'orange-1', 'text-color': isDark ? 'white' : 'orange-9' };
  return { color: isDark ? 'orange-9' : 'orange-1', 'text-color': isDark ? 'white' : 'orange-9' };
}

export function getWebhookTimeColor(date, isDark) {
  if (!date) return { color: isDark ? 'grey-8' : 'grey-2', 'text-color': isDark ? 'white' : 'grey-8' };
  const now = new Date()
  const diff = now - new Date(date)
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return { color: isDark ? 'green-9' : 'green-1', 'text-color': isDark ? 'white' : 'green-9' };
  if (hours < 24) return { color: isDark ? 'orange-9' : 'orange-1', 'text-color': isDark ? 'white' : 'orange-9' };
  return { color: isDark ? 'grey-8' : 'grey-2', 'text-color': isDark ? 'white' : 'grey-8' };
}

export function getUserSanctionStatusColor(status, isDark) {
  if (status === 'active') return { color: isDark ? 'green-9' : 'green-1', 'text-color': isDark ? 'white' : 'green-9' };
  if (status === 'restricted') return { color: isDark ? 'orange-9' : 'orange-1', 'text-color': isDark ? 'white' : 'orange-9' };
  return { color: isDark ? 'grey-8' : 'grey-2', 'text-color': isDark ? 'white' : 'grey-8' };
}

export function getUserSanctionCategoryColor(category, isDark) {
  return getSupportTicketCategoryColor(category, isDark);
}

export function getUserSanctionTicketsColor(isDark) {
  return { color: isDark ? 'red-9' : 'red-1', 'text-color': isDark ? 'white' : 'red-9' };
}

export function getUserSanctionFaultsColor(count, isDark) {
  if (count >= 2) return { color: isDark ? 'red-9' : 'red-1', 'text-color': isDark ? 'white' : 'red-9' };
  return { color: isDark ? 'orange-9' : 'orange-1', 'text-color': isDark ? 'white' : 'orange-9' };
}

export function getOfferStatusColor(isActive, isDark) {
  if (isActive) return { color: isDark ? 'green-9' : 'green-1', 'text-color': isDark ? 'white' : 'green-9' };
  return { color: isDark ? 'orange-9' : 'orange-1', 'text-color': isDark ? 'white' : 'orange-9' };
}

export function getArtistApprovalTypeColor(type, isDark) {
  if (type === 'creation') return { color: isDark ? 'blue-9' : 'blue-1', 'text-color': isDark ? 'white' : 'blue-9' };
  return { color: isDark ? 'teal-9' : 'teal-1', 'text-color': isDark ? 'white' : 'teal-9' };
}

export function getArtistApprovalStatusColor(status, isDark) {
  if (status === 'pending_approval') return { color: isDark ? 'orange-9' : 'orange-1', 'text-color': isDark ? 'white' : 'orange-9' };
  if (status === 'accepted') return { color: isDark ? 'green-9' : 'green-1', 'text-color': isDark ? 'white' : 'green-9' };
  if (status === 'rejected') return { color: isDark ? 'red-9' : 'red-1', 'text-color': isDark ? 'white' : 'red-9' };
  return { color: isDark ? 'grey-8' : 'grey-2', 'text-color': isDark ? 'white' : 'grey-8' };
}
