import React, { useState} from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { fmtoNumber } from "../../util/formatNumberBr";
export default function Movements({ data }) {
  const [showValue, setShowValue] = useState(false);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setShowValue(!showValue)}
    >
      <Text style={styles.date}>{data.date}</Text>
      <View style={styles.content}>
        <Text style={styles.name}>{data.name}</Text>
        {showValue ? (
          <Text style={styles.value}>R$ {fmtoNumber(data.value)}</Text>
        ) : (
          <View style={styles.skeleton}/>
        )}
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#DADADA",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 8,
  },
  date: {
    color: "#DADADA",
    fontWeight: "bold",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    color: "#2ecc71",
    fontSize: 16,
    fontWeight: "bold",
  },
  skeleton: {
    marginTop: 6,
    width: 80,
    height: 10,
    backgroundColor: "#DADADA",
    borderRadius: 8,
  },
});
