export function getMyTickets(state) {
    return state.myTickets;
}

export function getAdminTickets(state) {
    return state.adminTickets;
}

export function getCurrentTicket(state) {
    return state.currentTicket;
}

export function getOpenTicketsCount(state) {
    return state.myTickets.filter((ticket) => ticket.status === 'open').length;
}
