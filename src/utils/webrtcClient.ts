// // utils/webrtcClient.ts
// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   mediaDevices,
// } from 'react-native-webrtc';
// import SocketUtil from './socketUtil';

// const ICE_CONFIG = {
//   iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
// };

// class WebRTCClient {
//   pc: RTCPeerConnection | null = null;
//   localStream: any = null;
//   remoteStream: any = null;
//   remoteUserId: string | null = null;
//   isCaller = false;

//   async initLocalStream() {
//     if (this.localStream) return this.localStream;
//     const stream = await mediaDevices.getUserMedia({ audio: true });
//     this.localStream = stream;
//     return stream;
//   }

//   async createPeerConnection(remoteUserId: string, isCaller: boolean) {
//     this.remoteUserId = remoteUserId;
//     this.isCaller = isCaller;
//     this.pc = new RTCPeerConnection(ICE_CONFIG);

//     const localStream = await this.initLocalStream();
//     localStream.getTracks().forEach(track => this.pc?.addTrack(track, localStream));

//     this.pc.onicecandidate = (event: any) => {
//       if (event.candidate && this.remoteUserId) {
//         SocketUtil.emit('webrtc.ice-candidate', {
//           to_userId: this.remoteUserId,
//           candidate: event.candidate,
//         });
//       }
//     };

//     this.pc.ontrack = (event: any) => {
//       console.log('🔊 Remote stream received');
//       this.remoteStream = event.streams[0];
//     };

//     return this.pc;
//   }

//   async startCall(remoteUserId: string, from_userId: string) {
//     await this.createPeerConnection(remoteUserId, true);
//     const offer = await this.pc!.createOffer();
//     await this.pc!.setLocalDescription(offer);

//     SocketUtil.emit('webrtc.offer', {
//       from_userId,
//       to_userId: remoteUserId,
//       sdp: offer,
//     });
//   }

//   async handleOffer(from_userId: string, sdp: any, to_userId: string) {
//     await this.createPeerConnection(from_userId, false);
//     await this.pc!.setRemoteDescription(new RTCSessionDescription(sdp));
//     const answer = await this.pc!.createAnswer();
//     await this.pc!.setLocalDescription(answer);

//     SocketUtil.emit('webrtc.answer', {
//       from_userId: to_userId,
//       to_userId: from_userId,
//       sdp: answer,
//     });
//   }

//   async handleAnswer(sdp: any) {
//     if (!this.pc) return;
//     await this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
//   }

//   async handleCandidate(candidate: any) {
//     if (!this.pc) return;
//     try {
//       await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
//     } catch (e) {
//       console.error('addIceCandidate error', e);
//     }
//   }

//   async endCall() {
//     try {
//       this.localStream?.getTracks().forEach((t: any) => t.stop());
//       this.pc?.close();
//     } catch {}
//     this.pc = null;
//     this.localStream = null;
//     this.remoteStream = null;
//     this.remoteUserId = null;
//     this.isCaller = false;
//   }
// }

// export default new WebRTCClient();
