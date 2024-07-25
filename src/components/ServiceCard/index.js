import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Badge } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { fmtoNumber } from "../../util/formatNumberBr";

export default function ServiceCard({ data, onOpenFormUpdate }) {
  const { client, paid, receipt, serviceDate, value } = data;
  return (
    <TouchableOpacity onPress={() => onOpenFormUpdate(data)}>
      <View style={styles.container}>
        <View
          style={{
            ...styles.status,
            backgroundColor: paid ? "#2ecc71" : "#ea580c",
          }}
        />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{client?.nome}</Text>

            {paid && (
              <Badge colorScheme="success" alignSelf="center">
                PAGO
              </Badge>
            )}
            {!paid && (
              <Badge colorScheme="warning" alignSelf="center">
                PENDENTE
              </Badge>
            )}

            {receipt && (
              <Badge colorScheme="info" alignSelf="center">
                RECIBO
              </Badge>
            )}
          </View>
          <View style={styles.footer}>
            <View style={styles.info}>
              <MaterialIcons name="schedule" size={16} color="#8D919E" />
              <Text>
                {" "}
                {format(serviceDate?.toDate() || new Date(), "dd/MM/yyyy H:mm")}
              </Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.value}>R$ {fmtoNumber(value)}</Text>
            </View>
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
