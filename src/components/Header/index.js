import React, { useState, useContext } from "react";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Menu, Button } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexts/auth";
const statusBarHeight = StatusBar.currentHeight
  ? StatusBar.currentHeight + 22
  : 64;

export default function Header({ title }) {
  const navigation = useNavigation();
  const { user,logout } = useContext(AuthContext);
  const [showMenu] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {title ? (
          <>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="reply" size={40} color="#f0f9ff" />
            </TouchableOpacity>
            <Text style={styles.userName}>{title}</Text>
          </>
        ) : (
          <>
            <Text style={styles.userName}>{user?.displayName ||user.email}</Text>
            <Menu
              w="160"
              shouldOverlapWithTrigger={showMenu}
              trigger={(triggerProps) => {
                return (
                  <Button alignSelf="center" variant="link" {...triggerProps}>
                    <MaterialIcons
                      name="account-circle"
                      size={40}
                      color="#f0f9ff"
                    />
                  </Button>
                );
              }}
            >
              <Menu.Item onPress={() => logout()}>sair</Menu.Item>
            </Menu>
            {/* <TouchableOpacity onPress={() => console.log("register")}>
              <MaterialIcons name="account-circle" size={40} color="#f0f9ff" />
            </TouchableOpacity> */}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0284c7",
    paddingTop: statusBarHeight,
    flexDirection: "row",
    paddingStart: 16,
    paddingEnd: 16,
    paddingBottom: 44,
  },
  content: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userName: {
    fontSize: 18,
    color: "#f0f9ff",
    fontWeight: "bold",
  },
});
