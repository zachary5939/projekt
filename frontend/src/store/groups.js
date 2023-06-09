import { csrfFetch } from "./csrf";

//variables for GETs
const GET_ALL_GROUPS = "groups/GET_ALL_GROUPS";
const GET_ONE_GROUP = "groups/GET_ONE_GROUP";
const CREATE_GROUP = "groups/CREATE_GROUP";
const ADD_GROUP_IMG = "groups/ADD_GROUP_IMG";
const DELETE_GROUP = "groups/DELETE_GROUP";
const GET_GROUP_DETAILS = "groups/groupDetails";
const GET_EVENT_DETAIL = "groups/GET_EVENT_DETAIL"

//actions
const getAllGroups = (groups) => {
  return {
    type: GET_ALL_GROUPS,
    groups,
  };
};

const getOneGroup = (group) => {
  return {
    type: GET_ONE_GROUP,
    group,
  };
};

const createGroup = (group) => {
  return {
    type: CREATE_GROUP,
    group,
  };
};

const deleteGroup = (groupId) => {
  return {
    type: DELETE_GROUP,
    groupId,
  };
};

const addGroupImg = (groupImage) => {
  return {
    type: ADD_GROUP_IMG,
    groupImage,
  };
};

const updateGroup = (group) => {
  return {
    type: "UPDATE_GROUP",
    group: group,
  };
};

const getEventDetail = (event) => {
  return {
    type: GET_EVENT_DETAIL,
    event
  }
}

const actionGetGroupDetails = (data) => {
  return {
    type: GET_GROUP_DETAILS,
    payload: data,
  };
};

export const thunkGetAllGroups = () => async (dispatch) => {
  const response = await fetch("/api/groups");
  const resBody = await response.json();

  const groups = {};
  resBody["Groups"].forEach((group) => (groups[group.id] = group));

  if (response.ok) dispatch(getAllGroups(groups));
  return resBody;
};

export const thunkGetOneGroup = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}`);
  const resBody = await response.json();
  if (response.ok) dispatch(getOneGroup(resBody));
  return resBody;
};

export const thunkCreateGroup = (group, imgUrl) => async (dispatch) => {

    console.log(JSON.stringify(group));
  const res = await csrfFetch('/api/groups', {
    method: 'POST',
    body: JSON.stringify(group),
  });

  if (res.ok) {
    const createdGroup = await res.json();

    if (imgUrl) {
      const imgRes = await csrfFetch(`/api/groups/${createdGroup.id}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: imgUrl,
          preview: true,
        }),
      });

      if (imgRes.ok) {
        const newImg = await imgRes.json();
        createdGroup.GroupImages = [newImg];
      }
    }

    dispatch(createGroup(createdGroup));
    return createdGroup;
  } else {
    const errors = await res.json();
    return errors;
  }
};



  export const thunkUpdateGroup = (group, groupId) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}`, {
      method: 'PUT',
      body: JSON.stringify(group),
    });
    if (res.ok) {
      const group = await res.json();
      dispatch(updateGroup(group));
      return group;
    } else {
      const errors = await res.json();
      return errors;
    }
  };

  export const thunkGetEventDetail = (eventId) => async (dispatch) => {
    const res = await csrfFetch(`/api/events/${eventId}`)
    if (res.ok) {
      const data = await res.json()
      dispatch(getEventDetail(data))
      return data
    } else {
      return window.location.href = "/not-found"
    }
  }


  export const thunkDeleteGroup = (groupId) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      dispatch(deleteGroup(groupId));
      return res;
    } else {
      const errors = await res.json();
      return errors;
    }
  };

export const thunkAddGroupImage = (groupImage, groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/images`, {
    method: "POST",
    body: JSON.stringify(groupImage),
  });
  const resBody = await response.json();
  if (response.ok) dispatch(addGroupImg(groupImage));
  return resBody;
};

// export const thunkUpdateGroupImage =
//   (groupImage, groupId) => async (dispatch) => {
//     await csrfFetch(`/api/group-images/${groupImage.id}`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(groupImage),
//     });

//     const response = await csrfFetch(`/api/groups/${groupId}/images`, {
//       method: "post",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(groupImage),
//     });
//     const resBody = await response.json();
//     if (response.ok) dispatch(addGroupImg(groupImage));
//     return resBody;
//   };

export const thunkGetGroupDetails = (groupId) => async (dispatch) => {
  const res = await fetch(`/api/groups/${groupId}`);
  if (res.ok) {
    const data = await res.json();
    dispatch(actionGetGroupDetails(data));
    return data;
  } else {
    const errorData = await res.json();
    return errorData;
  }
};

//init state
const initialState = {
  allGroups: {},
  individualGroup: {},
  currentGroup: {},
  eventDetail: {}
};
//reducer

const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_GROUPS: {
      return { ...state, allGroups: action.groups };
    }
    case GET_GROUP_DETAILS: {
      const newState = { ...state }
      newState.individualGroup = {...action.payload}
      return newState
    }
    case GET_ONE_GROUP: {
      return { ...state, singleGroup: action.group };
    }
    case GET_EVENT_DETAIL: {
      return { ...state, eventDetail: action.event.id };
    }
    case CREATE_GROUP: {
      return { ...state, allGroups: { ...state.allGroups, [action.group.id]: action.group } };

    }
    case DELETE_GROUP: {
      const { [action.groupId]: deletedGroup, ...updatedGroups } = state.allGroups;
      return { ...state, allGroups: updatedGroups };
  }

    case ADD_GROUP_IMG: {
      const singleGroup = {
        ...state.singleGroup,
        GroupImages: [action.groupImage],
      };
      return { ...state, singleGroup };
    }
    default:
      return state;
  }
};

export default groupsReducer;
