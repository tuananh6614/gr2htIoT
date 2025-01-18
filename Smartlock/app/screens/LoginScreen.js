import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity, ScrollView, Animated, Easing, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Import auth

// Cấu hình Firebase và khởi tạo auth
import { initializeApp } from 'firebase/app';
const firebaseConfig = {
  apiKey: "AIzaSyDdjKUec0aGVzExn1dPk-LkIraK7VqUJxk",
  authDomain: "smartlock-ccd1d.firebaseapp.com",
  projectId: "smartlock-ccd1d",
  storageBucket: "smartlock-ccd1d.appspot.com",
  messagingSenderId: "360774980468",
  appId: "1:360774980468:android:6d217dcfc513b0ae9bd221",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Khởi tạo Firebase Auth

const LoginScreen = ({ navigation }) => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [buttonScale] = useState(new Animated.Value(1));
    const [loading, setLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState({ identifier: null, password: null });
    const [identifierValid, setIdentifierValid] = useState(false); // Thêm state để kiểm tra tính hợp lệ

    // Hàm kiểm tra tính hợp lệ của email hoặc số điện thoại
    const validateIdentifier = (text) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ĐÚNG!
        const phonePattern = /^\d{10,11}$/;

        if (emailPattern.test(text) || phonePattern.test(text)) {
            setErrorMessages((prev) => ({ ...prev, identifier: null }));
            setIdentifierValid(true); // Cập nhật state khi hợp lệ
        } else {
            setErrorMessages((prev) => ({ ...prev, identifier: 'Vui lòng nhập email hoặc số điện thoại hợp lệ.' }));
            setIdentifierValid(false); // Cập nhật state khi không hợp lệ
        }
    };

    // Hàm đăng nhập
    const handleLogin = async () => {
        if (!identifier) {
            setErrorMessages((prev) => ({ ...prev, identifier: 'Vui lòng nhập email hoặc số điện thoại.' }));
            return;
        }

        if (!password) {
            setErrorMessages((prev) => ({ ...prev, password: 'Vui lòng nhập mật khẩu.' }));
            return;
        }

        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, identifier, password);
            Alert.alert('Đăng nhập thành công', `Chào mừng ${userCredential.user.email || userCredential.user.phoneNumber}!`);
            navigation.navigate('Home');
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            let errorMessage = "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";

            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = "Email không đúng định dạng.";
                    break;
                case 'auth/user-not-found':
                    errorMessage = "Không tìm thấy tài khoản với email/số điện thoại này.";
                    break;
                case 'auth/wrong-password':
                    errorMessage = "Mật khẩu không chính xác.";
                    break;
                case 'auth/too-many-requests':
                    errorMessage = "Đăng nhập quá nhiều lần. Vui lòng thử lại sau.";
                    break;
            }
            setErrorMessages((prev) => ({ ...prev, password: errorMessage }));
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý nhấn giữ nút
    const handlePressIn = () => {
        Animated.timing(buttonScale, {
            toValue: 0.95,
            duration: 100,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
    };

    // Hàm xử lý khi nhả nút
    const handlePressOut = () => {
        Animated.timing(buttonScale, {
            toValue: 1,
            duration: 100,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Animatable.View animation="fadeInDown" duration={500}>
                <Text style={styles.title}>Đăng nhập</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" duration={800} delay={200}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, errorMessages.identifier && styles.inputError]}
                        placeholder="Email hoặc Số điện thoại"
                        onChangeText={(text) => {
                            setIdentifier(text);
                            validateIdentifier(text);
                        }}
                        value={identifier}
                        placeholderTextColor="#888"
                    />
                    {identifierValid && !errorMessages.identifier && ( // Hiển thị checkmark khi hợp lệ và không có lỗi
                        <Ionicons name="checkmark-circle" size={24} color="green" style={styles.icon} />
                    )}
                    {errorMessages.identifier && (
                        <Ionicons name="close-circle" size={24} color="red" style={styles.icon} />
                    )}
                </View>
                {errorMessages.identifier && <Text style={styles.errorText}>{errorMessages.identifier}</Text>}

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={[styles.passwordInput, errorMessages.password && styles.inputError]}
                        placeholder="Mật khẩu"
                        onChangeText={(text) => {
                            setPassword(text);
                            setErrorMessages((prev) => ({ ...prev, password: null }));
                        }}
                        value={password}
                        secureTextEntry={!showPassword}
                        placeholderTextColor="#888"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
                    </TouchableOpacity>
                </View>
                {errorMessages.password && <Text style={styles.errorText}>{errorMessages.password}</Text>}

                <Animated.View style={[styles.animatedButtonContainer, { transform: [{ scale: buttonScale }] }]}>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Text style={styles.loginButtonText}>Đăng nhập</Text>
                        )}
                    </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerText}>Chưa có tài khoản? Đăng ký</Text>
                </TouchableOpacity>
            </Animatable.View>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        color: '#2196F3',
        fontFamily: 'sans-serif-medium',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        elevation: 2,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    icon: {
        marginLeft: 10,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        elevation: 2,
    },
    passwordInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    animatedButtonContainer: {
        marginTop: 20,
    },
    loginButton: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 3,
    },
    loginButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    registerText: {
        color: '#1976D2',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    inputError: {
        borderColor: '#F44336',
    },
    errorText: {
        color: '#F44336',
        fontSize: 12,
        marginTop: -10,
        marginBottom: 10,
    },
});

export default LoginScreen;