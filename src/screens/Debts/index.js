import React, { useState, useEffect, useContext } from "react";
import { Input, Button, Box, Stack, Checkbox } from "native-base";

import { Text, View, FlatList } from "react-native";
import { AuthContext } from "../../contexts/auth";
import { MaterialIcons } from "@expo/vector-icons";
import DebtCard from "../../components/DebtCard";
import Header from "../../components/Header";
import firestore from "@react-native-firebase/firestore";
import notFound from "../../assets/animations/93134-not-found.json";
import LottieView from "lottie-react-native";
import { styled } from "./styles";

const Debts = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [debts, setDebts] = useState([]);
  const [search, setSearch] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  const handleStart = async () => {
    const clientes = await firestore()
      .collection(`Users/${user.uid}/Clients`)
      .get()
      .then((rows) => {
        return rows.docs.map((doc) => {
          return {
            nome: doc.data().nome,
            tel: doc.data().tel,
            telResponsavel: doc.data().telResponsavel,
            id: doc.id,
            total: 0,
            totalServicos: 0,
            servicos: [],
          };
        });
      });
    clientes.map(async (line, key) => {
      await firestore()
        .collection(`Users/${user.uid}/Services`)
        .where("client.id", "==", line.id)
        .where("paid", "==", false)
        .get()
        .then((rows) => {
          rows.docs.map((row) => {
            const indx = clientes.findIndex(
              (line) => line.id == row.data().client.id
            );
            clientes[indx].total += Number(row.data().value);
            clientes[indx].totalServicos += 1;
            clientes[indx].servicos.push({
              id: row.id,
              serviceDate: row.data().serviceDate,
              value: row.data().value,
              paid: row.data().paid,
              receipt: row.data().receipt,
            });
          });
        });
      if (key == clientes.length - 1) {
        const newClientes = clientes.filter((row) => row?.servicos?.length > 0);
        setDebts(newClientes);
      }
    });
  };
  useEffect(() => {
    handleStart();
  }, []);
  useEffect(() => {
    if (!search) {
      setSearchResult([]);
    }
  }, [search]);

  const openDetail = (data) => {
    navigation.navigate("detailDebts", { debt: data });
  };

  const handleSearch = async () => {
    if (search) {
      const result = debts.filter(
        (row) => row.nome.toUpperCase().indexOf(search.toUpperCase()) >= 0
      );
      if (result) {
        setSearchResult(result);
      }
    } else {
      setSearchResult([]);
    }
  };

  return (
    <View style={styled.container}>
      <Header title="Cobrança" />
      <View style={styled.search}>
        <Input
          width="100%"
          borderRadius="4"
          py="3"
          px="1"
          fontSize="14"
          onChangeText={setSearch}
          InputRightElement={
            <Button
              size="xs"
              rounded="none"
              w="1/6"
              h="full"
              onPress={handleSearch}
            >
              <MaterialIcons size={20} color="#fff" name="search" />
            </Button>
          }
          placeholder="buscar"
        />
      </View>
      <Text style={styled.title}>Atendimentos em aberto</Text>

      {debts.length ? (
        <FlatList
          style={styled.list}
          data={searchResult?.length ? searchResult : debts}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <DebtCard data={item} openDetail={openDetail} />
          )}
        />
      ) : (
        <View style={styled.notFound}>
          <LottieView source={notFound} autoPlay loop />
        </View>
      )}
    </View>
  );
};
export default Debts;
