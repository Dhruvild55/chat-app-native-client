import { useRouter } from 'expo-router';
import { GearIcon } from 'phosphor-react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import Typo from '../../components/Typo';
import { colors, radius, spacingX, spacingY } from '../../constants/theme';
import { useAuth } from '../../contexts/authContext';
import { verticalScale } from '../../utils/styling';

const Home = () => {
    const { user, logout } = useAuth();
    console.log("user", user)
    const router = useRouter();

    return (
        <ScreenWrapper showPattern={true}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Typo color={colors.neutral200} size={19} textProps={{ numberOfLines: 1 }}>Welcome back , <Typo fontWeight='700' color={colors.neutral200} size={22}>{user?.name}</Typo></Typo>
                    </View>
                    <TouchableOpacity style={styles.settingIcon} onPress={() => router.push("/(main)/profileModel")}>
                        <GearIcon color={colors.white} weight='fill' size={verticalScale(22)} />
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>

                </View>

            </View>
        </ScreenWrapper >
    )
}
export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: spacingX._20,
        gap: spacingY._15,
        paddingTop: spacingY._15,
        paddingBottom: spacingY._15,
    },
    settingIcon: {
        padding: spacingY._10,
        backgroundColor: colors.neutral700,
        borderRadius: radius.full,
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: radius._50,
        borderTopRightRadius: radius._50,
        borderCurve: "continuous",
        overflow: "hidden",
        paddingHorizontal: spacingX._20,

    }

})

