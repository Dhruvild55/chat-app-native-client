import { Stack } from 'expo-router'
import { StyleSheet } from 'react-native'
import { AuthProvider } from '../contexts/authContext'

const RootLayout = () => {
    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false }} >
                <Stack.Screen name='(main)/home' options={{ headerShown: false }} />
                <Stack.Screen name='(main)/profileModel' options={{ presentation: "modal" }} />
                {/* <Stack.Screen name='(main)/newConversationModel' options={{ presentation: "modal" }} /> */}
            </Stack>

        </AuthProvider>
    )

}
export default RootLayout

const styles = StyleSheet.create({})