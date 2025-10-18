export const initialState = {
  list: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
  sortField: 'Deadline',
  sortDirection: 'asc',
  queryString: '',
};

export const actions = {
  fetchStart: 'colleges/fetchStart',
  fetchSuccess: 'colleges/fetchSuccess',
  fetchError: 'colleges/fetchError',
  startRequest: 'colleges/startRequest',
  endRequest: 'colleges/endRequest',
  addOne: 'colleges/addOne',
  updateOne: 'colleges/updateOne',
  deleteOne: 'colleges/deleteOne',
  setSortField: 'colleges/setSortField',
  setSortDirection: 'colleges/setSortDirection',
  setQuery: 'colleges/setQuery',
};

export function reducer(state, action) {
  switch (action.type) {
    case actions.fetchStart:
      return { ...state, isLoading: true, errorMessage: '' };
    case actions.fetchSuccess:
      return {
        ...state,
        isLoading: false,
        list: action.records,
        errorMessage: '',
      };
    case actions.fetchError:
      return { ...state, isLoading: false, errorMessage: String(action.error) };
    case actions.startRequest:
      return { ...state, isSaving: true };
    case actions.endRequest:
      return { ...state, isSaving: false };
    case actions.addOne:
      return { ...state, list: [action.record, ...state.list] };
    case actions.updateOne:
      return {
        ...state,
        list: state.list.map((r) =>
          r.id === action.record.id ? action.record : r
        ),
      };
    case actions.deleteOne:
      return { ...state, list: state.list.filter((r) => r.id !== action.id) };
    case actions.setSortField:
      return { ...state, sortField: action.sortField };
    case actions.setSortDirection:
      return { ...state, sortDirection: action.sortDirection };
    case actions.setQuery:
      return { ...state, queryString: action.queryString };
    default:
      return state;
  }
}
