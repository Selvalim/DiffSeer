import Http from '../http';

const http = new Http();


export const updateUserID = payload => ({
  type: 'UPDATE_USER_ID',
  payload
});

export const updateDayTime = payload => ({
  type: 'UPDATE_DAY_TIME',
  payload
});

export const getUserBehaviorsOfHourByTime = payload => async (dispatch) => {
  const result = await http.get('getUserBehaviorsOfHourByTime', {
    userID: payload.userID,
    time: payload.time
  });
  const action = {
    type: 'GET_USER_BEHAVIORS_OF_HOUR_BY_TIME',
    payload: result.res
  };
  dispatch(action);
}

export const getUserBehaviorsOfMinByTime = payload => async (dispatch) => {
  const result = await http.get('getUserBehaviorsOfMinByTime', {
    userID: payload.userID,
    time: payload.time
  });
  const action = {
    type: 'GET_USER_BEHAVIORS_OF_MIN_BY_TIME',
    payload: result.res
  };
  dispatch(action);
}

export const updateSelectedCircle = payload => {
    return {
      type: 'UPDATE_SELECTEDCIRCLE',
      payload
    }
}
export const updateSelectedDiffCircle = payload => {
    return {
      type: 'UPDATE_SELECTEDDIFFCIRCLE',
      payload
    }
}
export const updateSelectedDate = payload => {
    console.log(payload)
    return {
      type: 'UPDATE_SELECTEDDATE',
      payload
    }
}
export const updateNetworkView = payload => {
    return {
      type: 'UPDATE_NETWORKVIEW',
      payload
    }
}
export const updateDiffNetworkView = payload => {
    return {
      type: 'UPDATE_DIFFNETWORKVIEW',
      payload
    }
}
export const addUnfoldDay = payload => {
    return {
      type: 'ADD_UNFOLDDAY',
      payload
    }
}
export const deleteUnfoldDay = payload => {
    return {
      type: 'DELETE_UNFOLDDAY',
      payload
    }
}
export const updateUnfoldDay = payload => {
    return {
      type: 'UPDATE_UNFOLDDAY',
      payload
    }
}
export const updateUnfoldDiff = payload => {
    return {
      type: 'UPDATE_UNFOLDDIFF',
      payload
    }
}
export const updateNeedOrder = payload => {
    return {
      type: 'UPDATE_NEEDORDER',
      payload
    }
}
export const updateLocation = payload => {
    return {
      type: 'UPDATE_LOCATION',
      payload
    }
}
export const updateNodeOrder = payload => {
    return {
      type: 'UPDATE_NODEORDER',
      payload
    }
}
export const updateFocusSpan = payload => {
    return {
      type: 'UPDATE_FOCUSSPAN',
      payload
    }
}
export const updateTimeSpan = payload => {
    return {
      type: 'UPDATE_TIMESPAN',
      payload
    }
}
export const updateUnfoldSwitch = payload => {
    return {
      type: 'UPDATE_UNFOLDSWITCH',
      payload
    }
}
export const updateEdgeReorder = payload => {
    return {
      type: 'UPDATE_EDGEREORDER',
      payload
    }
}
export const updateStreamSwitch = payload => {
    return {
      type: 'UPDATE_STREAMSWITCH',
      payload
    }
}
export const reset = payload => {
    return {
      type: 'RESET',
      payload
    }
}
;