import React, { useState, useContext } from "react";
import {
  View,
  Heading,
  Box,
  Actionsheet,
  Button,
  VStack,
  IconButton,
  TextArea,
} from "native-base";
import firestore from "@react-native-firebase/firestore";
import { AuthContext } from "../../../contexts/auth";
import { MaterialIcons } from "@expo/vector-icons";

export default function ShareMsg({
  isOpen,
  onClose,
  setSwitchShare,
  setTextShare,
  textShare,
  editShare,
}) {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const onCloseShare = () => {
    onClose();
    setSwitchShare(false);
  };

  const handleShare = () => {
    if (editShare && textShare) {
      firestore()
        .collection(`Users/${user.uid}/Share`)
        .doc(editShare[0]?.id)
        .update({
          shareMsg: textShare,
        })
        .then(() => {
          onClose();
          setIsLoading(false);
        })
        .catch((error) => setIsLoading(false))
        .finally(() => {
          setIsLoading(false);
          onClose();
        });
    } else if (textShare) {
      setIsLoading(true);
      firestore()
        .collection(`Users/${user.uid}/Share`)
        .add({
          shareMsg: textShare,
        })
        .then(() => {
          onClose();
          setIsLoading(false);
        })
        .finally(() => {
          onClose();
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose} disableOverlay>
        <Actionsheet.Content>
          <VStack width="full" p={10}>
            <Box width="full">
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 30,
                }}
              >
                <Heading color="coolGray.700">Cadastrar texto padrão</Heading>
                <IconButton
                  onPress={onCloseShare}
                  size="sm"
                  colorScheme="danger"
                  variant="solid"
                  _icon={{
                    as: MaterialIcons,
                    name: "close",
                  }}
                />
              </View>

              <TextArea
                placeholder="escreva a mensagem aqui.."
                value={textShare}
                onChangeText={(content) => setTextShare(content)}
              />

              <Button
                mt={7}
                isLoading={isLoading}
                isLoadingText={editShare ? "atualizando" : "cadastrando"}
                colorScheme="primary"
                onPress={handleShare}
              >
                {editShare ? "atualizar" : "cadastrar"}
              </Button>
            </Box>
          </VStack>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
}
