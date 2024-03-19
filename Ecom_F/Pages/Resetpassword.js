import React, { useState } from "react";
import {
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  View,
  ScrollView,
  Text,
  TextInput,
  Image,
  StyleSheet,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faEye,
  faEyeSlash,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import signInImage from "../Streetmall/3_Login/ASSETS.png";
import axios from "axios"; // Import axios
import { useUserContext } from "./UserContext";

const ResetPasswordScreen = ({ navigation }) => {
  const { userID, BASE_URL } = useUserContext();
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordMismatchError, setPasswordMismatchError] = useState(false); // Define state for password mismatch error
  const [emojiError, setEmojiError] = useState(false); // Define state for emoji error

  const handleResetPassword = async () => {
    try {
      // Reset error messages
      setPasswordMismatchError(false);
      setEmojiError(false);

      // Check for password mismatch
      if (newPassword !== confirmPassword) {
        setPasswordMismatchError(true);
        return;
      }

      // Check for emoji in password
      const regex =
        /[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;
      if (regex.test(newPassword)) {
        setEmojiError(true);
        return;
      }

      const response = await axios.post(`${BASE_URL}/api/resetpass/`, {
        username: username,
        old_password: currentPassword,
        new_password: newPassword,
      });

      if (response.data === 1) {
        navigation.navigate("Login");
      } else {
        setErrorMessage(response.data["message"]);
      }
    } catch (error) {
      console.error("Password Reset failed:", error.message);
      setErrorMessage("Password reset failed. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: "#1977F3",
            padding: 20,
            paddingVertical: 70,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 30,
              color: "#fff",
              fontWeight: "bold",
              textAlign: "center",
              alignItems: "baseline",
              justifyContent: "flex-end",
              marginBottom: -10,
              fontWeight: "900",

              display: "flex",
            }}
          >
            STREETMALL
          </Text>
        </View>
        <ImageBackground style={styles.background} blurRadius={3}>
          <StatusBar barStyle="light-content" />
          <View style={styles.container}>
            <Text style={styles.heading}>Reset Password</Text>
            {passwordMismatchError && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}
            {emojiError && (
              <Text style={styles.errorText}>
                Emoji are not allowed in the password
              </Text>
            )}
            {errorMessage !== "" && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Username"
              onChangeText={(text) => setUsername(text)}
              value={username}
            />
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry={!showPassword}
              value={currentPassword}
              onChangeText={(text) => setCurrentPassword(text)}
            />
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="New Password"
                secureTextEntry={!showPassword}
                onChangeText={(text) => setNewPassword(text)}
                value={newPassword}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={styles.eyeIcon}
              >
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={!showPassword}
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmPassword}
            />
            <TouchableOpacity
              onPress={handleResetPassword}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.forgotPasswordLink}
              onPress={() => navigation.navigate("CodeVerification")}
            >
              <Text style={styles.forgotPasswordText}>Forget Password?</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    color: "black",
    borderBottomWidth: 1,
    borderColor: "black",
    marginBottom: 20,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "black",
    height: 40,
    color: "black",
  },
  eyeIcon: {
    marginLeft: -30,
  },
  confirmButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "#000",
    backgroundColor: "#e8e4e9",
    fontSize: 16,
    paddingHorizontal: 60,
    paddingVertical: 10,
    borderRadius: 10,
    fontWeight: "bold",
  },
  forgotPasswordLink: {
    alignItems: "center",
    marginTop: 20,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: "white",
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
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
});

export default ResetPasswordScreen;
