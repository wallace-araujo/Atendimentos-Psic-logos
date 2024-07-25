import React, { useEffect, useState, useContext } from "react";
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
  Select,
} from "native-base";
import { TouchableOpacity } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { AuthContext } from "../../../contexts/auth";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { format } from "date-fns";
export default function CreateService({ isOpen, onClose }) {
  const { user } = useContext(AuthContext);
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState("");
  const [clientSelected, setClientSelected] = useState({});
  const [value, setValue] = useState("");
  const [paid, setPaid] = useState(false);
  const [receipt, setReceipt] = useState(false);
  const [serviceDate, setServiceDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const subscriber = firestore()
      .collection(`Users/${user.uid}/Clients`)
      .orderBy("createdAt", "desc")
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            nome: doc.data().nome,
            value: doc.data().value,
            status: doc.data().status,
          };
        });
        const newData = data.filter((row) => row.status == "1");
        setClients(newData);
      });
    return () => subscriber();
  }, []);

  useEffect(() => {
    if (client) {
      const kind = clients.find((line) => line.id === client);
      setClientSelected(kind);
      setValue(kind?.value);
    }
  }, [client]);

  function handleService() {
    setIsLoading(true);
    firestore()
      .collection(`Users/${user.uid}/Services`)
      .add({
        serviceDate: serviceDate,
        client: {
          id: clientSelected?.id,
          nome: clientSelected?.nome,
        },
        value: value,
        paid: paid,
        receipt: receipt,
        createdAt: new Date(),
      })
      .then(() => {
        onClose();
      })
      .finally(() => setIsLoading(false));
  }

  function onChange(event, selectedDate) {
    setServiceDate(selectedDate);
  }

  function showMode() {
    DateTimePickerAndroid.open({
      value: new Date(),
      locale: "pt-br",
      onChange,
      mode: "date",
      // display:"spinner"
    });
  }

  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <VStack width="full" p={10}>
            <Box width="full">
              <Heading
                color="coolGray.700"
                style={{ marginTop: -30, textAlign: "center" }}
              >
                Cadastrar atendimento
              </Heading>
              <FormControl isRequired>
                <FormControl.Label>Data do atendimento</FormControl.Label>
                <TouchableOpacity onPressIn={showMode}>
                  <Input
                    type="date"
                    backgroundColor="#DADADA"
                    placeholder="Data"
                    editable={false}
                    value={format(serviceDate, "dd/MM/yyyy")}
                  />
                </TouchableOpacity>
              </FormControl>
              <FormControl isRequired>
                <FormControl.Label>Clientes</FormControl.Label>
                <Select
                  selectedValue={client}
                  minWidth="200"
                  backgroundColor="#DADADA"
                  accessibilityLabel="Selecione o cliente"
                  placeholder="Selecione o cliente"
                  mt={1}
                  onValueChange={(itemValue) => setClient(itemValue)}
                >
                  {clients.map((doc) => {
                    return (
                      <Select.Item
                        key={doc.id}
                        label={doc.nome}
                        value={doc.id}
                      />
                    );
                  })}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormControl.Label>Valor</FormControl.Label>
                <Input
                  value={value}
                  keyboardType="numeric"
                  backgroundColor="#DADADA"
                  placeholder="100,00"
                  onChangeText={setValue}
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
                  value="Pago"
                  size="md"
                  colorScheme="green"
                  onChange={setPaid}
                >
                  Pago
                </Checkbox>

                <Checkbox
                  value="Recibo"
                  size="md"
                  colorScheme="orange"
                  onChange={setReceipt}
                >
                  Recibo
                </Checkbox>
              </View>

              <Button
                mt={7}
                isLoading={isLoading}
                isLoadingText="cadastrando"
                colorScheme="primary"
                onPress={handleService}
              >
                cadastrar
              </Button>
            </Box>
          </VStack>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
}
