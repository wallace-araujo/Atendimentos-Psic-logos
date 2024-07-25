import React, { useState, useContext, useRef } from "react";
import {
  Heading,
  Box,
  Input,
  Actionsheet,
  Button,
  FormControl,
  VStack,
  View,
  IconButton,
} from "native-base";
import { AuthContext } from "../../../contexts/auth";
import { MaterialIcons } from "@expo/vector-icons";
import AlertModal from "../../AlertModal";
import firestore from "@react-native-firebase/firestore";

export default function UpdateClient({ isOpen, onClose, formData, setData }) {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const cancelRef = useRef(null);

  const handleClient = () => {
    setIsLoading(true);
    firestore()
      .collection(`Users/${user.uid}/Clients`)
      .doc(formData.id)
      .update(formData)
      .then(() => {
        console.log("User updated!");
        onClose();
        setIsLoading(false);
      })
      .catch((error) => setIsLoading(false))
      .finally(() => setIsLoading(false));
  };

  const handleDelete = () => {
    firestore()
      .collection(`Users/${user.uid}/Clients`)
      .doc(formData.id)
      .delete()
      .then(() => {
        console.log("User deleted!");
      })
      .catch((error) => {
        console.log("error deleted client");
        onClose();
        setIsOpenAlert(false);
      })
      .finally(() => {
        onClose();
        setIsOpenAlert(false);
      });
  };

  const onCloseModal = () => setIsOpenAlert(false);

  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <VStack width="full" p={10}>
            <Box width="full">
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Heading color="coolGray.700">Atualizar cliente</Heading>
                <IconButton
                  onPress={() => setIsOpenAlert(!isOpenAlert)}
                  size="sm"
                  colorScheme="danger"
                  variant="solid"
                  _icon={{
                    as: MaterialIcons,
                    name: "close",
                  }}
                />
              </View>

              <FormControl isRequired>
                <FormControl.Label>Nome</FormControl.Label>
                <Input
                  type="text"
                  value={formData?.name}
                  backgroundColor="#DADADA"
                  placeholder="Nome"
                  onChangeText={(value) =>
                    setData({ ...formData, name: value })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormControl.Label>Valor</FormControl.Label>
                <Input
                  value={formData?.value}
                  keyboardType="numeric"
                  type="text"
                  backgroundColor="#DADADA"
                  placeholder="100,00"
                  onChangeText={(value) => setData({ ...formData, value })}
                />
              </FormControl>
              <Button
                mt={7}
                isLoading={isLoading}
                isLoadingText="atualizando"
                colorScheme="primary"
                onPress={handleClient}
              >
                atualizar
              </Button>
            </Box>
          </VStack>
        </Actionsheet.Content>
      </Actionsheet>
      <AlertModal
        cancelRef={cancelRef}
        isOpen={isOpenAlert}
        onClose={onCloseModal}
        handle={handleDelete}
        title="Deletar Cliente"
        msg="essa ação é irreversível. deseja continuar ?"
      />
    </>
  );
}
