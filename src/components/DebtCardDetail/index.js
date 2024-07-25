import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Checkbox } from "native-base";
import { fmtoNumber } from "../../util/formatNumberBr";
import { format } from "date-fns";
export default function DebtCardDetail({ data, openDebt }) {
  const [showValue, setShowValue] = useState(false);

  const checkValue = () => {
    setShowValue(!showValue);
    openDebt(showValue, data);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => checkValue()}>
      <View style={styles.content}>
        <Checkbox
          isChecked={showValue}
          onPress={() => checkValue()}
          colorScheme="success"
          value="two"
        >
          {format(data?.serviceDate?.toDate(), "dd/MM/yyyy hh:mm")}
        </Checkbox>
        <Text style={styles.value}>R$ {fmtoNumber(data.value)}</Text>
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
  value: {
    color: "#2ecc71",
    fontSize: 16,
    fontWeight: "bold",
  },
});
