import { Modal as RNModal, KeyboardAvoidingView, View, Platform } from "react-native";

export const Modal = ({ isOpen, withInput, children, ...rest }) => {
    const content = withInput ? (
        <KeyboardAvoidingView
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 12,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
            }}
            behavior={Platform.OS === "android" ? "padding" : "height"}
        >
            {children}
        </KeyboardAvoidingView>
    ) : (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 12,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
            }}
        >
            {children}
        </View>
    );

    return (
        <RNModal
            visible={isOpen}
            transparent
            animationType="fade"
            statusBarTranslucent
            {...rest}
        >
            {content}
        </RNModal>
    );
};

export default Modal;