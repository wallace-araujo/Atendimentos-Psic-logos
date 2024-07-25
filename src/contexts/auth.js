import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const navigation = useNavigation()

  function onAuthStateChanged(user) {
    setUser(user);
    setUserStorage(user);
    if (initializing) setInitializing(false);
  }

  function setUserStorage(newUser) {
    AsyncStorage.setItem("@tp", JSON.stringify(newUser));
  }
  async function getUserStorage() {
    const json = await AsyncStorage.getItem("@tp");

    if (!json) {
      return null;
    }
    const userStorage = JSON.parse(json);
    if (userStorage) {
      // console.log('userStorage',userStorage)
      setUser(userStorage ?? null);
    }

    return userStorage ?? null;
  }

  useEffect(() => {
    getUserStorage();

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return () => subscriber();
  }, []);

  async function logout() {
    await AsyncStorage.removeItem("@tp");
    auth().signOut();
  }
  return (
    <AuthContext.Provider value={{ user,logout }}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
