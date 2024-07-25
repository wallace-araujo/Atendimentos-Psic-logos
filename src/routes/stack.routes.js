import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../screens/Home";
import { Login } from "../screens/Login";
import { Register } from "../screens/Register";
import { AuthContext } from "../contexts/auth";
import { Clients } from "../screens/Clients";
import { Service } from "../screens/Service";
import Debts from "../screens/Debts";
import DetailDebt from "../screens/Debts/detailDebt";
import CreateClient from "../components/Forms/CreateClient";



const { Navigator, Screen } = createNativeStackNavigator();

export function StackRoutes() {
  const { user } = useContext(AuthContext);
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Screen name="home" component={Home} />
          <Screen name="clients" component={Clients} />
          <Screen name="service" component={Service} />
          <Screen name="formClient" component={CreateClient} />
          <Screen name="debts" component={Debts} />
          <Screen name="detailDebts" component={DetailDebt} />
          
        </>
      ) : (
        <>
          <Screen name="login" component={Login} />
          <Screen name="register" component={Register} />
        </>
      )}
    </Navigator>
  );
}
