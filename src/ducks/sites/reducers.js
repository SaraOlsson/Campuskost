import * as types from './types';

const INITIAL_STATE = {
  isFetchingSites: false,
  sites: [],
  getInactiveSites: false,
};

const sites = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.REQUEST_SITES:
      return {
        ...state,
        isFetchingSites: true,
      };

    case types.RECEIVE_SITES:
      return {
        ...state,
        sites: action.data,
        isFetchingSites: false,
      };
    case types.TOGGLE_CHECKBOX:
      return {
        ...state,
        getInactiveSites: !state.getInactiveSites,
      };
    default:
      return state;
  }
};

export default sites;
