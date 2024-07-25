import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
export default function Balance({ amount }) {
  const [showValue, setShowValue] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.itemTitle}>valor a receber</Text>
        <View style={styles.contentBox}>
          <Text style={styles.currencySymbol}>R$</Text>

          {showValue ? <Text style={styles.balance}>{amount}</Text> : <View  style={styles.skeleton}/>}
        </View>
      </View>
      <View style={styles.item}>
        <TouchableOpacity onPress={() => setShowValue(!showValue)}>
          {showValue ? (
            <MaterialIcons name="visibility" size={40} color="#DADADA" />
          ) : (
            <MaterialIcons name="visibility-off" size={40} color="#DADADA" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -24,
    paddingStart: 18,
    paddingEnd: 18,
    marginStart: 14,
    marginEnd: 14,
    borderRadius: 4,
    paddingTop: 22,
    paddingBottom: 22,
    zIndex: 99,
  },
  contentBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  item: {
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 20,
    color: "#DADADA",
  },
  currencySymbol: {
    color: "#DADADA",
    marginRight: 6,
  },
  balance: {
    fontSize: 22,
    color: "#2ecc71",
    fontWeight:"bold"
  },
  skeleton: {
    padding: 13,
    marginTop: 6,
    width: 80,
    height: 10,
    backgroundColor: "#DADADA",
    borderRadius: 8,
  },
});
