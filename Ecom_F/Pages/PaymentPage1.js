import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Trackbar from "../Streetmall/14_Checkout_page/step.png";
import BottomBar from "./BottomBar";
import { useEffect } from "react";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { useUserContext } from "./UserContext";

const PaymentPage = ({ navigation, route }) => {
  const { product_ids, cdata } = route.params;
  const { userID, BASE_URL } = useUserContext();
  useEffect(() => {
    console.log("products", product_ids);
    console.log("cdata", cdata);
    const apiUrl = `${BASE_URL}/api/order/address/${userID}/`;
    axios
      .get(apiUrl)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);
  const buyAllProducts = async () => {
    try {
      for (let productId of product_ids) {
        await buyProduct(userID, productId);

      }
    } catch (error) {
      console.error("Error buying products:", error);
    }
  };

  const buyProduct = async (userID, product_id) => {
    try {
      console.log(`Product ${product_id} bought successfully`);
    } catch (error) {
      console.error(`Error buying product ${product_id}:`, error);
    }
  };
  const goToPaymentPage2 = () => {
    navigation.navigate("Payment2", { userData, product_ids, cdata });
  };

  const handleEditPress = () => {
    navigation.navigate("User");
  };

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const apiUrl = `${BASE_URL}/api/order/address/${userID}/`;

    axios
      .get(apiUrl)
      .then((response) => {
        setUserData(response.data);
        console.log("Data fetched successfully:", response.data);
        console.log("Products", product_ids);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  if (userData) {
    const { address } = userData;
    console.log(address);
  }

  return (
    <View style={styles.containerw}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.containerw}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Text
              style={{
                fontSize: 30,
                color: "#fff",
                textAlign: "center",
                alignItems: "center",
                display: "flex",
                marginTop: -10,
                fontWeight: "900",
              }}
            >
              StreetMall
            </Text>
            <StatusBar style="auto" />
          </View>
          <View>
            <Text> {"\n"} </Text>
            <Image style={styles.trackbar} source={Trackbar} />
            <View style={styles.trackcont}>
              <Text style={styles.tracktext1}>Address</Text>
              <Text style={styles.tracktext}>Delivery</Text>
              <Text style={styles.tracktext}>Payment</Text>
              <Text style={styles.tracktext1}>Place Order</Text>
            </View>
            <Text> {"\n"} </Text>
            <View style={styles.cont}>
              <View>
                {userData ? (
                  <View>
                    <Text style={styles.heading}>{userData.user["name"]}</Text>
                    <Text>Door Number: {userData.address.door_number}</Text>
                    <Text>
                      Address Line 1: {userData.address.address_line1}
                    </Text>
                    <Text>
                      Address Line 2: {userData.address.address_line2}
                    </Text>
                    <Text>Landmark: {userData.address.landmark || "N/A"}</Text>
                    <Text>City: {userData.address.city}</Text>
                    <Text>Postal Code: {userData.address.postal_code}</Text>
                    <Text>State: {userData.address.state}</Text>
                    <Text>Country: {userData.address.country}</Text>
                  </View>
                ) : (
                  <Text>Loading...</Text>
                )}
              </View>
              <View style={styles.buttonContainer}>
                {
                  <View>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={handleEditPress}
                    >
                      <Text style={styles.buttonText}>Edit Address</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.proceedButton}
                      onPress={goToPaymentPage2}
                    >
                      <Text style={styles.buttonText}>Proceed</Text>
                    </TouchableOpacity>
                  </View>
                }
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomBar navigation={navigation} />
      <View style={styles.blueBar}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerw: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  blueBar: {
    backgroundColor: "#1977F3",
    height: 15,
    position: "sticky",
    bottom: 60,
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: "#1977F3",
    paddingBottom: 15,
  },
  topbarinput: {
    justifyContent: "center",
    marginHorizontal: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
  },
  inputBox: {
    flex: 1,
    color: "#1977F3",
    marginLeft: 10,
  },
  trackbar: {
    alignSelf: "center",
    aspectRatio: 5,
    resizeMode: "contain",
  },
  cont: {
    backgroundColor: "white",
    borderRadius: 4,
    borderWidth: 3,
    borderColor: "#003478",
    padding: 16,
    margin: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  addressLine: {
    fontSize: 16,
    marginBottom: 8,
  },
  editInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    marginTop: 16,
  },
  editButton: {
    backgroundColor: "#003478",
    borderRadius: 16,
    padding: 13,
    alignItems: "center",
  },
  proceedButton: {
    backgroundColor: "#FF9900",
    borderRadius: 16,
    padding: 13,
    alignItems: "center",
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: "#003478",
    borderRadius: 16,
    padding: 13,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
  },
  trackcont: {
    flexDirection: "row",
    alignSelf: "center",
  },
  tracktext: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#003478",
    marginLeft: 27,
    marginRight: 10,
  },
  tracktext1: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#003478",
    marginLeft: 20,
    marginRight: 20,
  },
});

export default PaymentPage;
