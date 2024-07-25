import React, { useState, useEffect, useContext } from "react";
import { Input, Button, Box, Stack, Checkbox } from "native-base";

import { Text, View, FlatList } from "react-native";
import { AuthContext } from "../../contexts/auth";
import { MaterialIcons } from "@expo/vector-icons";
import ClientCard from "../../components/ClientCard";
import Header from "../../components/Header";
import firestore from "@react-native-firebase/firestore";
import notFound from "../../assets/animations/93134-not-found.json";
import LottieView from "lottie-react-native";
import { styled } from "./styles";

export function Clients({ navigation }) {
  const { user } = useContext(AuthContext);
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState([]);
  const [searchBtn, setSearchBtn] = useState({ ativo: true, inativo: true });
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection(`Users/${user.uid}/Clients`)
      .orderBy("createdAt", "desc")
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });

        setClients(data);
      });
    return () => subscriber();
  }, []);

  useEffect(() => {
    if (!search) {
      setSearchResult([]);
    }
  }, [search]);

  const clientUpdate = (client) => {
    navigation.navigate("formClient", { idProfile: client });
  };

  const handleSearch = async () => {
    if (search) {
      const result = clients.filter(
        (row) => row.nome.toUpperCase().indexOf(search.toUpperCase()) >= 0
      );
      if (result) {
        setSearchResult(result);
      }
    } else {
      setSearchResult([]);
    }
  };

  const handleSearchBtn = (type, value) => {
    searchBtn[type] = value;
    setSearchBtn(searchBtn);

    if (searchBtn?.ativo && searchBtn?.inativo) {
      setSearchResult(clients);
    } else if (searchBtn?.ativo || searchBtn?.inativo) {
      const newStatus = searchBtn?.ativo ? "1" : "2";
      const result = clients.filter((row) => row.status === newStatus);
      setSearchResult(result || []);
    } else {
      setSearchResult([]);
    }
  };

  return (
    <View style={styled.container}>
      <Header title="Clientes" />
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
          placeholder="buscar clientes"
        />

        <Box alignItems="center" style={styled.checkFilter}>
          <Stack
            direction={{
              base: "row",
              md: "row",
            }}
            space={3}
            alignItems="flex-start"
          >
            <Checkbox
              value="1"
              size="md"
              defaultIsChecked
              colorScheme="success"
              onChange={(value) => handleSearchBtn("ativo", value)}
            >
              Ativo
            </Checkbox>
            <Checkbox
              value="2"
              size="md"
              defaultIsChecked
              colorScheme="danger"
              onChange={(value) => handleSearchBtn("inativo", value)}
            >
              Inativo
            </Checkbox>
          </Stack>
        </Box>
      </View>
      <Text style={styled.title}>Clientes cadastrados</Text>
      {clients.length ? (
        <FlatList
          style={styled.list}
          data={
            searchResult?.length || !searchBtn?.inativo || !searchBtn?.inativo
              ? searchResult
              : clients
          }
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ClientCard data={item} onOpenFormUpdate={clientUpdate} />
          )}
        />
      ) : (
        <View style={styled.notFound}>
          <LottieView source={notFound} autoPlay loop />
        </View>
      )}

      <Button onPress={() => navigation.navigate("formClient")}>
        Cadastrar cliente
      </Button>
    </View>
  );
}
