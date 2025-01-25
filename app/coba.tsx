import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert, Image, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';

const trashcan = require('../assets/images/trashcan.png');
const edit = require('../assets/images/edit.png');
const logout = require('../assets/images/logout.png');





// Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyBm33UjQHf88HT7H0Ym6Ipz_mE7g2XVMBI',
    authDomain: 'coba-7629a.firebaseapp.com',
    projectId: 'coba-7629a',
    storageBucket: 'coba-7629a.appspot.com',
    messagingSenderId: '528328929295',
    appId: '1:528328929295:android:5c0d4b8a29bfa1688cb37a',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const Coba = () => {
    const [task, setTask] = useState('');
    const [date, setDate] = useState({ day: '', month: '', year: '' });
    const [time, setTime] = useState({ hour: '', minute: '', period: 'AM' });
    const [tasks, setTasks] = useState<{ id: string; task: string; date: string; time: string }[]>([]);
    const [user, setUser] = useState<User | null>(null);

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editTaskId, setEditTaskId] = useState('');
    const [editTaskText, setEditTaskText] = useState('');
    const [editTaskDate, setEditTaskDate] = useState('');
    const [editTaskTime, setEditTaskTime] = useState('');

    const [fontsLoaded] = useFonts({
        'BebasNeue-Regular': require('../assets/fonts/Bebas_Neue/BebasNeue-Regular.ttf'),
        'Montserratsb': require('../assets/fonts/Montserrat-SemiBold.ttf'),
        'Montserratreg': require('../assets/fonts/Montserrat-Regular.ttf'),
      });

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchTasks(currentUser.uid);
            } else {
                signInAnonymously(auth).catch((error) => {
                    console.error('Error signing in:', error);
                });
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const fetchTasks = (userId: string) => {
        const tasksQuery = query(collection(db, 'tasks'), where('userId', '==', userId));
        const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
            const tasksData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as { id: string; task: string; date: string; time: string }[];
            setTasks(tasksData);
        });

        return () => unsubscribe();
    };

    const resetFields = () => {
        setTask('');
        setDate({ day: '', month: '', year: '' });
        setTime({ hour: '', minute: '', period: 'AM' });
    };

    const addTask = async () => {
        const { day, month, year } = date;
        const { hour, minute, period } = time;

        if (!task.trim()) {
            alert('Task cannot be empty');
            return;
        }

        if (!day || !month || !year || !hour || !minute) {
            alert('All fields must be filled');
            return;
        }

        try {
            await addDoc(collection(db, 'tasks'), {
                userId: user?.uid,
                task,
                date: `${day}/${month}/${year}`,
                time: `${hour}:${minute} ${period}`,
            });
            resetFields();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const deleteTask = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'tasks', id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const editTask = (id: string, task: string, date: string, time: string) => {
        setEditTaskId(id);
        setEditTaskText(task);
        setEditTaskDate(date);
        setEditTaskTime(time);
        setEditModalVisible(true);
    };

    const saveTaskEdits = async () => {
        const taskRef = doc(db, 'tasks', editTaskId);

        const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
        const timePattern = /^\d{2}:\d{2} (AM|PM)$/;

        if (!editTaskDate || !datePattern.test(editTaskDate)) {
            alert('Invalid date format. Please enter date as DD/MM/YYYY');
            return;
        }

        if (!editTaskTime || !timePattern.test(editTaskTime)) {
            alert('Invalid time format. Please enter time as HH:MM AM/PM');
            return;
        }

        try {
            await updateDoc(taskRef, {
                task: editTaskText,
                date: editTaskDate,
                time: editTaskTime,
            });
            setEditModalVisible(false);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.title}>To Do List</Text>
                <TouchableOpacity  onPress={() => {
                        setUser(null);
                        setTasks([]);
                        router.push('/');
                    }}>
                    <Image source={logout} style={{ width: 25, height: 25, marginBottom : 10 }} />
                </TouchableOpacity>
                   
            </View>
            <TextInput
                style={[styles.input, { textAlign: 'left' }]}
                placeholder="Enter a task"
                value={task}
                onChangeText={setTask}
            />
            <View style={styles.dateTimeContainer}>
                <TextInput
                    style={styles.dayhourInput}
                    placeholder="DD"
                    keyboardType="numeric"
                    maxLength={2}
                    value={date.day}
                    onChangeText={(text) => setDate({ ...date, day: text })}
                />
                <Text style={styles.separator}>/</Text>
                <TextInput
                    style={styles.dayhourInput}
                    placeholder="MM"
                    keyboardType="numeric"
                    maxLength={2}
                    value={date.month}
                    onChangeText={(text) => setDate({ ...date, month: text })}
                />
                <Text style={styles.separator}>/</Text>
                <TextInput
                    style={styles.dateInput}
                    placeholder="YYYY"
                    keyboardType="numeric"
                    maxLength={4}
                    value={date.year}
                    onChangeText={(text) => setDate({ ...date, year: text })}
                />
            </View>
            <View style={styles.dateTimeContainer}>
                <TextInput
                    style={styles.dayhourInput}
                    placeholder="HH"
                    keyboardType="numeric"
                    maxLength={2}
                    value={time.hour}
                    onChangeText={(text) => setTime({ ...time, hour: text })}
                />
                <Text style={styles.separator}>:</Text>
                <TextInput
                    style={styles.dayhourInput}
                    placeholder="MM"
                    keyboardType="numeric"
                    maxLength={2}
                    value={time.minute}
                    onChangeText={(text) => setTime({ ...time, minute: text })}
                />
                <View style={styles.periodInput}>
                    <Picker
                        selectedValue={time.period}
                        onValueChange={(itemValue) => setTime({ ...time, period: itemValue })}
                        style={{ height: 40, width: 80 }}
                    >
                        <Picker.Item label="AM" value="AM" />
                        <Picker.Item label="PM" value="PM" />
                    </Picker>
                </View>
            </View>
                <TouchableOpacity onPress={addTask}
                    style={{
                    backgroundColor: '#131c22',
                    padding: 10,
                    borderRadius: 5,
                    width: '100%',
                    alignItems: 'center',
                    marginBottom : 10
                    }}> 
                    <Text style={{ color: '#f9f9f9' }}>Add Task</Text>
                </TouchableOpacity>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.taskContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <Text style={styles.task}>{item.task}</Text>
                                <Text style={styles.date}>{item.date}</Text>
                                <Text style={styles.time}>{item.time}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => deleteTask(item.id)}>
                                    <Image source={trashcan} style={{ width: 28, height: 28, marginRight: 10 }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => editTask(item.id, item.task, item.date, item.time)}>
                                    <Image source={edit} style={{ width: 25, height: 25 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />



            <Modal
                visible={editModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Edit Task</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Task"
                            value={editTaskText}
                            onChangeText={setEditTaskText}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Date (DD/MM/YYYY)"
                            value={editTaskDate}
                            onChangeText={setEditTaskDate}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Time (HH:MM AM/PM)"
                            value={editTaskTime}
                            onChangeText={setEditTaskTime}
                        />
                        <TouchableOpacity onPress={saveTaskEdits}
                            style={{
                            backgroundColor: '#131c22',
                            padding: 10,
                            borderRadius: 5,
                            width: '100%',
                            alignItems: 'center',
                            marginBottom : 10
                            }}> 
                            <Text style={{ color: '#f9f9f9' }}>Add Task</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setEditModalVisible(false)}
                            style={{
                            backgroundColor: '#131c22',
                            padding: 10,
                            borderRadius: 5,
                            width: '100%',
                            alignItems: 'center',
                            }}> 
                            <Text style={{ color: '#f9f9f9' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 36,
        color: '#1c536c',
        fontFamily: 'BebasNeue-Regular',
        marginBottom: 10,
    },
    input: {
        borderColor: '#1c536c',
        borderWidth: 1,
        marginBottom: 10,
        width: '100%',
        height: '15%',
        paddingHorizontal: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    dateTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    dateInput: {
        borderBottomColor: '#1c536c',
        borderBottomWidth: 1,
        marginBottom: 10,
        width: 54,
        height: 40,
        paddingHorizontal: 10,
        backgroundColor: '#f5f5f5',
    },
    dayhourInput: {
        borderBottomColor: '#1c536c',
        borderBottomWidth: 1,
        marginBottom: 10,
        width: 43,
        height: 40,
        paddingHorizontal: 10,
        backgroundColor: '#f5f5f5',
    },

    separator: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    periodInput: {
        height: 40,
        width: 80,
        marginHorizontal: 2,
    },
    taskContainer: {
        marginTop: 10,
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    task: {
        fontFamily: 'Montserratsb',
        fontSize: 18,
    },
    date: {
        fontFamily : 'Montserratreg',
        fontSize: 14,
        color: '#131c22',
    },
    time: {
        fontFamily : 'Montserratreg',
        fontSize: 14,
        color: '#131c22',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: '65%',
    },
});

export default Coba;
