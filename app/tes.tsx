import { View, Text, StyleSheet, Button } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';

type RootStackParamList = {
    Index: undefined;
    register: undefined;
    coba: undefined;
    tes : undefined;
};

const Tes = () => {
    
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Welcome to My Simple Page</Text>
            <Text>This is a simple page created with React Native and TypeScript.</Text>
            <Button title="Go to tes" onPress={() => navigation.navigate('coba')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});

export default Tes;