import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, ScrollView, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; // Import Firebase Auth

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const [emailCheckIcon, setEmailCheckIcon] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        upper: false,
        lower: false,
        number: false,
        special: false,
    });
    const [inputErrors, setInputErrors] = useState({});
    const auth = getAuth();
    useEffect(() => {
        if (email) {
            setEmailCheckIcon(emailValid ? 'checkmark-circle' : 'close-circle');
        } else {
            setEmailCheckIcon(null);
        }
    }, [email, emailValid]);

    const onChangeDob = (event, selectedDate) => {
        if (selectedDate) {
            const dateString = selectedDate.toISOString().split('T')[0];
            setDob(dateString);
        }
        setShowDatePicker(false);
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailValid(re.test(email));
        setInputErrors((prev) => ({
            ...prev,
            email: re.test(email) ? null : 'Email không hợp lệ.',
        }));
    };

    const validatePassword = (password) => {
        const strength = {
            length: password.length >= 8,
            upper: /[A-Z]/.test(password),
            lower: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#\$%^&*(),.?":{}|<>~`]/.test(password),
        };
        setPasswordStrength(strength);

        const isStrong = Object.values(strength).every(Boolean);
        setInputErrors((prev) => ({
            ...prev,
            password: isStrong ? null : 'Mật khẩu không đạt yêu cầu.',
        }));
    };

    const handleRegister = async () => {
        const errors = {};
        if (!emailValid) errors.email = 'Email không hợp lệ.';
        const { length, upper, lower, number, special } = passwordStrength;
        if (!(length && upper && lower && number && special)) errors.password = 'Mật khẩu không đạt yêu cầu.';
        if (!name) errors.name = 'Vui lòng nhập họ và tên.';
        if (!phone) errors.phone = 'Vui lòng nhập số điện thoại.';
        if (!dob) errors.dob = 'Vui lòng chọn ngày sinh.';

        if (Object.keys(errors).length > 0) {
            setInputErrors(errors);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: name,
                phoneNumber: phone,
            });

            Alert.alert('Đăng ký thành công', 'Bạn đã đăng ký thành công!');
            navigation.navigate('Login');
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            let errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại.";

            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = "Email này đã được sử dụng.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "Email không hợp lệ.";
                    break;
                case 'auth/weak-password':
                    errorMessage = "Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn.";
                    break;
                // Xử lý các lỗi khác nếu cần
                default:
                    break;
            }
            Alert.alert('Lỗi đăng ký', errorMessage);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Animatable.View animation="fadeInDown" duration={500}>
                <Text style={styles.title}>Đăng ký</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" duration={800} delay={200}>
                {/* Input Email */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, inputErrors.email && styles.inputError]}
                        placeholder="Email"
                        placeholderTextColor="#888"
                        onChangeText={(value) => { setEmail(value); validateEmail(value); }}
                        value={email}
                        keyboardType="email-address"
                    />
                    {emailCheckIcon && (
                        <Ionicons
                            name={emailCheckIcon}
                            size={24}
                            color={emailValid ? '#4CAF50' : '#F44336'}
                            style={styles.icon}
                        />
                    )}
                </View>
                {inputErrors.email && <Text style={styles.errorText}>{inputErrors.email}</Text>}

                {/* Input Name */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, inputErrors.name && styles.inputError]}
                        placeholder="Họ và tên"
                        placeholderTextColor="#888"
                        onChangeText={setName}
                        value={name}
                    />
                </View>
                {inputErrors.name && <Text style={styles.errorText}>{inputErrors.name}</Text>}

                {/* Input Phone */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, inputErrors.phone && styles.inputError]}
                        placeholder="Số điện thoại"
                        placeholderTextColor="#888"
                        onChangeText={setPhone}
                        value={phone}
                        keyboardType="phone-pad"
                    />
                </View>
                {inputErrors.phone && <Text style={styles.errorText}>{inputErrors.phone}</Text>}

                {/* Input Date of Birth */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, { flex: 1 }, inputErrors.dob && styles.inputError]}
                        placeholder="Ngày sinh (YYYY-MM-DD)"
                        placeholderTextColor="#888"
                        value={dob}
                        editable={false}
                    />
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <Ionicons name="calendar" size={24} color="#CDDACDFF" style={styles.icon} />
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={dob ? new Date(dob) : new Date()}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeDob}
                        />
                    )}
                </View>
                {inputErrors.dob && <Text style={styles.errorText}>{inputErrors.dob}</Text>}

                {/* Password Input */}
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={[styles.passwordInput, inputErrors.password && styles.inputError]}
                        placeholder="Mật khẩu"
                        placeholderTextColor="#888"
                        onChangeText={(value) => { setPassword(value); validatePassword(value); }}
                        value={password}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#757575" />
                    </TouchableOpacity>
                </View>
                {inputErrors.password && <Text style={styles.errorText}>{inputErrors.password}</Text>}

                {/* Checklist */}
                <View style={styles.passwordChecklist}>
                    <Text style={[styles.checkItem, passwordStrength.length ? styles.checkItemValid : null]}>• Tối thiểu 8 ký tự</Text>
                    <Text style={[styles.checkItem, passwordStrength.upper ? styles.checkItemValid : null]}>• Ít nhất 1 chữ cái in hoa</Text>
                    <Text style={[styles.checkItem, passwordStrength.lower ? styles.checkItemValid : null]}>• Ít nhất 1 chữ cái thường</Text>
                    <Text style={[styles.checkItem, passwordStrength.number ? styles.checkItemValid : null]}>• Ít nhất 1 số</Text>
                    <Text style={[styles.checkItem, passwordStrength.special ? styles.checkItemValid : null]}>• Ít nhất 1 ký tự đặc biệt</Text>
                </View>

                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Đăng ký</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>Đã có tài khoản? Đăng nhập</Text>
                </TouchableOpacity>
            </Animatable.View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    inputError: {
        borderColor: '#F44336',
    },
    errorText: {
        color: '#F44336',
        fontSize: 12,
        marginTop: -15,
        marginBottom: 10,
    },
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#F5F5F5', // Softer background
        justifyContent: 'center', // Center content vertically
    },
    title: {
        fontSize: 32, // Larger title
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        color: '#2196F3', // More vibrant color
        fontFamily: 'sans-serif-medium', // Use a better font
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'white', // White input background
        borderRadius: 10,  // More rounded inputs
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        elevation: 2, // Add some shadow
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    icon: {
        marginLeft: 10,
        color: '#757575',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'white', // White input background
        borderRadius: 10,  // More rounded inputs
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
    passwordChecklist: {
        marginBottom: 30,
        paddingHorizontal: 15,
    },
    checkItem: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 5, // Add spacing between checklist items
    },
    checkItemValid: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    registerButton: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 3, // More pronounced shadow
    },
    registerButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    loginText: {
        color: '#1976D2',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
});

export default RegisterScreen;
