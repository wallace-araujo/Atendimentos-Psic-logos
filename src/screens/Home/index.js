import React, { useState, useEffect, useContext } from "react";
import { FlatList } from "react-native";
import { Text, View } from "native-base";
import { AuthContext } from "../../contexts/auth";
import Movements from "../../components/Movements";
import Actions from "../../components/Actions";
import Balance from "../../components/Balance";
import Header from "../../components/Header";
import firestore from "@react-native-firebase/firestore";
import { fmtoNumber } from "../../util/formatNumberBr";
import { format } from "date-fns";
import { styled } from "./styles";
import notFound from "../../assets/animations/93134-not-found.json";
import LottieView from "lottie-react-native";

export function Home() {
  const { user } = useContext(AuthContext);
  const [amount, setAmount] = useState(0);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection(`Users/${user.uid}/Services`)
      .where("paid", "==", false)
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs
          .map((doc) => Number(doc.data().value))
          .reduce((prev, curr) => prev + curr, 0);
        setAmount(fmtoNumber(data));
      });
    return () => subscriber();
  }, []);

  useEffect(() => {
    const services = firestore()
      .collection(`Users/${user.uid}/Services`)
      .orderBy("createdAt", "desc")
      .limit(20)
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            name: doc.data().client?.nome,
            value: doc.data().value,
            date: format(doc.data()?.createdAt?.toDate(), "dd/MM/yyyy H:mm"),
          };
        });
        setServices(data);
      });
    return () => services();
  }, []);

  return (
    <View style={styled.container}>
      <Header />
      <Balance amount={amount} />
      <Actions />
      <Text style={styled.title}>Últimos atendimentos</Text>

      {services.length ? (
        <FlatList
          style={styled.list}
          data={services}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <Movements data={item} />}
        />
      ) : (
        <View style={styled.notFound}>
          <LottieView source={notFound} autoPlay loop />
        </View>
      )}
    </View>
  );
}
