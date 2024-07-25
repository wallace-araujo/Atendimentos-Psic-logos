import { StyleSheet } from "react-native";

export const styled = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  search: {
    backgroundColor: "#fff",
    // flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -24,
    paddingStart: 18,
    paddingEnd: 18,
    marginStart: 14,
    marginEnd: 14,
    borderRadius: 4,
    paddingTop: 22,
    paddingBottom: 22,
    zIndex: 99,
  },
  title:{
    fontSize:18,
    fontWeight:"bold",
    margin:14
  },
  list:{
    marginStart:14,
    marginEnd:14
  },
  notFound:{
    flex: 1,
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
  },

  boxDetail:{
    // flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleDetail:{
    fontSize:18,
    fontWeight:"bold"
  },
  subTitleDetail:{
    fontSize:16,
    fontWeight:"bold",
    color: "#DADADA"
  },
  boxBtn:{
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop:30
  },
  value: {
    color: "#2ecc71",
    fontSize: 16,
    fontWeight: "bold",
  },
});
