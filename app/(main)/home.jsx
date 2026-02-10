import { useRouter } from 'expo-router';
import { GearIcon, PlusIcon } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';
import ConversationItems from '../../components/ConversationItems';
import Loading from '../../components/Loading';
import ScreenWrapper from '../../components/ScreenWrapper';
import Typo from '../../components/Typo';
import { colors, radius, spacingX, spacingY } from '../../constants/theme';
import { useAuth } from '../../contexts/authContext';
import { getConversations, newConversation } from '../../socket/socketEvents';
import { verticalScale } from '../../utils/styling';

const Home = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState(0);
    const [loading, setLoading] = useState(false)
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        getConversations(processConversations);
        newConversation(newConversationHandler)

        getConversations(null)
        return () => {
            getConversations(processConversations, true)
            newConversation(newConversationHandler, true)
        }
    }, [])
    const processConversations = (res) => {
        // console.log("res", res)
        if (res.success) {
            setConversations(res.data)
        }
    }

    const newConversationHandler = (res) => {
        if (res.success && res.data?.isNew) {
            setConversations((prev) => [...prev, res.data])
        }

    }

    // const conversations = [
    //     {

    //         name: "John Doe",
    //         type: "direct",

    //     },
    //     {

    //         name: "Team Dimond ",
    //         type: "group",
    //         lastMessage: {
    //             senderName: "Virat",
    //             content: "Hey! Are we still on for tonight? ",
    //             createdAt: "2022-01-01T12:00:10.000Z",
    //         }
    //     },
    //     {

    //         name: "John Doe",
    //         type: "direct",
    //         lastMessage: {
    //             senderName: "alice",
    //             content: "Hey! Are we still on for tonight111? ",
    //             createdAt: "2022-01-01T12:00:00.000Z",
    //         }
    //     },

    // ]

    let directConversation = conversations.filter((item) => item.type === "direct").sort((a, b) => {
        const aDate = a?.lastMessage?.createdAt || a.createdAt;
        const bDate = b?.lastMessage?.createdAt || b.createdAt;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
    })
    let groupConversation = conversations.filter((item) => item.type === "group").sort((a, b) => {
        const aDate = a?.lastMessage?.createdAt || a.createdAt;
        const bDate = b?.lastMessage?.createdAt || b.createdAt;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
    })

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
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: spacingY._20 }} >
                        <View style={styles.navBar}>
                            <View style={styles.tabs}>
                                <TouchableOpacity onPress={() => setSelectedTab(0)} style={[styles.tabStyle, selectedTab == 0 && styles.activeTab]}>
                                    <Typo>Direct Messages</Typo>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setSelectedTab(1)} style={[styles.tabStyle, selectedTab == 1 && styles.activeTab]}>
                                    <Typo>Groups</Typo>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{}}>
                            {
                                selectedTab == 0 && (
                                    directConversation.map((item, index) => {
                                        return (
                                            <ConversationItems item={item} key={index}
                                                router={router}
                                                showDivider={directConversation.length != index + 1}
                                            />
                                        )
                                    })

                                )

                            }
                            {
                                selectedTab == 1 && (
                                    groupConversation.map((item, index) => {
                                        return (
                                            <ConversationItems item={item} key={index}
                                                router={router}
                                                showDivider={groupConversation.length != index + 1}
                                            />
                                        )
                                    })
                                )
                            }
                        </View>
                        {
                            loading && <Loading />
                        }

                    </ScrollView>

                </View>

            </View>
            <Button style={styles.floatingButton} onPress={() => router.push({ pathname: "/(main)/newConversationModel", params: { isGroup: selectedTab } })}>
                <PlusIcon color={colors.black} size={verticalScale(22)} />
            </Button>
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

    },
    navBar: {
        flexDirection: "row",
        gap: spacingX._15,
        alignItems: "center",
        paddingHorizontal: spacingX._10,
    },
    tabs: {
        flexDirection: "row",
        gap: spacingX._10,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    tabStyle: {
        paddingVertical: spacingY._10,
        paddingHorizontal: spacingX._20,
        borderRadius: radius.full,
        backgroundColor: colors.neutral100,
    },
    activeTab: {
        backgroundColor: colors.primaryLight
    },
    floatingButton: {
        height: verticalScale(50),
        width: verticalScale(50),
        borderRadius: 100,
        position: "absolute",
        bottom: verticalScale(30),
        right: verticalScale(30)
    }

})

