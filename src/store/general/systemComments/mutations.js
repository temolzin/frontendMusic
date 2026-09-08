export function setComments(state, comments) {
  state.comments = comments;
}
export function setFilter(state, filter) {
  state.filter = filter;
}
export function setCanComment(state, canComment) {
  state.canComment = canComment;
}
export function setLoading(state, loading) {
  state.loading = loading;
}
export function setSubmitting(state, submitting) {
  state.submitting = submitting;
}
export function prependComment(state, comment) {
  state.comments = [comment, ...state.comments];
}
