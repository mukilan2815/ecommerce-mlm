import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Button, List, Divider } from "react-native-paper";

const FilterPage = () => {
  const categories = ["Category", "Brand", "Price", "Reviews", "Delivery"];
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filterOptions, setFilterOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFilterOptions = async (category) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://64.227.134.220:8000/api/filter/${category.toLowerCase()}/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setFilterOptions(data[category]);
      setError(null);
    } catch (error) {
      console.error("Error fetching filter options:", error);
      setError("Failed to fetch filter options");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    fetchFilterOptions(category);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.leftSection}>
          <List.Section>
            <List.Subheader>Filter Category</List.Subheader>
            <FlatList
              data={categories}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleCategoryPress(item)}
                  style={styles.categoryItem}
                >
                  <List.Item title={item} />
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </List.Section>
        </View>
        <View style={styles.rightSection}>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : selectedCategory ? (
            <>
              <Text style={styles.optionsHeader}>
                {selectedCategory} Options:
              </Text>
              <Divider />
              <FlatList
                data={filterOptions}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.filterOption}>
                    <Button mode="contained" style={styles.Button}>
                      <Text style={styles.Buttontxt}>{item}</Text>
                    </Button>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                style={styles.filterOptionsList}
              />
            </>
          ) : (
            <Text style={styles.selectCategoryText}>
              Please select a category to see options.
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 30,
  },
  mainContainer: {
    flex: 1,
    flexDirection: "row",
  },
  leftSection: {
    width: 150,
    backgroundColor: "#C3C3C3",
    height: "100%",
    paddingBottom: 20,
  },
  categoryItem: {
    padding: 10,
  },
  rightSection: {
    flex: 2,
    borderLeftWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    backgroundColor: "#F5F5F5",
  },
  optionsHeader: {
    fontSize: 18,
    marginBottom: 10,
  },
  filterOptionsList: {
    flex: 1,
  },
  filterOption: {
    marginBottom: 10,
  },
  selectCategoryText: {
    textAlign: "center",
    marginTop: 20,
  },
  Button: {
    backgroundColor: "#C3C3C3",
  },
  Buttontxt: {
    color: "black",
    fontWeight: "600",
  },
});

export default FilterPage;
