import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { faStar, faStarHalf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const Giftproductitem = ({ product }) => {
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <FontAwesomeIcon key={i} icon={faStar} size={16} color="#FFD700" />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <FontAwesomeIcon
                    key="half"
                    icon={faStarHalf}
                    size={16}
                    color="#FFD700"
                />
            );
        }

        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <FontAwesomeIcon
                    key={`empty-${i}`}
                    icon={faStar}
                    size={16}
                    color="#CCCCCC"
                />
            );
        }

        return stars;
    };

    return (
      <View style={styles.productContainer}>
        <Image style={styles.productImage} source={{ uri: product.images }} />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.productHeader}>
            <View style={styles.ratingContainer}>
              {renderStars(product.rating)}
            </View>
          </View>
          <View style={styles.priOfferContainer}>
            <View style={styles.priOfferContainer}>
              <Text style={styles.productPrice}>{`₹${parseInt(
                product.sellingPrice,
                10
              )}`}</Text>
              <Text style={styles.offerText}>{product.discount}% off</Text>
            </View>
          </View>
        </View>
      </View>
    );
};


const styles = StyleSheet.create({
  productContainer: {
    width: "95%",
    height: 320, // Set a fixed height for all product cards
    marginRight: "2%",
    marginBottom: 20,
    backgroundColor: "#ff727288",
    opacity: 1,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#EAEAF6",
    padding: 15,
    overflow: "hidden", // Clip the content to the fixed height
  },

  productImage: {
    width: "100%",
    height: 150,
    borderColor: "white",
    objectFit: "contain",
  },
  productHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    marginBottom: 8,
    flexWrap: "wrap",
    textAlign: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxHeight: 40, // Set a max height for the description
  },
  priOfferContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // Added alignment
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 13,
  },

  productPrice: {
    fontSize: 17,
    fontWeight: "100",
    color: "black",
    padding: 10,
  },
  offerText: {
    backgroundColor: "#1E9500",
    color: "white",
    padding: 2,
    borderRadius: 25,
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: 10,
  },
});
export default Giftproductitem;
