import React, { useEffect } from 'react'
import RootNavigator from './src/navigation/RootNavigator'
import { Text } from 'react-native'
import LoginView from './src/views/auth/LoginView'

function App(): React.JSX.Element {
    return (
        <RootNavigator />           
    )
}

export default App
