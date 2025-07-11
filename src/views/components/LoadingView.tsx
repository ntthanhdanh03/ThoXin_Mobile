import { ActivityIndicator, StyleSheet, View } from 'react-native'
import React from 'react'
import { HEIGHT_SCREEN, WIDTH_SCREEN } from '../../styles/scaleDimensions'
import { Colors } from '../../styles/Colors'

const LoadingView = ({ loading }: { loading: boolean }) => {
    return (
        <View style={[styles.container, loading ? {} : { display: 'none' }]}>
            <ActivityIndicator animating color={Colors.black1B} size={'large'} />
        </View>
    )
}

export default LoadingView

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: HEIGHT_SCREEN,
        width: WIDTH_SCREEN,
        top: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
