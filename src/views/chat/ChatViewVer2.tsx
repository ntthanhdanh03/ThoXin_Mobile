import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { useNavigation, useRoute } from '@react-navigation/native';
import Spacer from '../components/Spacer';
import { Colors } from '../../styles/Colors';
import { DefaultStyles } from '../../styles/DefaultStyles';
import { scaleModerate } from '../../styles/scaleDimensions';
import { ic_chevron_left } from '../../assets';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMessageAction,
  sendMessageAction,
} from '../../store/actions/chatAction';

const ChatViewVer2 = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList<any>>(null);

  const { messages: messagesData } = useSelector((store: any) => store.chat);
  const { data: authData } = useSelector((store: any) => store.auth);
  const { dataRoomChat }: any = route.params || {};

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [inputHeight, setInputHeight] = useState(40);

  useEffect(() => {
    if (messagesData && dataRoomChat?.roomId) {
      const filteredMessages = messagesData.filter(
        (msg: any) => msg.roomId === dataRoomChat.roomId,
      );
      setMessages(filteredMessages);
    }
  }, [messagesData, dataRoomChat]);

  const handleSendMessages = async () => {
    if (!text.trim()) return;

    const newMessage = {
      _id: Date.now().toString(),
      roomId: dataRoomChat?.roomId,
      senderType: 'client',
      content: text.trim(),
    };

    setMessages(prev => [...prev, newMessage]);
    setText('');
    setInputHeight(40);

    const postData = {
      roomId: dataRoomChat?.roomId,
      senderId: authData?.user?._id,
      senderType: 'client',
      receiverId: dataRoomChat?.partnerId,
      content: text.trim(),
      orderId: dataRoomChat?.orderId,
    };
    console.log(postData);
    dispatch(sendMessageAction({ postData }));
  };

  const renderWarningHeader = () => (
    <View style={styles.warningContainer}>
      <View style={styles.warningIconContainer}>
        <Text style={styles.warningIcon}>⚠️</Text>
      </View>
      <View style={styles.warningContent}>
        <Text style={styles.warningTitle}>Lưu ý quan trọng</Text>
        <Text style={styles.warningText}>
          • Không trao đổi thông tin cá nhân (số điện thoại, địa chỉ chi tiết)
          qua tin nhắn
        </Text>
        <Text style={styles.warningText}>
          • Không thanh toán trực tiếp cho thợ ngoài nền tảng
        </Text>
        <Text style={styles.warningText}>
          • Mọi giao dịch qua nền tảng đều được bảo vệ và có hóa đơn rõ ràng
        </Text>
        <Text style={styles.warningText}>
          • Báo cáo ngay nếu thợ yêu cầu thanh toán ngoài hệ thống
        </Text>
      </View>
    </View>
  );

  const renderMessage = ({ item }: any) => {
    const isMe = item.senderType === 'client';
    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <Text style={isMe ? styles.sentText : styles.receivedText}>
          {item.content}
        </Text>
        <Text style={isMe ? styles.sentTime : styles.receivedTime}>
          {new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={DefaultStyles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <FastImage style={styles.backIcon} source={ic_chevron_left} />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <FastImage
              style={styles.avatar}
              source={{ uri: dataRoomChat?.avatarUrl }}
            />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerName} numberOfLines={1}>
                {dataRoomChat?.fullName || 'Thợ'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.chatContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item._id}
            renderItem={renderMessage}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesContent}
            ListHeaderComponent={renderWarningHeader}
            onContentSizeChange={() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }}
            onLayout={() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }}
          />
        </View>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              value={text}
              placeholder="Nhập tin nhắn..."
              placeholderTextColor={Colors.gray72}
              style={[styles.textInput, { height: Math.max(40, inputHeight) }]}
              multiline
              maxLength={500}
              onContentSizeChange={e => {
                const newHeight = e.nativeEvent.contentSize.height;
                const maxHeight = 100;
                setInputHeight(Math.min(newHeight, maxHeight));
              }}
              onChangeText={val => setText(val)}
            />

            {text.trim() && (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessages}
                activeOpacity={0.8}
              >
                <Text style={styles.sendIcon}>➤</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatViewVer2;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scaleModerate(12),
    paddingHorizontal: scaleModerate(12),

    borderBottomWidth: 1,
    borderColor: Colors.border01,
  },
  backButton: {
    padding: scaleModerate(6),
  },
  backIcon: {
    height: scaleModerate(24),
    width: scaleModerate(24),
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scaleModerate(8),
  },
  avatar: {
    height: scaleModerate(40),
    width: scaleModerate(40),
    borderRadius: scaleModerate(20),
    backgroundColor: Colors.grayF5,
    borderWidth: 2,
    borderColor: Colors.whiteFF,
  },
  headerTextContainer: {
    marginLeft: scaleModerate(12),
    flex: 1,
  },
  headerName: {
    ...DefaultStyles.textMedium16Black,
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleModerate(2),
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.green34,
    marginRight: scaleModerate(6),
  },
  statusText: {
    ...DefaultStyles.textRegular12Gray,
    fontSize: 12,
    color: Colors.gray72,
  },
  moreButton: {
    padding: scaleModerate(8),
  },
  moreIcon: {
    fontSize: 20,
    color: Colors.black1B,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: Colors.grayF5,
  },
  messagesContent: {
    paddingHorizontal: scaleModerate(12),
    paddingBottom: scaleModerate(16),
  },
  warningContainer: {
    backgroundColor: Colors.yellowFFF,
    borderRadius: scaleModerate(12),
    padding: scaleModerate(16),
    marginTop: scaleModerate(16),
    marginBottom: scaleModerate(12),
    borderWidth: 1,
    borderColor: Colors.yellowDC,
    flexDirection: 'row',
  },
  warningIconContainer: {
    marginRight: scaleModerate(12),
  },
  warningIcon: {
    fontSize: 24,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    ...DefaultStyles.textBold14Black,
    color: Colors.yellowDC,
    marginBottom: scaleModerate(8),
    fontSize: 15,
  },
  warningText: {
    ...DefaultStyles.textRegular13Black,
    color: Colors.black1B,
    lineHeight: 20,
    marginBottom: scaleModerate(4),
    fontSize: 13,
  },
  messageContainer: {
    marginVertical: scaleModerate(4),
    paddingHorizontal: scaleModerate(14),
    paddingVertical: scaleModerate(10),
    borderRadius: scaleModerate(18),
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: scaleModerate(4),
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.whiteFF,
    borderBottomLeftRadius: scaleModerate(4),
    borderWidth: 1,
    borderColor: Colors.border01,
  },
  sentText: {
    color: Colors.whiteFF,
    fontSize: 15,
    lineHeight: 20,
  },
  receivedText: {
    color: Colors.black1B,
    fontSize: 15,
    lineHeight: 20,
  },
  sentTime: {
    color: Colors.whiteFF,
    fontSize: 11,
    marginTop: scaleModerate(4),
    opacity: 0.7,
    alignSelf: 'flex-end',
  },
  receivedTime: {
    color: Colors.gray72,
    fontSize: 11,
    marginTop: scaleModerate(4),
    alignSelf: 'flex-end',
  },
  inputContainer: {
    paddingHorizontal: scaleModerate(12),
    paddingVertical: scaleModerate(10),
    borderTopWidth: 1,
    borderColor: Colors.border01,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.grayF5,
    borderRadius: scaleModerate(24),
    paddingHorizontal: scaleModerate(6),
    paddingVertical: scaleModerate(6),
  },
  attachButton: {
    padding: scaleModerate(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachIcon: {
    fontSize: 20,
  },
  textInput: {
    flex: 1,
    color: Colors.black1B,
    fontSize: 15,
    paddingHorizontal: scaleModerate(8),
    paddingTop: scaleModerate(10),
    paddingBottom: scaleModerate(10),
    maxHeight: 100,
  },
  sendButton: {
    width: scaleModerate(36),
    height: scaleModerate(36),
    borderRadius: scaleModerate(18),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scaleModerate(4),
  },
  sendIcon: {
    color: Colors.whiteFF,
    fontSize: 18,
    fontWeight: 'bold',
  },
  emojiButton: {
    padding: scaleModerate(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiIcon: {
    fontSize: 20,
  },
});
