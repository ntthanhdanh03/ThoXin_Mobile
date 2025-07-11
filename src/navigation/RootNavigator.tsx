import { AppState, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import OutsideStack from './OutsideStack'
import { navigationRef } from './NavigationService'


const Stack = createNativeStackNavigator()
const RootNavigator = () => {
   useEffect(() => {
        console.log('RootNavigator')
     
    }, [])
    return (
        <>
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <>
                            <Stack.Screen
                                name="OutsideStack"
                                component={OutsideStack}
                            />   
                    </>
                </Stack.Navigator>
            </NavigationContainer>
        </>
    )
}

export default RootNavigator

const styles = StyleSheet.create({})
