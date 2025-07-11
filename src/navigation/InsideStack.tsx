import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
// import BottomTab from './BottomTab'
import { scaleModerate } from '../styles/scaleDimensions'


const InStack = createNativeStackNavigator()
const InsideStack = () => {
    return (
        <>
            {/* <InStack.Navigator
                initialRouteName={
                   'BottomTab'
                }
                screenOptions={{
                    headerShown: false,
                }}
            >
               <InStack.Screen name="BottomTab" component={BottomTab} />
             
            </InStack.Navigator> */}
           
           
        </>
    )
}

export default InsideStack

