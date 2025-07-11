// import { Pressable, StyleSheet, Text, View } from 'react-native'
// import React, { FC, useEffect } from 'react'
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
// import { createNativeStackNavigator } from '@react-navigation/native-stack'
// import HomeView from '../views/home/HomeView'
// import { NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native'
// import {
//     BottomTabDescriptorMap,
//     BottomTabNavigationEventMap,
// } from '@react-navigation/bottom-tabs/lib/typescript/src/types'
// import FastImage from 'react-native-fast-image'
// import {
//     ic_folder,
//     ic_folder_black,
//     ic_forum,
//     ic_forum_black,
//     ic_home,
//     ic_home_black,
//     ic_message,
//     ic_message_black,
//     ic_profile,
//     ic_profile_black,
// } from '../assets'
// import ProfileView from '../views/profile/ProfileView'
// import { scaleModerate } from '../styles/scaleDimensions'
// import { Colors } from '../styles/Colors'
// import MessageView from '../views/chat/MessageView'
// import { DefaultStyles } from '../styles/DefaultStyles'
// import { useTranslation } from 'react-i18next'
// import DocumentView from '../views/document/DocumentView'
// import ForumView from '../views/forum/ForumView'
// import { useSelector } from 'react-redux'

// interface TabBar {
//     state: TabNavigationState<ParamListBase>
//     descriptors: BottomTabDescriptorMap
//     navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap> | any
// }

// const getIconAndLabel = (routeName: string, t: any) => {
//     let label = ''
//     let iconDefault = 0
//     let iconActive = 0

//     switch (routeName) {
//         case 'HomeTab':
//             label = t('home')
//             iconDefault = ic_home
//             iconActive = ic_home_black
//             break
//         case 'DocumentTab':
//             label = t('document')
//             iconDefault = ic_folder
//             iconActive = ic_folder_black
//             break
//         case 'ForumTab':
//             label = t('forum')
//             iconDefault = ic_forum
//             iconActive = ic_forum_black
//             break
//         case 'MessageTab':
//             label = t('message')
//             iconDefault = ic_message
//             iconActive = ic_message_black
//             break
//         case 'ProfileTab':
//             label = t('profile')
//             iconDefault = ic_profile
//             iconActive = ic_profile_black
//             break
//     }
//     return { label, iconDefault, iconActive }
// }

// const MyTabBar: FC<TabBar> = ({ state, descriptors, navigation }) => {
//     const { t } = useTranslation()
//     const { data: chatData } = useSelector((store: any) => store.chat)
//     const [hasNewMessage, setHasNewMessage] = React.useState(false)

//     useEffect(() => {
//         if (chatData?.hasNewMessage !== undefined) {
//             setHasNewMessage(chatData?.hasNewMessage)
//         }
//     }, [chatData?.hasNewMessage])

//     return (
//         <View style={styles.tabBarWrap}>
//             <View style={[styles.tabBar, styles.tabBarBottom]}>
//                 {state.routes.map((route, index) => {
//                     return (
//                         <View
//                             key={index}
//                             style={[styles.btn, { height: scaleModerate(20) }]}
//                         ></View>
//                     )
//                 })}
//             </View>
//             <View style={styles.tabBar}>
//                 {state.routes.map((route, index) => {
//                     const { options } = descriptors[route.key]
//                     const { label, iconDefault, iconActive } = getIconAndLabel(route.name, t)

//                     const isFocused = state.index === index

//                     const onPress = () => {
//                         const event = navigation.emit({
//                             type: 'tabPress',
//                             target: route.key,
//                             canPreventDefault: true,
//                         })

//                         if (!isFocused && !event.defaultPrevented) {
//                             navigation.navigate({ name: route.name, merge: true })
//                         }
//                     }

//                     const onLongPress = () => {
//                         navigation.emit({
//                             type: 'tabLongPress',
//                             target: route.key,
//                         })
//                     }

//                     return (
//                         <Pressable
//                             key={index}
//                             accessibilityRole="button"
//                             accessibilityState={isFocused ? { selected: true } : {}}
//                             accessibilityLabel={options.tabBarAccessibilityLabel}
//                             testID={options.tabBarTestID}
//                             onPress={onPress}
//                             onLongPress={onLongPress}
//                             style={styles.btn}
//                         >
//                             <View style={styles.iconContainer}>
//                                 {isFocused && (
//                                     <>
//                                         <FastImage
//                                             source={iconActive}
//                                             style={styles.iconTab}
//                                             resizeMode={'contain'}
//                                         />
//                                         <Text style={[styles.title, { color: Colors.primary }]}>
//                                             {label}
//                                         </Text>
//                                     </>
//                                 )}
//                                 {!isFocused && (
//                                     <>
//                                         <FastImage
//                                             source={iconDefault}
//                                             style={styles.iconTab}
//                                             resizeMode={'contain'}
//                                         />
//                                         <Text style={styles.title}>{label}</Text>
//                                     </>
//                                 )}
//                             </View>
//                             {route?.name === 'MessageTab' && hasNewMessage && (
//                                 <View style={styles.badgeContainer}></View>
//                             )}
//                         </Pressable>
//                     )
//                 })}
//             </View>
//         </View>
//     )
// }

// const HomeStack = createNativeStackNavigator()
// const HomeStackScreen = ({ route }: any) => {
//     return (
//         <HomeStack.Navigator
//             screenOptions={{
//                 headerShown: false,
//             }}
//         >
//             <HomeStack.Screen name="HomeView" component={HomeView} initialParams={route?.params} />
//         </HomeStack.Navigator>
//     )
// }

// const DocumentStack = createNativeStackNavigator()
// const DocumentStackScreen = ({ route }: any) => {
//     return (
//         <DocumentStack.Navigator
//             screenOptions={{
//                 headerShown: false,
//             }}
//         >
//             <DocumentStack.Screen
//                 name="DocumentView"
//                 component={DocumentView}
//                 initialParams={route?.params}
//             />
//         </DocumentStack.Navigator>
//     )
// }

// const ForumStack = createNativeStackNavigator()
// const ForumStackScreen = ({ route }: any) => {
//     return (
//         <ForumStack.Navigator
//             screenOptions={{
//                 headerShown: false,
//             }}
//         >
//             <ForumStack.Screen
//                 name="ForumView"
//                 component={ForumView}
//                 initialParams={route?.params}
//             />
//         </ForumStack.Navigator>
//     )
// }

// const MessageStack = createNativeStackNavigator()
// const MessageStackScreen = ({ route }: any) => {
//     return (
//         <MessageStack.Navigator
//             screenOptions={{
//                 headerShown: false,
//             }}
//         >
//             <MessageStack.Screen
//                 name="MessageView"
//                 component={MessageView}
//                 initialParams={route?.params}
//             />
//         </MessageStack.Navigator>
//     )
// }

// const ProfileStack = createNativeStackNavigator()
// const ProfileStackScreen = ({ route }: any) => {
//     return (
//         <ProfileStack.Navigator
//             screenOptions={{
//                 headerShown: false,
//             }}
//         >
//             <ProfileStack.Screen
//                 name="ProfileView"
//                 component={ProfileView}
//                 initialParams={route?.params}
//             />
//         </ProfileStack.Navigator>
//     )
// }

// const Tab = createBottomTabNavigator()
// const BottomTab = () => {
//     return (
//         <Tab.Navigator
//             initialRouteName="HomeTab"
            
//             screenOptions={{
//                 headerShown: false,
//                 tabBarHideOnKeyboard : true
//             }}
//             tabBar={(props) => <MyTabBar {...props} />}
//         >
//             <Tab.Screen name="HomeTab" component={HomeStackScreen} />
//             <Tab.Screen name="DocumentTab" component={DocumentStackScreen} />
//             <Tab.Screen name="ForumTab" component={ForumStackScreen} />
//             <Tab.Screen name="MessageTab" component={MessageStackScreen} />
//             <Tab.Screen name="ProfileTab" component={ProfileStackScreen} />
//         </Tab.Navigator>
//     )
// }

// export default BottomTab

// const styles = StyleSheet.create({
//     tabBarWrap: {
//         paddingTop: scaleModerate(5),
//         backgroundColor: Colors.whiteFF,
//     },
//     tabBar: {
//         flexDirection: 'row',
//         alignItems: 'flex-end',
//         paddingTop: scaleModerate(10),
//         paddingBottom: scaleModerate(25),
//         paddingHorizontal: scaleModerate(10),
//         backgroundColor: Colors.whiteFC,
//         ...DefaultStyles.shadow,
//     },
//     tabBarBottom: {
//         position: 'absolute',
//         bottom: scaleModerate(-4),
//         backgroundColor: Colors.whiteFF,
//     },
//     btn: {
//         flex: 1,
//         alignItems: 'center',
//     },
//     iconTab: {
//         width: scaleModerate(20),
//         height: scaleModerate(20),
//         marginBottom: scaleModerate(3),
//     },
//     iconContainer: {
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     activeContainer: {
//         backgroundColor: Colors.blueB9,
//         height: scaleModerate(40),
//         width: scaleModerate(66),
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderWidth: scaleModerate(1),
//         borderRadius: scaleModerate(10),
//     },
//     title: {
//         ...DefaultStyles.textRegular12Red,
//         color: Colors.gray72,
//     },
//     badgeContainer: {
//         height: 8,
//         width: 8,
//         borderRadius: 16,
//         backgroundColor: 'red',
//         position: 'absolute',
//         top: 0,
//         right: scaleModerate(25),
//     },
// })
