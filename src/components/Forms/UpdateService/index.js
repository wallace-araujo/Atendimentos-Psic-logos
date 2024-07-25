import React, { useState, useContext, useRef } from "react";
import {
  View,
  Heading,
  Box,
  Input,
  Actionsheet,
  Button,
  FormControl,
  VStack,
  Checkbox,
  IconButton,
  AlertDialog,
} from "native-base";
import firestore from "@react-native-firebase/firestore";
import { AuthContext } from "../../../contexts/auth";
import { MaterialIcons } from "@expo/vector-icons";
import AlertModal from "../../AlertModal";
export default function UpdateService({
  isOpen,
  onClose,
  data,
  formData,
  setData,
}) {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const cancelRef = useRef(null);

  function handleService() {
    setIsLoading(true);

    firestore()
      .collection(`Users/${user.uid}/Services`)
      .doc(formData.id)
      .update(formData)
      .then(() => {
        console.log("User updated!");
        onClose();
        setIsLoading(false);
      })
      .catch((error) => setIsLoading(false))
      .finally(() => setIsLoading(false));
  }

  const handleDelete = () => {
    firestore()
      .collection(`Users/${user.uid}/Services`)
      .doc(formData.id)
      .delete()
      .then(() => {
        console.log("User deleted!");
      })
      .catch((error) => {
        console.log("error deleted service");
        onClose();
        setIsOpenAlert(false)
      })
      .finally(() => {
        onClose();
        setIsOpenAlert(false)
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
                <Heading color="coolGray.700">Atualizar atendimento</Heading>
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

              <FormControl isDisabled>
                <FormControl.Label>Cliente</FormControl.Label>
                <Input
                  value={data?.client?.name}
                  backgroundColor="#DADADA"
                  placeholder="nome"
                />
              </FormControl>

              <FormControl isRequired>
                <FormControl.Label>Valor</FormControl.Label>
                <Input
                  value={formData?.value}
                  keyboardType="numeric"
                  backgroundColor="#DADADA"
                  placeholder="100,00"
                  onChangeText={(value) => setData({ ...formData, value })}
                />
              </FormControl>
              <View
                style={{
                  margin: 10,
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  defaultIsChecked={formData?.paid}
                  value="Pago"
                  size="md"
                  colorScheme="green"
                  onChange={(value) => setData({ ...formData, paid: value })}
                >
                  Pago
                </Checkbox>

                <Checkbox
                  defaultIsChecked={formData?.receipt}
                  value="Recibo"
                  size="md"
                  colorScheme="orange"
                  onChange={(value) => setData({ ...formData, receipt: value })}
                >
                  Recibo
                </Checkbox>
              </View>
              <View>
                <Button
                  mt={7}
                  isLoading={isLoading}
                  isLoadingText="atualizando"
                  colorScheme="primary"
                  onPress={handleService}
                >
                  atualizar
                </Button>
              </View>
            </Box>
          </VStack>
        </Actionsheet.Content>
      </Actionsheet>
      <AlertModal
        cancelRef={cancelRef}
        isOpen={isOpenAlert}
        onClose={onCloseModal}
        handle={handleDelete}
        title="Deletar atendimento"
        msg="essa ação é irreversível. deseja continuar ?"
      />
    </>
  );
}
