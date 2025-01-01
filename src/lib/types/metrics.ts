export interface PathMetrics {
  name: string;
  state: string;
  bytesReceived: number;
  bytesSent: number;
}

export interface HLSMuxerMetrics {
  name: string;
  bytesSent: number;
}

export interface RTSPConnectionMetrics {
  id: string;
  bytesReceived: number;
  bytesSent: number;
}

export interface RTSPSessionMetrics {
  id: string;
  state: string;
  bytesReceived: number;
  bytesSent: number;
  rtpPacketsReceived: number;
  rtpPacketsSent: number;
  rtpPacketsLost: number;
  rtpPacketsInError: number;
  rtpPacketsJitter: number;
  rtcpPacketsReceived: number;
  rtcpPacketsSent: number;
  rtcpPacketsInError: number;
}

export interface RTMPConnectionMetrics {
  id: string;
  state: string;
  bytesReceived: number;
  bytesSent: number;
}

export interface SRTConnectionMetrics {
  id: string;
  state: string;
  bytesReceived: number;
  bytesSent: number;
  bytesSentUnique: number;
  bytesReceivedUnique: number;
  bytesReceivedLoss: number;
  bytesRetrans: number;
  bytesReceivedRetrans: number;
  bytesSendDrop: number;
  bytesReceivedDrop: number;
  bytesReceivedUndecrypt: number;
  bytesAvailSendBuf: number;
  bytesAvailReceiveBuf: number;
  bytesMss: number;
  bytesSendBuf: number;
  bytesReceiveBuf: number;
  packetsSent: number;
  packetsReceived: number;
  packetsSentUnique: number;
  packetsReceivedUnique: number;
  packetsSendLoss: number;
  packetsReceivedLoss: number;
  packetsRetrans: number;
  packetsReceivedRetrans: number;
  packetsSentAck: number;
  packetsReceivedAck: number;
  packetsSentNak: number;
  packetsReceivedNak: number;
  packetsSentKm: number;
  packetsReceivedKm: number;
  packetsSendDrop: number;
  packetsReceivedDrop: number;
  packetsReceivedUndecrypt: number;
  packetsFlowWindow: number;
  packetsFlightSize: number;
  packetsReorderTolerance: number;
  packetsReceivedAvgBelatedTime: number;
  packetsSendBuf: number;
  packetsReceiveBuf: number;
  usSndDuration: number;
  usPacketsSendPeriod: number;
  msRtt: number;
  msSendBuf: number;
  msSendTsbPdDelay: number;
  msReceiveBuf: number;
  msReceiveTsbPdDelay: number;
  mbpsSendRate: number;
  mbpsReceiveRate: number;
  mbpsLinkCapacity: number;
  mbpsMaxBw: number;
  packetsSendLossRate: number;
  packetsReceivedLossRate: number;
}

export interface WebRTCSessionMetrics {
  id: string;
  state: string;
  bytesReceived: number;
  bytesSent: number;
}

export interface MediaServerMetrics {
  paths: PathMetrics[];
  hlsMuxers: HLSMuxerMetrics[];
  rtspConnections: RTSPConnectionMetrics[];
  rtspSessions: RTSPSessionMetrics[];
  rtmpConnections: RTMPConnectionMetrics[];
  srtConnections: SRTConnectionMetrics[];
  webrtcSessions: WebRTCSessionMetrics[];
}
