import { StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginView from '../views/auth/LoginView'
import RegisterView from '../views/auth/RegisterView'

const OutStack = createNativeStackNavigator()
const OutsideStack = () => {
    useEffect(() => {
    }, [])
    return (
        <OutStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <OutStack.Screen name="LoginView" component={LoginView} />
            <OutStack.Screen name="RegisterView" component={RegisterView} />
        </OutStack.Navigator>
    )
}

export default OutsideStack

const styles = StyleSheet.create({})
