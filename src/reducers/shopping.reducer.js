export const initialState = {
  items: [],
  isLoading: true,
  isSaving: false,
  errorMessage: '',
  sortField: 'name',
  queryString: '',
  category: 'All',
};

export const actions = {
  initFromStorage: 'shopping/initFromStorage',
  setError: 'shopping/setError',
  startRequest: 'shopping/startRequest',
  endRequest: 'shopping/endRequest',

  addItem: 'shopping/addItem',
  updateItem: 'shopping/updateItem',
  deleteItem: 'shopping/deleteItem',
  togglePacked: 'shopping/togglePacked',

  setSortField: 'shopping/setSortField',
  setQuery: 'shopping/setQuery',
  setCategory: 'shopping/setCategory',
};

export function reducer(state, action) {
  switch (action.type) {
    case actions.initFromStorage:
      return {
        ...state,
        items: action.items,
        isLoading: false,
        errorMessage: '',
      };
    case actions.setError:
      return { ...state, isLoading: false, errorMessage: String(action.error) };
    case actions.startRequest:
      return { ...state, isSaving: true };
    case actions.endRequest:
      return { ...state, isSaving: false };

    case actions.addItem:
      return { ...state, items: [action.item, ...state.items] };
    case actions.updateItem:
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.item.id ? action.item : i
        ),
      };
    case actions.deleteItem:
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case actions.togglePacked:
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, packed: !i.packed } : i
        ),
      };

    case actions.setSortField:
      return { ...state, sortField: action.sortField };
    case actions.setQuery:
      return { ...state, queryString: action.queryString };
    case actions.setCategory:
      return { ...state, category: action.category };
    default:
      return state;
  }
}
