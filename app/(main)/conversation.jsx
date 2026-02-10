import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'
import ScreenWrapper from '../../components/ScreenWrapper'
import Typo from '../../components/Typo'
import { colors } from '../../constants/theme'

const Conversation = () => {
    const data = useLocalSearchParams();
    console.log("conversations", data)
    return (
        <ScreenWrapper >
            <Typo color={colors.white}>Conversation</Typo>
        </ScreenWrapper>
    )
}
export default Conversation

const styles = StyleSheet.create({})