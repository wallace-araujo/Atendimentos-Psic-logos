import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Input,
  Icon,
  useDisclose,
  Button,
  Stack,
  Checkbox,
} from "native-base";
import { View, FlatList } from "react-native";
import { AuthContext } from "../../contexts/auth";
import { MaterialIcons } from "@expo/vector-icons";
import Header from "../../components/Header";
import ServiceCard from "../../components/ServiceCard";
import firestore from "@react-native-firebase/firestore";
import notFound from "../../assets/animations/93134-not-found.json";
import LottieView from "lottie-react-native";
import { styled } from "./styles";
import UpdateService from "../../components/Forms/UpdateService";
import CreateService from "../../components/Forms/CreateService";

export function Service() {
  const { user } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclose();
  const {
    isOpen: isOpenFormUpdate,
    onOpen: onOpenFormUpdate,
    onClose: onCloseFormUpdate,
  } = useDisclose();
  const [services, setServices] = useState([]);
  const [editService, setEditService] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setData] = useState({});
  const [search, setSearch] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection(`Users/${user.uid}/Services`)
      .orderBy("createdAt", "desc")
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        setServices(data);
      });
    return () => subscriber();
  }, []);

  function serviceUPdate(serviceRow) {
    setData(serviceRow);
    onOpenFormUpdate();
    setEditService(serviceRow);
  }

  const handleSearchBtn = (type, value) => {
    if(value){
      const result = services.filter((row)=> row[type] ==  value)
      if(result){
        setSearchResult(result)
      }
  
    }else{
      setSearchResult([])
    }
  
  };

  const handleSearch  = async () => {
    if(search){
      const result = services.filter((row)=> row.client.name.toUpperCase().indexOf(search.toUpperCase()) >= 0)
      if(result){
        setSearchResult(result)
      }
    }else{
      setSearchResult([])
    }
 
  };

  return (
    <View style={styled.container}>
      <Header title="Atendimentos" />
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
              value="paid"
              size="md"
              colorScheme="success"
              onChange={(value) => handleSearchBtn("paid", value)}
            >
              Não pago
            </Checkbox>
            <Checkbox
              value="receipt"
              size="md"
              colorScheme="info"
              onChange={(value) => handleSearchBtn("receipt", value)}
            >
              Sem recibo
            </Checkbox>
          </Stack>
        </Box>
      </View>

      {services.length ? (
        <FlatList
          style={styled.list}
          data={searchResult?.length  ? searchResult: services}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ServiceCard data={item} onOpenFormUpdate={serviceUPdate} />
          )}
        />
      ) : (
        <View style={styled.notFound}>
          <LottieView source={notFound} autoPlay loop />
        </View>
      )}

      <Button onPress={onOpen}>Cadastrar atendimento</Button>
      <UpdateService
        formData={formData}
        setData={setData}
        isOpen={isOpenFormUpdate}
        onClose={onCloseFormUpdate}
        data={editService}
      />
      <CreateService isOpen={isOpen} onClose={onClose} />
    </View>
  );
}
