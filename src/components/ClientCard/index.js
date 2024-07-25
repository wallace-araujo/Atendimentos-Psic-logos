import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Badge } from "native-base";
import { fmtoNumber } from "../../util/formatNumberBr";
import { format } from "date-fns";
export default function ClientCard({ data, onOpenFormUpdate }) {
  const { createdAt, status, nome, value } = data;
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onOpenFormUpdate(data)}
    >
      <View
        style={{
          ...styles.status,
          backgroundColor: status == "1" ? "#2ecc71" : "#e11d48",
        }}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{nome}</Text>

          {status == "1" && (
            <Badge colorScheme="success" alignSelf="center">
              ATIVO
            </Badge>
          )}
          {status == "2" && (
            <Badge colorScheme="danger" alignSelf="center">
              INATIVO
            </Badge>
          )}
        </View>
        <View style={styles.footer}>
          <View style={styles.info}>
            <MaterialIcons name="schedule" size={16} color="#8D919E" />
            <Text>
              {format(createdAt?.toDate() || new Date(), "dd/MM/yyyy H:mm")}
            </Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.value}>R$ {fmtoNumber(value)}</Text>
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
