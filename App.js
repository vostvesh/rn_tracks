import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  Provider as AuthProvider,
  Context as AuthContext,
} from "./src/context/AuthContext";

import AccountScreen from "./src/screens/AccountScreen";
import SigninScreen from "./src/screens/SigninScreen";
import SignupScreen from "./src/screens/SignupScreen";
import TrackCreateScreen from "./src/screens/TrackCreateScreen";
import TrackDetailScreen from "./src/screens/TrackDetailScreen";
import TrackListScreen from "./src/screens/TrackListScreen";
import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";

const Stack = createStackNavigator();
const LoginStack = createStackNavigator();
const TrackListStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

const LoginScreens = () => {
  return (
    <LoginStack.Navigator screenOptions={{ header: () => null }}>
      <LoginStack.Screen name="Signup" component={SignupScreen} />
      <LoginStack.Screen name="Signin" component={SigninScreen} />
    </LoginStack.Navigator>
  );
};

const TrackScreens = () => {
  return (
    <TrackListStack.Navigator>
      <TrackListStack.Screen name="TrackList" component={TrackListScreen} />
      <TrackListStack.Screen name="TrackDetail" component={TrackDetailScreen} />
    </TrackListStack.Navigator>
  );
};

const MainScreens = () => {
  return (
    <MainTab.Navigator>
      <MainTab.Screen name="Track" component={TrackScreens} />
      <MainTab.Screen name="TrackCreate" component={TrackCreateScreen} />
      <MainTab.Screen name="Account" component={AccountScreen} />
    </MainTab.Navigator>
  );
};

const Screens = () => {
  const { state, tryLocalSignin } = useContext(AuthContext);

  useEffect(() => {
    tryLocalSignin();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        {state.isLoading ? (
          <Stack.Screen name="ResolveAuth" component={ResolveAuthScreen} />
        ) : state.token ? (
          <Stack.Screen name="Main" component={MainScreens} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreens} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Screens />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
