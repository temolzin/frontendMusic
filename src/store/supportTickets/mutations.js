export const setMyTickets = (state, tickets) => {
    state.myTickets = tickets;
};

export const setArtistTickets = (state, tickets) => {
    state.artistTickets = tickets;
};

export const setCustomerTickets = (state, tickets) => {
    state.customerTickets = tickets;
};

export const setAdminTickets = (state, tickets) => {
    state.adminTickets = tickets;
};

export const setCurrentTicket = (state, ticket) => {
    state.currentTicket = ticket;
};

export const addMyTicket = (state, ticket) => {
    state.myTickets.unshift(ticket);
};

export const setOpenAdminTicketsCount = (state, count) => {
    state.openAdminTicketsCount = count;
};
