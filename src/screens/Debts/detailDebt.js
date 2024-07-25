import React, { useState, useEffect, useContext, useRef } from "react";
import { Button, Switch, useDisclose } from "native-base";

import { Text, View, FlatList } from "react-native";
import { AuthContext } from "../../contexts/auth";
import { MaterialIcons } from "@expo/vector-icons";
import DebtCardDetail from "../../components/DebtCardDetail";
import Header from "../../components/Header";
import ShareMsg from "../../components/Forms/ShareMsg";
import AlertModal from "../../components/AlertModal";
import Share from "react-native-share";
import firestore from "@react-native-firebase/firestore";
import { fmtoNumber } from "../../util/formatNumberBr";
import { styled } from "./styles";
import { format } from "date-fns";

const DetailDebt = ({ navigation, route }) => {
  const debt = route?.params?.debt || false;
  const { nome, servicos, tel, telResponsavel } = debt;
  const { user } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclose();
  const [valueCheck, setValueCheck] = useState(0);
  const [qtdCheck, setQtdCheck] = useState(0);
  const [selectDebt, setSelectDebt] = useState([]);
  const [switchShare, setSwitchShare] = useState(false);
  const [textShare, setTextShare] = useState(
    "Olá! Segue o valor referente aos nossos últimos atendimentos.\nVocê pode fazer a transferência através do meu PIX:000.000.000-05.\n\nAbraços."
  );
  const [editShare, setEditShare] = useState("");
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const cancelRef = useRef(null);

  const openDebt = (type, data) => {
    setValueCheck(
      type ? valueCheck - Number(data.value) : valueCheck + Number(data.value)
    );
    setQtdCheck(type ? qtdCheck - 1 : qtdCheck + 1);

    if (!type) {
      selectDebt.push(data);
      setSelectDebt(selectDebt);
    } else {
      const newData = selectDebt.filter((row) => row.id != data.id);
      setSelectDebt(newData);
    }
  };

  const onShare = async () => {
    let debtsMsg = "";
    selectDebt.map((row, key) => {
      debtsMsg += `${format(
        row?.serviceDate?.toDate(),
        "dd/MM/yyyy"
      )} R$ ${fmtoNumber(row?.value)}`;

      console.log(key, selectDebt.length);
      if (key < selectDebt.length - 1) {
        debtsMsg += `\n`;
      }
    });
    const debt = `Valor Total: R$ ${fmtoNumber(
      valueCheck
    )}\natendimentos: ${qtdCheck}\n-----------------------------------------\n${debtsMsg}\n-----------------------------------------\n`;

    const shareOptions = {
      message: debt + textShare,
      social: Share.Social.WHATSAPP,
      whatsAppNumber: telResponsavel ? `55${telResponsavel}` : `55${tel}`,
    };

    Share.shareSingle(shareOptions)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };

  const onTextShare = () => {
    setSwitchShare(!switchShare);
    if (!switchShare) {
      onOpen();
    }
  };

  useEffect(() => {
    const share = firestore()
      .collection(`Users/${user.uid}/Share`)
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        if (data) {
          setSwitchShare(!switchShare);
          setEditShare(data);
          setTextShare(data[0]?.shareMsg);
        }
      });
    return () => share();
  }, []);
  const handleDebtPaid = () => {

    selectDebt.map((row)=>{
        firestore()
        .collection(`Users/${user.uid}/Services`)
        .doc(row?.id)
        .update({paid: true})
        .then(() => {
          setIsOpenAlert(false)
          navigation.navigate("home")
        })
        .catch((error) => {
            setIsOpenAlert(false)
            navigation.navigate("home")
        })
        .finally(() => {
            setIsOpenAlert(false)
            navigation.navigate("home")
        });
    })
  };
  const onCloseModal = () => setIsOpenAlert(false);
  return (
    <View style={styled.container}>
      <Header title="Detalhamento Cobrança" />
      <View style={styled.search}>
        <View style={styled.boxDetail}>
          <Text style={styled.titleDetail}>{nome} </Text>
          <Text style={styled.subTitleDetail}>
            texto padrão
            <Switch isChecked={switchShare} onToggle={onTextShare} size="md" />
          </Text>
        </View>

        <View style={styled.boxBtn}>
          <Button
            onPress={() => setIsOpenAlert(!isOpenAlert)}
            colorScheme="success"
          >
            marcar “pago”
          </Button>
          <Button
            onPress={onShare}
            startIcon={<MaterialIcons name="share" size={20} color="#DADADA" />}
          >
            compartilhar
          </Button>
        </View>
      </View>
      <View style={{ ...styled.search, marginTop: 20, marginBottom: 25 }}>
        <View style={styled.boxDetail}>
          <Text style={styled.titleDetail}>Valor Total</Text>
          <Text style={styled.value}>R$ {fmtoNumber(valueCheck)}</Text>
        </View>
        <Text style={styled.subTitleDetail}>{qtdCheck} atendimentos</Text>
      </View>
      <FlatList
        style={styled.list}
        data={servicos}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <DebtCardDetail data={item} openDebt={openDebt} />
        )}
      />
      <ShareMsg
        isOpen={isOpen}
        onClose={onClose}
        setSwitchShare={setSwitchShare}
        setTextShare={setTextShare}
        textShare={textShare}
        editShare={editShare}
      />
      <AlertModal
        cancelRef={cancelRef}
        isOpen={isOpenAlert}
        onClose={onCloseModal}
        handle={handleDebtPaid}
        title="marcar “pago”"
        msg={`deseja confirma o pagamento dos ${qtdCheck} selecionado como pago. `}
      />
    </View>
  );
};
export default DetailDebt;
