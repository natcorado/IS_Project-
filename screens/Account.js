import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Footer from './../components/Footer';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from './../components/Modal';

const Account = ({ route }) => {
    const navigation = useNavigation();
    const { id_usuario, nombre, correo, patrimonio } = route.params;
    
    const [initialName, setInitialName] = useState(nombre);
    const [initialEmail, setInitialEmail] = useState(correo);
    const [initialBudget, setInitialBudget] = useState(patrimonio);

    const [id_user, setId_user] = useState(id_usuario);
    const [name, setName] = useState(nombre);
    const [email, setEmail] = useState(correo);
    const [budget, setBudget] = useState(patrimonio);
    const [budgetTemporal, setBudgetTemporal] = useState(initialBudget.toString());

    const [showIncomesOutcomes, setShowIncomesOutcomes] = useState(false);
    const [selectedCategoryAction, setSelectedCategoryAction] = useState(null);
    const [showLogout, setShowLogout] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const [showChangePassword, setShowChangePassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const images = [
        require('./../assets/avatars/Cat.png'),
        require('./../assets/avatars/Cow.png'),
        require('./../assets/avatars/Frog.png'),
        require('./../assets/avatars/Hamster.png'),
        require('./../assets/avatars/Hedgehog.png'),
        require('./../assets/avatars/Koala.png'),
        require('./../assets/avatars/Panda.png'),
        require('./../assets/avatars/Pig.png'),
    ];

    const userImage = images[id_user % 8];
    const hasChanges = () => {
        const currentBudget = parseFloat(budgetTemporal);
        const initialBudgetValue = parseFloat(initialBudget);
        return name.trim() !== initialName.trim() || email.trim() !== initialEmail.trim() || currentBudget !== initialBudgetValue;
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('user_id');
            await AsyncStorage.removeItem('user_email');
            await AsyncStorage.removeItem('user_name');
            await AsyncStorage.removeItem('user_budget');
            navigation.navigate('FirstPage');
        } catch (error) {
            console.log("Error during logout:", error);
        }
    };

    const handleSaveChanges = async () => {
        if (!name.trim() || !email.trim()) {
            Alert.alert("Error", "Name and email cannot be empty.");
            return;
        }
    
        const finalBudget = budgetTemporal ? parseFloat(budgetTemporal) : budget; 
    
        if (isNaN(finalBudget) || finalBudget <= 0) {
            Alert.alert("Error", "Please enter a valid, positive budget.");
            return;
        }
    
        try {
            const response = await fetch('http://10.10.10.74/API/handleProfile.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_usuario: id_user,
                    nombre: name,
                    email: email,
                    budget: finalBudget,
                }),
            });
    
            const responseData = await response.json();
    
            if (responseData.status === 'success') {
                Alert.alert("Success", responseData.message);
                setBudget(finalBudget);
                navigation.navigate('FirstPage');
            } else {
                Alert.alert("Error", responseData.error || "An error occurred. Please try again.");
            }
        } catch (error) {
            console.log("Error saving changes:", error);
            Alert.alert("Error", "Something went wrong. Please try again later.");
        }
    };
    
    


    useEffect(() => {
        setInitialName(name);
        setInitialEmail(email);
        setInitialBudget(budget);
        setBudgetTemporal(budget.toString());
    }, [modalOpen]);
    

    const handlePasswordChange = () => {
        if (newPassword === confirmNewPassword) {
            console.log("Password updated successfully");
        } else {
            console.log("Passwords do not match!");
        }
    };

    const handleEditProfile = () => {
        setModalOpen(false); 
    };
    
    const handleAddCategory = () => {
        setModalOpen(true);
        console.log('Email:', budget );   
    };
    
    const closeModal = () => {
        setModalOpen(false); 
    };

    const closePasswordModal = () => {
        setShowChangePassword(false); 
    };

    const handleRemoveCategory = (type) => {
    
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container}>
            {showChangePassword && (
                <Modal isOpen={showChangePassword}>
                    <View style={styles.modal}>
                        <View style={styles.modalContent}>
                            <Text style={styles.changePasswordTitle}>Change Password</Text>
                            <Text style={styles.passwordDescription}>Please enter your current password to change your password.</Text>

                            <Text style={styles.modalText}>Current Password</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Enter your current password"
                                secureTextEntry
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                            />

                            <Text style={styles.modalText}>New Password</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Enter your new password"
                                secureTextEntry
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />

                            <Text style={styles.modalText}>Confirm New Password</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Confirm your new password"
                                secureTextEntry
                                value={confirmNewPassword}
                                onChangeText={setConfirmNewPassword}
                            />

                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.closeButton} onPress={closePasswordModal}>
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.saveButton} onPress={handleEditProfile}>
                                    <Text style={styles.saveButtonText}>Save Changes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
            {modalOpen && (
                <Modal isOpen={modalOpen}>
                    <View style={styles.modal}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Edit Profile</Text>

                            <Text style={styles.modalText}>Name</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Enter your name"
                                value={name}
                                onChangeText={setName}
                            />

                            <Text style={styles.modalText}>Email</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={setEmail}
                            />

                            <Text style={styles.modalText}>Budget</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Enter your budget"
                                value={budgetTemporal}
                                keyboardType="numeric"
                                onChangeText={text => setBudgetTemporal(text)}
                            />

                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.closeButton} onPress={() => setModalOpen(false)}>
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.saveButton, { opacity: hasChanges() ? 1 : 0.5 }]}
                                    onPress={handleSaveChanges}
                                    disabled={!hasChanges()}
                                >
                                    <Text style={styles.saveButtonText}>Save Changes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}

            <View style={styles.profileContainer}>
                <View style={styles.profileImageWrapper}>  
                    <Image 
                        source={userImage}
                        style={styles.profileImage} 
                    />
                </View>
                <Text style={styles.userName}>{name}</Text>
                <Text style={styles.email}>{email}</Text>
                <TouchableOpacity 
                    style={styles.editProfileButton} 
                    onPress={handleAddCategory}
                >
                    <Text style={styles.editProfileText}>Edit profile</Text>
                </TouchableOpacity>
            </View>

            {budget <= 0.01 && budget >= 0 && (
                <View style={styles.welcomeMessage}>
                    <Image source={userImage}style={styles.welcomeImage} />
                    <Text style={styles.welcomeText}>
                        Your budget is currently zero.
                        To get started, just edit your profile 
                    </Text>
                    
                </View>
            )}

            <View style={styles.settingsContainer}>
                <TouchableOpacity 
                    style={styles.settingItem} 
                    onPress={() => setShowIncomesOutcomes(!showIncomesOutcomes)}
                >
                    <Text style={styles.settingText}>Edit expenses categories</Text>
                    <Icon name={showIncomesOutcomes ? "angle-up" : "angle-down"} size={20} />
                </TouchableOpacity>
                {showIncomesOutcomes && (
                    <View style={styles.settingDetails}>
                        <Text style={styles.noteText}>
                            Please note that only categories that have not been used in any records can be deleted.
                        </Text>


                        <TouchableOpacity 
                            style={styles.optionButton} 
                            onPress={() => handleRemoveCategory('incomes')}
                        >
                            <Text style={styles.optionText}>Remove Incomes Categories</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.optionButton} 
                            onPress={() => handleRemoveCategory('expenses')}
                        >
                            <Text style={styles.optionText}>Remove Expenses Categories</Text>
                        </TouchableOpacity>

                        {selectedCategoryAction && (
                            <Text style={styles.selectedActionText}>
                                You have selected to remove: {selectedCategoryAction === 'incomes' ? 'Incomes Categories' : 'Expenses Categories'}
                            </Text>
                        )}
                    </View>
                )}

                {/* Change Password */}
                <TouchableOpacity 
                    style={styles.settingItem} 
                    onPress={() => setShowChangePassword(true)}
                >
                    <Text style={styles.settingText}>Change Password</Text>
                    <Icon name={showChangePassword ? "angle-up" : "angle-down"} size={20} />
                </TouchableOpacity>
                

                {/* Logout */}
                <TouchableOpacity 
                    style={styles.settingItem} 
                    onPress={handleLogout}
                >
                    <Text style={styles.settingText}>Logout</Text>
                    <Icon name="sign-out" size={20} />
                </TouchableOpacity>
            </View>

            </ScrollView>
            <Footer navigation={navigation} id_usuario={id_user} nombre={name} correo={email} patrimonio={budget} />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    profileContainer: {
        marginTop: 60,
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImageWrapper: {
        width: 90, 
        height: 90, 
        borderRadius: 50, 
        borderWidth: 2,
        borderColor: '#000',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center', 
        marginBottom: 10,
    },
    profileImage: {
        width: 60, 
        height: 60,
        borderRadius: 20, 
        marginTop: 2,
        resizeMode: 'contain', 
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
    },
    email: {
        fontSize: 18,
        color: '#666',
    },
    editProfileButton: {
        marginTop: 25,
        paddingHorizontal: 35,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#000',
    },
    editProfileText: {
        color: '#fff',
        fontSize: 16,
    },
    settingsContainer: {
        borderTopWidth: 1,
        borderColor: '#ddd',
        paddingTop: 20,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    settingText: {
        fontSize: 16,
        color: '#000',
    },
    settingDetails: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#f9f9f9',
    },
    modal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '90%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2
    },
    modalInput: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    closeButton: {
        flex: 1,
        marginRight: 5,
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    saveButton: {
        flex: 1,
        marginLeft: 5,
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 5,
    },
    saveButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    welcomeMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0', 
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc', 
    },
    welcomeImage: {
        width: 40,  
        height: 40,
        borderRadius: 20,
        marginRight: 15, 
    },
    welcomeText: {
        fontSize: 15,
        color: '#666', 
        fontWeight: '500', 
        textAlign: 'left',
        flex: 1, 
    },
    changePasswordTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    passwordDescription: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    passwordForm: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginTop: 10,
    },
    noteText: {
        fontSize: 14,
        color: '#888',
        marginBottom: 15,
        fontStyle: 'italic',
    },
    optionButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        marginBottom: 10,
    },
    optionText: {
        fontSize: 16,
        color: '#000',
    },
    selectedActionText: {
        fontSize: 16,
        color: '#007BFF',
        marginTop: 15,
    },
});

export default Account;
