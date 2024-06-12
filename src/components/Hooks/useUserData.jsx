import { useEffect, useReducer } from "react";

const initialState = {
  user: null,
  role: "",
  loading: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        role: action.payload.role,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

const useUserData = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchUserData = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await fetch(
        "https://hms-server-uniceh.vercel.app/api/v1/user/user-info",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
          },
        }
      );
      const data = await response.json();
      dispatch({
        type: "SET_USER",
        payload: { user: data?.data, role: data?.data?.role },
      });
      dispatch({ type: "SET_LOADING", payload: false });
    };
    fetchUserData();
  }, [localStorage.getItem("LoginToken")]);

  return {
    user: state.user,
    role: state.role,
    loading: state.loading,
  };
};

export default useUserData;
