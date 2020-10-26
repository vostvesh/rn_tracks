import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";
import trackerApi from "../api/tracker";

const authReducer = (state, action) => {
  switch (action.type) {
    case "load":
      return { ...state, isLoading: action.payload };
    case "signin":
      return {
        ...state,
        errorMessage: "",
        token: action.payload,
      };
    case "add_error":
      return {
        ...state,
        errorMessage: action.payload,
      };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    case "signout":
      return { ...state, token: null, errorMessage: "" };
    default:
      return state;
  }
};

const tryLocalSignin = (dispatch) => async () => {
  dispatch({ type: "load", payload: true });
  const token = await AsyncStorage.getItem("token");
  if (token) {
    dispatch({ type: "signin", payload: { token } });
  }
  dispatch({ type: "load", payload: false });
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message" });
};

const signup = (dispatch) => async ({ email, password }) => {
  try {
    const response = await trackerApi.post("/signup", { email, password });
    await AsyncStorage.setItem("token", response.data.token);
    dispatch({
      type: "signin",
      payload: response.data.token,
    });
  } catch (error) {
    dispatch({
      type: "add_error",
      payload: "Something went wrong with sign up",
    });
  }
};

const signin = (dispatch) => async ({ email, password }) => {
  try {
    const response = await trackerApi.post("/signin", { email, password });
    await AsyncStorage.setItem("token", response.data.token);
    dispatch({
      type: "signin",
      payload: response.data.token,
    });
  } catch (error) {
    dispatch({
      type: "add_error",
      payload: "Something went wrong with sign in",
    });
  }
};

const signout = (dispatch) => async () => {
  await AsyncStorage.removeItem("token");
  dispatch({ type: "signout" });
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout, signup, clearErrorMessage, tryLocalSignin },
  { token: null, errorMessage: "", isLoading: true }
);
