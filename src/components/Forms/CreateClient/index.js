import React, { useState, useContext, useRef } from "react";
import {
  Heading,
  Box,
  Input,
  Actionsheet,
  FormControl,
  VStack,
  Divider,
  View,
  Button,
  ScrollView,
  HStack,
  Select,
  Radio,
  Stack,
  Center,
} from "native-base";
import { TouchableOpacity } from "react-native";
import { AuthContext } from "../../../contexts/auth";
import { MaterialIcons } from "@expo/vector-icons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import firestore from "@react-native-firebase/firestore";
import { format } from "date-fns";
import Header from "../../Header";
import { styled } from "./styles";
import { useForm, Controller } from "react-hook-form";
import AlertModal from "../../AlertModal";

const grauRelacionamento = [
  {
    id: "Cônjuge",
    name: "Cônjuge/Companheiro",
  },
  {
    id: "Pai/Mãe",
    name: "Pai/Mãe",
  },
  {
    id: "Irmão/Irmã",
    name: "Irmão/Irmã",
  },
  {
    id: "Outro",
    name: "Outro",
  },
];

const CreateClient = ({ navigation, route, isOpen, onClose }) => {
  const profile = route?.params?.idProfile || false;

  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [birthdayDate, setBirthdayDate] = useState(
    profile ? new Date(profile?.birthdayDate?.toDate()) : new Date()
  );
  const [dateLimit, setDateLimit] = useState(
    profile ? new Date(profile?.dateLimit?.toDate()) : new Date()
  );
  const [editProfile] = useState(profile || false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const cancelRef = useRef(null);

  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      status: profile?.status || "1",
      nome: profile?.nome || "",
      value: profile?.value || "",
      dateLimit: profile?.dateLimit ? new Date(profile?.dateLimit?.toDate()) : new Date(),
      nomeFull: profile?.nomeFull || "",
      birthdayDate: profile?.birthdayDate ?new Date(profile?.birthdayDate?.toDate()) :  new Date(),
      tel: profile?.tel || "",
      email: profile?.email || "",
      endereco: profile?.endereco || "",
      cidade: profile?.cidade || "",
      estado: profile?.estado || "",
      nomeResponsavel: profile?.nomeResponsavel || "",
      telResponsavel: profile?.telResponsavel || "",
      emailResponsavel: profile?.emailResponsavel || "",
      nomeEmergencia: profile?.nomeEmergencia || "",
      telEmergencia: profile?.telEmergencia || "",
      grauEmergencia: profile?.grauEmergencia || "",
    },
  });

  const onSubmit = (data) => {
    setIsLoading(true);
    editProfile ? onUpdateClient(data) : onCreatClient(data);
  };

  const onCreatClient = (data) => {
    firestore()
      .collection(`Users/${user.uid}/Clients`)
      .add({
        ...data,
        createdAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log("User added!");
        navigation.goBack();
        onClose();
      })
      .catch((error) => {
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
        navigation.goBack();
      });
  };

  const onUpdateClient = (data) => {
    firestore()
      .collection(`Users/${user.uid}/Clients`)
      .doc(profile.id)
      .update(data)
      .then(() => {
        console.log("User updated!");
        navigation.goBack();
        setIsLoading(false);
      })
      .catch((error) => setIsLoading(false))
      .finally(() => {
        setIsLoading(false);
        navigation.goBack();
      });
  };

  const handleDelete = () => {
    firestore()
      .collection(`Users/${user.uid}/Clients`)
      .doc(profile.id)
      .delete()
      .then(() => {
        console.log("User deleted!");
      })
      .catch((error) => {
        console.log("error deleted client");
        navigation.goBack();
        setIsOpenAlert(false);
      })
      .finally(() => {
        navigation.goBack();
        setIsOpenAlert(false);
      });
  };

  const onChangeDate = (type, date) => {
    if (type == "dateLimit") {
      setDateLimit(date);
    } else {
      setBirthdayDate(date);
    }
    setValue(type, date);
  };
  const showDate = (type) => {
    DateTimePickerAndroid.open({
      value: new Date(),
      locale: "pt-br",
      onChange: (e, date) => {
        onChangeDate(type, date);
      },
      mode: "date",
    });
  };

  const onCloseModal = () => setIsOpenAlert(false);

  return (
    <View style={styled.container}>
      <Header title=" " />
      <View style={styled.search}>
        <Heading
          color="coolGray.700"
          style={{ textAlign: "center", marginBottom: "5%" }}
        >
          {editProfile ? "Atualizar" : "Cadastrar"} cliente
        </Heading>

        <Center>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Radio.Group
                name="exampleGroup"
                defaultValue={value}
                accessibilityLabel="pick a size"
                onChange={(val) => onChange(val)}
              >
                <Stack
                  direction={{
                    base: "row",
                  }}
                  alignItems={{ base: "flex-start", md: "center" }}
                  space={4}
                >
                  <Radio value="1" colorScheme="green" size="md" my={1}>
                    Ativo
                  </Radio>
                  <Radio value="2" colorScheme="red" size="md" my={1}>
                    Inativo
                  </Radio>
                </Stack>
              </Radio.Group>
            )}
            name="status"
            rules={{ required: "campo obrigatório *" }}
          />
        </Center>
      </View>
      <ScrollView h="80">
        <VStack width="full" p={8}>
          <Box width="full">
            <FormControl isRequired isInvalid={"nome" in errors}>
              <FormControl.Label>Nome</FormControl.Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    type="text"
                    backgroundColor="#DADADA"
                    placeholder="Nome"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="nome"
                rules={{ required: "campo obrigatório *", minLength: 3 }}
              />
              <FormControl.ErrorMessage>
                {errors.nome?.message
                  ? errors.nome?.message
                  : "nome muito curto."}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={"value" in errors}>
              <FormControl.Label>Valor</FormControl.Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    keyboardType="numeric"
                    type="text"
                    backgroundColor="#DADADA"
                    placeholder="100,00"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="value"
                rules={{ required: "campo obrigatório *" }}
              />
              <FormControl.ErrorMessage>
                {errors.value?.message}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl>
              <FormControl.Label>
                Data limite do valor diferenciado
              </FormControl.Label>
              <TouchableOpacity onPressIn={() => showDate("dateLimit")}>
                <Input
                  type="date"
                  backgroundColor="#DADADA"
                  placeholder="Data limite do valor diferenciado"
                  editable={false}
                  value={format(dateLimit, "dd/MM/yyyy")}
                />
              </TouchableOpacity>
            </FormControl>

            <Divider my="6" />
            <Heading size="md" color="coolGray.700" style={{ marginTop: -20 }}>
              Dados Pessoais
            </Heading>
            <Divider my="2" />

            <FormControl isRequired isInvalid={"nomeFull" in errors}>
              <FormControl.Label>Nome Completo</FormControl.Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    type="text"
                    backgroundColor="#DADADA"
                    placeholder="Nome"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="nomeFull"
                rules={{ required: "campo obrigatório *", minLength: 3 }}
              />
              <FormControl.ErrorMessage>
                {errors.nomeFull?.message
                  ? errors.nomeFull?.message
                  : "nome muito curto."}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl>
              <FormControl.Label>Data de Nascimento</FormControl.Label>
              <TouchableOpacity onPressIn={() => showDate("birthdayDate")}>
                <Input
                  type="date"
                  backgroundColor="#DADADA"
                  placeholder="Data de Nascimento"
                  editable={false}
                  value={format(birthdayDate, "dd/MM/yyyy")}
                />
              </TouchableOpacity>
            </FormControl>

            <FormControl isRequired isInvalid={"tel" in errors}>
              <FormControl.Label>Telefone</FormControl.Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    keyboardType="numeric"
                    type="text"
                    backgroundColor="#DADADA"
                    placeholder="Telefone"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="tel"
                rules={{ required: "campo obrigatório *" }}
              />
              <FormControl.ErrorMessage>
                {errors.tel?.message}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={"email" in errors}>
              <FormControl.Label>E-mail</FormControl.Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    type="text"
                    backgroundColor="#DADADA"
                    placeholder="E-mail"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="email"
                rules={{ required: false }}
              />
              <FormControl.ErrorMessage>
                {errors.email?.message}
              </FormControl.ErrorMessage>
            </FormControl>

            <Divider my="6" />
            <Heading size="md" color="coolGray.700" style={{ marginTop: -20 }}>
              Endereço
            </Heading>
            <Divider my="2" />

            <FormControl isInvalid={"endereco" in errors}>
              <FormControl.Label>Endereço</FormControl.Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    type="text"
                    backgroundColor="#DADADA"
                    placeholder="Endereço"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="endereco"
                rules={{ required: false }}
              />
              <FormControl.ErrorMessage>
                {errors.endereco?.message}
              </FormControl.ErrorMessage>
            </FormControl>
            <HStack space={2} alignItems="center">
              <FormControl
                style={styled.address}
                isInvalid={"cidade" in errors}
              >
                <FormControl.Label>Cidade</FormControl.Label>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      type="text"
                      backgroundColor="#DADADA"
                      placeholder="Cidade"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="cidade"
                  rules={{ required: false }}
                />
                <FormControl.ErrorMessage>
                  {errors.endereco?.message}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl
                style={styled.address}
                isInvalid={"estado" in errors}
              >
                <FormControl.Label>Estado</FormControl.Label>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      type="text"
                      backgroundColor="#DADADA"
                      placeholder="Estado"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="estado"
                  rules={{ required: false }}
                />
                <FormControl.ErrorMessage>
                  {errors.estado?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            </HStack>

            <Divider my="6" />
            <Heading size="md" color="coolGray.700" style={{ marginTop: -20 }}>
              Responsável Financeiro
            </Heading>
            <Heading size="sm" color="coolGray.400">
              preencher apenas se for diferente da própria pessoa
            </Heading>
            <Divider my="2" />

            <FormControl isInvalid={"nomeResponsavel" in errors}>
              <FormControl.Label>Nome</FormControl.Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    type="text"
                    backgroundColor="#DADADA"
                    placeholder="Nome"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="nomeResponsavel"
                rules={{ required: false }}
              />
              <FormControl.ErrorMessage>
                {errors.nomeResponsavel?.message}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={"telResponsavel" in errors}>
              <FormControl.Label>Telefone</FormControl.Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    keyboardType="numeric"
                    type="text"
                    backgroundColor="#DADADA"
                    placeholder="Nome"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="telResponsavel"
                rules={{ required: false }}
              />
              <FormControl.ErrorMessage>
                {errors.telResponsavel?.message}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={"emailResponsavel" in errors}>
              <FormControl.Label>E-mail</FormControl.Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    type="text"
                    backgroundColor="#DADADA"
                    placeholder="E-mail"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="emailResponsavel"
                rules={{ required: false }}
              />
              <FormControl.ErrorMessage>
                {errors.emailResponsavel?.message}
              </FormControl.ErrorMessage>
            </FormControl>

            <Divider my="6" />
            <Heading size="md" color="coolGray.700" style={{ marginTop: -20 }}>
              Contato em caso de necessidade
            </Heading>
            <Divider my="2" />

            <FormControl isInvalid={"nomeEmergencia" in errors}>
              <FormControl.Label>Nome</FormControl.Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    type="text"
                    backgroundColor="#DADADA"
                    placeholder="Nome"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="nomeEmergencia"
                rules={{ required: false }}
              />
              <FormControl.ErrorMessage>
                {errors.nomeEmergencia?.message}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={"telEmergencia" in errors}>
              <FormControl.Label>Telefone</FormControl.Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    keyboardType="numeric"
                    type="text"
                    backgroundColor="#DADADA"
                    placeholder="Telefone"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="telEmergencia"
                rules={{ required: false }}
              />
              <FormControl.ErrorMessage>
                {errors.telEmergencia?.message}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={"grauEmergencia" in errors}>
              <FormControl.Label>Grau de Relacionamento</FormControl.Label>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    minWidth="200"
                    backgroundColor="#DADADA"
                    accessibilityLabel="Selecione grau relacionamento"
                    placeholder="Selecione grau relacionamento"
                    mt={1}
                    selectedValue={value}
                    onValueChange={(itemValue) => onChange(itemValue)}
                  >
                    {grauRelacionamento.map((row) => {
                      return (
                        <Select.Item
                          key={row.id}
                          label={row.name}
                          value={row.id}
                        />
                      );
                    })}
                  </Select>
                )}
                name="grauEmergencia"
                rules={{ required: false }}
              />
              <FormControl.ErrorMessage>
                {errors.grauEmergencia?.message}
              </FormControl.ErrorMessage>
            </FormControl>

            <Button
              mt={7}
              isLoading={isLoading}
              isLoadingText={editProfile ? "atualizando" : "cadastrando"}
              colorScheme="primary"
              onPress={handleSubmit(onSubmit)}
            >
              {editProfile ? "atualizar" : "cadastrar"}
            </Button>

            {editProfile && (
              <Button
                mt={7}
                colorScheme="danger"
                onPress={() => setIsOpenAlert(!isOpenAlert)}
              >
                Deletar Cliente
              </Button>
            )}
          </Box>
        </VStack>
      </ScrollView>
      <AlertModal
        cancelRef={cancelRef}
        isOpen={isOpenAlert}
        onClose={onCloseModal}
        handle={handleDelete}
        title="Deletar Cliente"
        msg="essa ação é irreversível. deseja continuar ?"
      />
    </View>
  );
};
export default CreateClient;
