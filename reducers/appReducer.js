import {
  GET_DOWNLOADABLE_APPS,
  GET_LOCAL_APPS,
  DELETE_APP,
  UPDATE_APP,
  REGISTER_STATS,
  ON_ERROR,
} from '../actions/types';

const baseState = {
  localApps: {},
  error: {},
};

export default function reducer(state = baseState, action) {
  switch (action.type) {
    case GET_DOWNLOADABLE_APPS:
      return {
        ...state,
        localApps: action.payload,
      };
    case GET_LOCAL_APPS:
      return {
        ...state,
        cloudApps: {},
        localApps: action.payload,
      };
    case DELETE_APP:
      return {
        ...state,
        localApps: action.payload,
      };
    case UPDATE_APP:
      let apps = JSON.parse(JSON.stringify(state.localApps));
      if (action.payload.finishedDownload) {
        apps[action.payload.id] = action.payload;
        apps[action.payload.id].finishedDownload = true;
      } else {
        apps[action.payload.id] = action.payload;
        apps[action.payload.id].finishedDownload = false;
      }
      return {
        ...state,
        localApps: apps,
      };
    case REGISTER_STATS:
      return {
        ...state,
      };
    case ON_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}
