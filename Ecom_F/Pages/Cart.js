import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUsersViewfinder,
  faMapMarkerAlt,
  faCheckCircle,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useUserContext } from "./UserContext";
import {
  faHome,
  faBars,
  faShoppingCart,
  faUser,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";

const Cart = ({ navigation }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [cartData, setCartData] = useState("");
  const [cartItem, setCartItem] = useState("");
  const [productIds, setPI] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const { userID, BASE_URL, updateUserID } = useUserContext();

  const fetchCartData = useCallback(async () => {
    try {
      const storedUsername = await AsyncStorage.getItem("username");
      const storedPassword = await AsyncStorage.getItem("password");
      if (storedPassword && storedUsername) {
        updateUserID(storedUsername);
        try {
          const response = await axios.get(
            `${BASE_URL}/api/cart/${storedUsername}/`
          );
          setCartData(response.data);
          setCartItem(response.data["cart_items"]);
          setPI(response.data.cart_items.map((item) => item.product_id));
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      }
    } catch (error) {
      try {
        const response = await axios.get(`${BASE_URL}/api/cart/${userID}/`);
        setCartData(response.data);
        setCartItem(response.data["cart_items"]);
        setPI(response.data.cart_items.map((item) => item.product_id));
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    }
  }, [BASE_URL, updateUserID, userID]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData, userID, refreshKey]);

  const fetchProducts = useCallback(
    async (productIds) => {
      try {
        const productData = [];
        for (let productId of productIds) {
          const response = await axios.get(
            `${BASE_URL}/api/product/${productId}/`
          );
          const temp = response.data;
          temp["inCart"] =
            cartItem.find((i) => i["product_id"] === productId)?.quantity || 0;
          productData.push(temp);
        }

        console.log("Success");
        console.log(productIds);
        return productData;
      } catch (error) {
        console.log("Failed to load data");
        console.error("Error fetching products:", error);
        return null;
      }
    },
    [BASE_URL, cartItem]
  );

  useEffect(() => {
    const fetchAllProducts = async () => {
      if (productIds.length > 0) {
        const products = await fetchProducts(productIds);
        const sortedProducts = products.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setAllProducts(sortedProducts);
      }
    };

    fetchAllProducts();
  }, [fetchProducts, productIds, refreshKey]);

  const goToPaymentPage = useCallback(() => {
    navigation.navigate("Payment", {
      product_ids: productIds,
      cdata: cartData,
    });
  }, [navigation, productIds, cartData]);

  const handleDelete = useCallback(
    async (userID, product_id) => {
      try {
        const response = await axios.post(
          `${BASE_URL}/api/updateCart/-/`,
          {
            username: userID,
            product_id: product_id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Deleted");
        if (response.data === "Deleted") {
          setAllProducts((prevProducts) =>
            prevProducts.filter((product) => product.product_id !== product_id)
          );
          setRefreshKey((prevKey) => prevKey + 1);
          console.log("Cart total is zero after deletion");
        } else {
          console.log("Deleted");
        }
        setRefreshKey((prevKey) => prevKey + 1);
      } catch (error) {
        console.log("Unable To Update", error);
      }
    },
    [BASE_URL]
  );

  const navigateToSingleProduct = useCallback(
    (product, index) => {
      navigation.navigate("SProduct", { product });
    },
    [navigation]
  );

  const handleAdd = useCallback(
    async (userID, product_id) => {
      try {
        const response = await axios.post(
          `${BASE_URL}/api/updateCart/+`,
          {
            username: userID,
            product_id: product_id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Added");
        setRefreshKey((prevKey) => prevKey + 1);
      } catch (error) {
        console.log("Unable To Update", error);
      }
    },
    [BASE_URL]
  );

  return (
    <View style={styles.containerw}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.containery}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.topbarinput}>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                size={20}
                color="black"
              />
              <TextInput
                placeholder="Search Streetmall.com"
                style={styles.inputBox}
                onPressIn={() =>
                  navigation.navigate("AProduct", { item: { text: "" } })
                }
              />
            </View>
          </View>

          <View
            style={{ flexDirection: "row", alignItems: "center", margin: 10 }}
          >
            <FontAwesomeIcon icon={faMapMarkerAlt} size={30} color="#003478" />
            <Text style={{ color: "#003478" }}>
              Deliver to Customer Name - Chennai 600087
            </Text>
          </View>
          <Text style={{ marginLeft: 10 }}>
            Total{" "}
            <Text style={{ fontWeight: "900" }}> ₹{cartData.cart_total}</Text>
          </Text>
          <Text style={{ marginLeft: 10 }}>
            EMI Available<Text style={{ color: "#003478" }}> Details.</Text>
          </Text>
          <View
            style={{
              flexDirection: "row",
              margin: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesomeIcon
              style={{ marginRight: 10 }}
              icon={faCheckCircle}
              color="green"
              size={30}
            />
            <Text>Your order is eligible for FREE Delivery. </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity onPress={goToPaymentPage}>
              <Text
                style={{
                  backgroundColor: "transparent",
                  borderRadius: 10,
                  padding: 10,
                  paddingHorizontal: 40,
                  color: "white",
                  textAlign: "center",
                }}
              ></Text>
            </TouchableOpacity>
          </View>

          {allProducts.length > 0 ? (
            <TouchableOpacity
              onPress={() => goToPaymentPage(productIds)}
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.buynowall}>Proceed To Buy</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.emc}>Your Cart is Empty</Text>
          )}

          <View style={styles.cont}>
            {allProducts.map((product, index) => (
              <View
                key={`${product.product_id}-${product.uniqueProperty}`}
                style={styles.productContainer}
              >
                <View style={styles.leftContainer}>
                  <Image
                    style={styles.productImage}
                    source={{ uri: product.images }}
                  />
                  <View style={styles.productCountContainer}>
                    <TouchableOpacity
                      onPress={() => handleDelete(userID, product.product_id)}
                      style={styles.deleteButton}
                    >
                      <FontAwesomeIcon size={15} icon={faMinus} />
                    </TouchableOpacity>
                    <Text style={styles.productCountText}>
                      {product.inCart}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleAdd(userID, product.product_id)}
                      style={styles.countButton}
                    >
                      <Text style={styles.sbuttonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.rightContainer}>
                  <TouchableOpacity
                    onPress={() => navigateToSingleProduct(product, index)}
                  >
                    <Text style={styles.productName}>{product.name}</Text>
                  </TouchableOpacity>
                  <View style={styles.productDetailoffcont}>
                    <Text style={styles.productDetailoff}>
                      {product.discount}% off
                    </Text>
                  </View>
                  <Text style={styles.productDetailpri}>
                    ₹{product.sellingPrice * product.inCart}
                  </Text>
                  {product.freeDelivery && (
                    <Text style={styles.productDetaildel}>
                      Eligible for FREE Delivery
                    </Text>
                  )}
                  {product.freestock && (
                    <Text style={styles.productDetailst}>In Stock</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <View style={[styles.navbarIcon, styles.navbarIconHome1]}>
            <FontAwesomeIcon icon={faHome} size={25} color={"#1977F3"} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Category")}>
          <View style={[styles.navbarIcon, styles.navbarIconHome1]}>
            <FontAwesomeIcon icon={faBars} size={20} color={"#1977F3"} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          <View style={[styles.navbarIcon, styles.navbarIconHome]}>
            <FontAwesomeIcon icon={faShoppingCart} size={20} color={"white"} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("User")}>
          <View style={[styles.navbarIcon, styles.navbarIconHome1]}>
            <FontAwesomeIcon icon={faUser} size={20} color={"#1977F3"} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.blueBar}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  buyNowBut: {
    width: 100,
    backgroundColor: "#FFAC2F",
    borderRadius: 16,
    padding: 13,
    alignItems: "center",
    color: "white",
    marginTop: 8,
    textAlign: "center",
  },
  buynowall: {
    width: 200,
    margin: "auto",
    backgroundColor: "#FF9C09",
    borderRadius: 16,
    padding: 13,
    alignItems: "center",
    color: "black",
    marginTop: 8,
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  emc: {
    width: 200,
    padding: 13,
    alignSelf: "center",
    color: "black",
    marginTop: 8,
    fontWeight: "200",
    fontSize: 20,
    textAlign: "center",
  },
  navbar: {
    width: "100%",
    height: "8%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
  },
  navbarIcon: {
    width: 15,
    height: 15,
    tintColor: "#1977F3",
  },
  navbarIconHome: {
    backgroundColor: "#1977F3",
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: -10,
    borderBottomRightRadius: 21,
    borderBottomLeftRadius: 21,
    elevation: 5,
  },
  navbarIconHome1: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: -10,
    borderBottomRightRadius: 21,
    borderBottomLeftRadius: 21,
  },
  containerw: {
    flex: 1,
    backgroundColor: "#ffffff",
    height: "80%",
  },
  containery: {
    flex: 1,
    backgroundColor: "#ffffff",
    height: "70%",
    marginBottom: "10%",
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
    paddingTop: 100,
    backgroundColor: "#1977F3",
    paddingBottom: 15,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    alignSelf: "center",
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
    fontSize: 16,
  },
  trackbar: {
    alignSelf: "center",
    aspectRatio: 9,
    resizeMode: "contain",
  },
  buttonContainer: {
    marginTop: 16,
  },
  header: {
    backgroundColor: "#1977F3",
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  orderStatusContainer: {
    padding: 20,
  },
  statusItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  statusIconContainer: {
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statusIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  statusTextContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statusDate: {
    fontSize: 14,
    color: "#888888",
  },
  claimimg: {
    width: "58%",
    height: "3%",
  },
  chtext: {
    alignSelf: "center",
    color: "#C80000",
    paddingBottom: 30,
  },
  cont: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  productContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  leftContainer: {
    width: "40%",
    alignItems: "center",
  },
  rightContainer: {
    width: "60%",
    marginLeft: 25,
    marginTop: 15,
  },
  productImage: {
    width: "100%",
    height: 130,
    resizeMode: "contain",
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: "400",
    flexWrap: "wrap",
    width: "91%",
  },
  productDetailoffcont: {
    backgroundColor: "#871818",
    borderRadius: 14,
    padding: 2,
    marginTop: 5,
    width: "25%",
  },
  productDetailoff: {
    color: "white",
    fontSize: 9,
    alignSelf: "center",
    fontWeight: "bold",
  },
  productDetailpri: {
    fontSize: 23,
    fontWeight: "bold",
  },
  productDetaildel: {
    fontSize: 10,
    marginTop: 3,
    color: "blue",
  },
  productDetailst: {
    fontSize: 11,
    marginTop: 5,
    fontWeight: "800",
    color: "brown",
  },
  productCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    borderRadius: 40,
    backgroundColor: "#001B95",
  },
  countButton: {
    width: "30%",
    backgroundColor: "#E0DCDC",
    borderRadius: 30,
    padding: 6.9,
    marginLeft: 5,
    alignItems: "center",
  },
  deleteButton: {
    width: "30%",
    backgroundColor: "#E0DCDC",
    borderRadius: 30,
    padding: 10,
    alignItems: "center",
  },
  productCountText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "justify",
    marginHorizontal: 10,
    color: "white",
  },
  sbuttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  lstimage: {
    alignSelf: "center",
  },
  chtext: {
    alignSelf: "center",
    color: "#C80000",
    paddingBottom: 60,
  },
  trackbar: {
    alignSelf: "center",
    aspectRatio: 2.9,
    resizeMode: "contain",
  },
  tracktext: {
    paddingTop: 10,
    fontSize: 13,
    fontWeight: "bold",
    color: "#003478",
    paddingRight: 20,
    paddingLeft: 33,
  },
  trackcont: {
    flexDirection: "row",
    alignSelf: "center",
  },
  proceedButton: {
    backgroundColor: "#FF9900",
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
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    marginRight: 10,
  },
  locationText: {
    fontSize: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  emiDetailsText: {
    fontSize: 16,
    marginTop: 5,
  },
  freeDeliveryContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  checkCircleIcon: {
    marginRight: 10,
  },
  freeDeliveryText: {
    fontSize: 16,
  },
});

export default Cart;
