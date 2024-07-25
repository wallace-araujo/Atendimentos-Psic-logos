import React, { useState,useRef,useEffect } from "react";
import {
  Center,
  VStack,
  Box,
  Heading,
  FormControl,
  Input,
  Icon,
  Button,
  WarningOutlineIcon,
  Text,
  View,
} from "native-base";
import { Alert, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { styled } from "./styles";
export function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    if (email.length < 3) {
      setErrors({ ...errors, email: "email is too short" });
      return false;
    } else if (password.length < 6) {
      setErrors({ ...errors, password: "password is required" });
      return false;
    }
    return true;
  }

  function handleLogin() {
    setIsLoading(true);
    const valid = validate();
    if (valid) {
      auth()
        .signInWithEmailAndPassword(email.trim(), password)
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            console.log("That email address is already in use!");
          }

          if (error.code === "auth/invalid-email") {
            console.log("That email address is invalid!");
          }
          setIsLoading(false);
          console.error(error);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }

  function validateEmail() {
    if (email.length < 3) {
      setErrors({ ...errors, email: "email is too short" });
      return false;
    }
    return true;
  }

  function handleForgotPassword() {
    const valid = validateEmail();
    if (valid) {
      auth()
        .sendPasswordResetEmail(email.trim())
        .then(() =>
          Alert.alert("Redefinir senha", "Enviamos um e-mail para você")
        )
        .catch((error) =>
          Alert.alert("Redefinir senha", "e-mail invalido ou não cadastrado")
        );
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
          <Heading color="coolGray.700">Entrar</Heading>
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
                  as={<MaterialIcons name="person" />}
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
              E-mail inválido
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
            onPress={handleLogin}
            isLoading={isLoading}
            isLoadingText="entrando.."
          >
            Entrar
          </Button>

          <View style={styled.footerBtn}>
            <TouchableOpacity
              style={styled.container}
              onPress={() => navigation.navigate("register")}
            >
              <MaterialIcons name="person-add" size={28} color="#374151" />
              <Text style={styled.textFooter}>Criar conta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styled.container}
              onPress={handleForgotPassword}
            >
              <MaterialIcons name="email" size={28} color="#374151" />
              <Text style={styled.textFooter}>Esqueci senha</Text>
            </TouchableOpacity>
          </View>
        </Box>
      </VStack>
    </Center>
  );
}
