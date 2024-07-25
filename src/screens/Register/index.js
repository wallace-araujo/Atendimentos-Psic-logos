import React, { useState,useEffect,useRef } from "react";
import { TouchableOpacity } from "react-native";
import {
  Center,
  VStack,
  HStack,
  Box,
  Heading,
  FormControl,
  Input,
  Icon,
  Button,
  WarningOutlineIcon,
  Text,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";

import { styled } from "./styles";
export function Register({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const myRef =  useRef({});

  useEffect(() => {
    const styleObj = {
      backgroundColor: "#0284c7",
      borderColor: "#0284c7",
      borderWidth: 1,
      borderRadius: 4
    }; 

    myRef.current.setNativeProps({
      style: styleObj
    });
  }, [myRef]);

  function validate() {
    if (name === "" || name.length <= 2) {
      setErrors({ ...errors, name: "Name is required" });
      return false;
    } else if (email.length < 3) {
      setErrors({ ...errors, email: "email is too short" });
      return false;
    } else if (password.length < 6) {
      setErrors({ ...errors, password: "password is required" });
      return false;
    }
    return true;
  }

  function handleNewAccount() {
    setIsLoading(true);
    const valid = validate();
    if (valid) {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async () => {
          await auth().currentUser.updateProfile({ displayName: name });
          console.log("conta criada com sucesso!!");
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            setErrorMsg("Esse endereço de email já esta em uso!");
            //console.log("Esse endereço de email já esta em uso!");
          }

          if (error.code === "auth/invalid-email") {
            setErrorMsg("Esse endereço de e-mail é inválido!");
            // console.log("Esse endereço de e-mail é inválido!");
          }
          setIsLoading(false);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }

  return (
    <Center height="full" backgroundColor="muted.200">
      <Icon
        as={<MaterialIcons name="account-circle" />}
        size={150}
        color="#0284c7"
      />
      <VStack width="full" p={10}>
        <Box width="full">
          <Heading color="coolGray.700">Cadastrar</Heading>
          <FormControl isRequired isInvalid={"name" in errors}>
            <FormControl.Label>Nome</FormControl.Label>
            <Input
              type="text"
              name="name"
              size="lg"
              backgroundColor="light.50"
              placeholder="nome"
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="person" />}
                  size={5}
                  ml={2}
                  color="muted.400"
                />
              }
              onChangeText={setName}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              Nome vazio.
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={"email" in errors}>
            <FormControl.Label>E-mail</FormControl.Label>
            <Input
              type="text"
              name="email"
              size="lg"
              backgroundColor="light.50"
              placeholder="seu@email.com.br"
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="email" />}
                  size={5}
                  ml={2}
                  color="muted.400"
                />
              }
              onChangeText={setEmail}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              E-mail inválido.
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={"password" in errors}>
            <FormControl.Label>Senha</FormControl.Label>
            <Input
              placeholder="sua senha"
              type="password"
              name="password"
              size="lg"
              backgroundColor="light.50"
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="lock" />}
                  size={5}
                  ml={2}
                  color="muted.400"
                />
              }
              onChangeText={setPassword}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              Erro deve conter pelo menos 6 caracteres.
            </FormControl.ErrorMessage>
          </FormControl>
          <Button
            mt={7}
            ref={myRef}
            isLoading={isLoading}
            isLoadingText="cadastrando"
            colorScheme="primary"
            onPress={handleNewAccount}
          >
            cadastrar
          </Button>
          <HStack mt="6" justifyContent="center">
            <TouchableOpacity
              style={styled.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={28} color="#374151" />
              <Text style={styled.textFooter}>Eu já tenho uma conta</Text>
            </TouchableOpacity>
          </HStack>
        </Box>
      </VStack>
    </Center>
  );
}
