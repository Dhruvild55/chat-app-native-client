import { Image } from "expo-image"
import * as ImagePicker from "expo-image-picker"
import { useLocalSearchParams } from 'expo-router'
import { DotsThreeOutlineVerticalIcon, PaperPlaneTiltIcon, PlusIcon } from 'phosphor-react-native'
import React, { useEffect, useState } from 'react'
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import Avatar from '../../components/Avatar'
import BackButton from '../../components/BackButton'
import Header from '../../components/Header'
import Input from '../../components/Input'
import Loading from "../../components/Loading"
import MessageItem from '../../components/MessageItem'
import ScreenWrapper from '../../components/ScreenWrapper'
import Typo from '../../components/Typo'
import { colors, radius, spacingX, spacingY } from '../../constants/theme'
import { useAuth } from '../../contexts/authContext'
import { uploadToCloudinary } from "../../services/imageService"
import { getMessages, newMessage } from "../../socket/socketEvents"
import { scale, verticalScale } from '../../utils/styling'
const Conversation = () => {
    const [message, setMessage] = useState("")
    const { user: currentUser } = useAuth();
    const { id: conversationId, name, participants: stringifiedParticipants, avatar, type } = useLocalSearchParams();
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        newMessage(newMessageHandler);
        getMessages(getMessagesHandler);

        getMessages({ conversationId })
        return () => {
            newMessage(newMessageHandler, true);
            getMessages(getMessagesHandler, true)
        }
    }, [])

    const getMessagesHandler = (res) => {
        if (res.success) {
            setMessages(res.data)
        }

    }

    const newMessageHandler = (res) => {
        setLoading(false)
        if (res.success) {
            if (res.data.conversationId == conversationId) {
                setMessages((prev) => [res.data, ...prev])
            }
        }
    }



    const participants = JSON.parse(stringifiedParticipants);
    let conversationAvatar = avatar;
    let isDirect = type == "direct";
    const
        otherParticipants = isDirect ? participants.find((p) => p._id != currentUser?.id) : null
    if (isDirect && otherParticipants) {
        conversationAvatar = otherParticipants.avatar
    }
    let conversationName = isDirect ? otherParticipants.name : name;
    const onPickFile = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            aspect: [4, 3],
            quality: 0.5
        })
        if (!result.canceled) {
            setSelectedFile(result.assets[0])
        }
    }
    const onSend = async () => {
        console.log("message", message)
        if (!message && !selectedFile) return;
        if (!currentUser) return;
        setLoading(true);
        try {
            let attachment = null;
            if (selectedFile) {
                const uploadResult = await uploadToCloudinary(selectedFile, "message-attachment")

                if (uploadResult.success) {
                    attachment = uploadResult.data
                } else {
                    setLoading(false)
                    Alert.alert("Error", "Could not send the image !")
                }
            }
            console.log("attachment  :", attachment)
            newMessage({
                conversationId,
                sender: {
                    id: currentUser?.id,
                    name: currentUser.name,
                    avatar: currentUser.avatar,
                },
                content: message.trim(),
                attachment
            });

            setMessage("");
            setSelectedFile(null);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <ScreenWrapper showPattern={true} bgOpacity={0.5} >
            <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
                <Header style={styles.header} leftIcon={<View style={styles.headerLeft}>
                    <BackButton />
                    <Avatar size={40} uri={conversationAvatar} isGroup={type == "group"} />
                    <Typo color={colors.white} fontWeight={"500"} size={22}>
                        {conversationName}
                    </Typo>
                </View>}
                    rightIcon={<TouchableOpacity style={{ marginBottom: verticalScale(7) }}>
                        <DotsThreeOutlineVerticalIcon weight='fill' color={colors.white} />
                    </TouchableOpacity>}
                />

                {/* messages */}
                <View style={styles.content}>
                    <FlatList
                        data={messages}
                        inverted={true}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.messagesContent}
                        renderItem={({ item }) => (
                            <MessageItem item={item} isDirect={isDirect} />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                    <View style={styles.footer} >
                        <Input value={message} onChangeText={setMessage} placeholder="Type message" containerStyle={{
                            paddingLeft: spacingX._10,
                            paddingRight: scale(65),
                            borderWidth: 0
                        }}
                            icon={
                                <TouchableOpacity style={styles.inputIcon} onPress={onPickFile}>
                                    <PlusIcon color={colors.black} weight='bold' size={verticalScale(22)} />
                                    {
                                        selectedFile && selectedFile.uri && (
                                            <Image source={selectedFile.uri} style={styles.selectedFile} />
                                        )
                                    }
                                </TouchableOpacity>
                            }
                        />
                        <View style={styles.inputRightIcon}>
                            <TouchableOpacity style={styles.inputIcon} onPress={onSend}>
                                {
                                    loading ? <Loading size="small" color={colors.black} /> : <PaperPlaneTiltIcon color={colors.black} />
                                }

                            </TouchableOpacity>
                        </View>

                    </View>


                </View>


            </KeyboardAvoidingView>

        </ScreenWrapper >
    )
}
export default Conversation

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: spacingX._15,
        paddingTop: spacingY._10,
        paddingBottom: spacingY._15
    },
    inputIcon: {
        backgroundColor: colors.primary,
        borderRadius: radius.full,
        padding: 8
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingX._12,
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: radius._50,
        borderTopRightRadius: radius._50,
        borderCurve: "continuous",
        overflow: "hidden",
        paddingHorizontal: spacingX._15,
    },
    messagesContent: {
        paddingTop: spacingY._20,
        paddingBottom: spacingY._10,
        gap: spacingY._12,
    },
    messagesContainer: {
        flex: 1
    },
    selectedFile: {
        position: "absolute",
        height: verticalScale(38),
        width: verticalScale(38),
        borderRadius: radius.full,
        alignSelf: "center"
    },
    inputRightIcon: {
        position: "absolute",
        right: scale(10),
        top: verticalScale(15),
        paddingLeft: spacingX._12,
        borderLeftWidth: 1.5,
        borderLeftColor: colors.neutral300
    },
    footer: {

    }
})