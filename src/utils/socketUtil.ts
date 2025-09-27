// socketUtil.ts
import { DeviceEventEmitter } from 'react-native';
import { io, Socket } from 'socket.io-client';

export default class SocketUtil {
  private static socket: Socket | null = null;

  static connect(userId: string, type: 'partner' | 'client') {
    if (this.socket) {
      this.socket.disconnect();
    }

    const socketUrl = 'http://192.168.1.4:3000';
    this.socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      forceNew: true,
      timeout: 20000,
      autoConnect: true,
      query: { userId, type },
    });
    this.socket.on('connect', () => DeviceEventEmitter.emit('connect'));
    this.socket.on('disconnect', () => DeviceEventEmitter.emit('disconnect'));
    this.socket.on('order_addApplicant', data => {
      DeviceEventEmitter.emit('order_addApplicant', data);
    });
    this.socket.on(
      'chat.newMessage',
      (payload: { orderId: string; roomId: string }) => {
        const { orderId, roomId } = payload;
        console.log(
          '📨 Nhận chat.newMessage với orderId , roomId:',
          orderId,
          roomId,
        );

        // Emit lại nội bộ (optional)
        DeviceEventEmitter.emit('chat.newMessage', { orderId });
      },
    );
  }

  static on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  static off(event: string, callback?: (data: any) => void) {
    if (!this.socket) return;
    callback ? this.socket.off(event, callback) : this.socket.off(event);
  }

  static emit(event: string, data?: any) {
    this.socket?.emit(event, data);
  }

  static disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  static getConnectionStatus() {
    return {
      exists: !!this.socket,
      connected: this.socket?.connected || false,
      id: this.socket?.id,
      transport: this.socket?.io.engine?.transport?.name,
    };
  }
}
