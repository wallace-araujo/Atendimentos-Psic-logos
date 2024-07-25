import { StyleSheet } from "react-native";


export const styled = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  title:{
    fontSize:18,
    fontWeight:"bold",
    margin:14,
    // paddingTop:10
  },
  list:{
    flex: 1,
    marginStart:14,
    marginEnd:14
  },
  notFound:{
    flex: 1,
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
  }
});
