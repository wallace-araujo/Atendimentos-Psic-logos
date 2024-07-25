import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Badge } from "native-base";
import { fmtoNumber } from "../../util/formatNumberBr";
import { format } from "date-fns";
export default function DebtCard({ data, openDetail }) {
  const { nome, total, totalServicos } = data;
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => openDetail(data)}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{nome}</Text>

          <Text style={styles.value}>R$ {fmtoNumber(total)}</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.info}>
            <Text>{totalServicos} atendimentos </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    overflow: "hidden",
    marginStart: 14,
    marginEnd: 14,
    borderRadius: 10,
    marginBottom: 20,
    height: 94,
  },
  status: {
    width: 10,
    height: 94,
  },
  content: {
    flex: 1,
    height: 94,
    padding: 8,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
  },
  title: {
    flex: 1,
    fontSize: 18,
    marginBottom: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    color: "#2ecc71",
    fontSize: 16,
    fontWeight: "bold",
  },
});
