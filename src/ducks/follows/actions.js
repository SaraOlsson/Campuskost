import * as types from './types';

const toggleFollows = (id) => ({
  type: types.TOGGLE_FOLLOWS,
  id,
});

const setFollow = () => (dispatch, getState) => {
  //const state = getState();
  //const isFetching = state.sitesState.isFetchingSites;
  //const isInactiveToggled = state.sitesState.getInactiveSites;

  dispatch(toggleFollows());

};

export {
  setFollow,
};
