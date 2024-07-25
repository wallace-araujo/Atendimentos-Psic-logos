import React from "react";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import { Login } from "./src/screens/Login";
import { Routes } from "./src/routes";

export default function App() {
  return (
    <NativeBaseProvider>
      <StatusBar style="auto" />

      <Routes />
    </NativeBaseProvider>
  );
}
