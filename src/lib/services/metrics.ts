import type { MediaServerMetrics } from "../types/metrics";

function parseMetricsLine(line: string): {
  name?: string;
  labels: Record<string, string>;
  value: number;
} | null {
  // Skip comments and empty lines
  if (line.startsWith("#") || line.trim() === "") return null;

  // Match the line format: name{label="value",...} value
  const match = /^([^{]+){([^}]+)}(?:\s+(.+))?$/.exec(line);
  if (!match) return null;
  const [, name, labelsStr, valueStr] = match;
  const value = parseFloat(valueStr ?? "0");
  if (isNaN(value)) return null;

  // Parse labels
  const labels = Object.fromEntries(
    labelsStr?.split(",").map((label) => {
      const [key, value] = label.split("=");
      return [key?.trim(), value?.replace(/"/g, "").trim()];
    }) ?? [],
  );

  return { name: name?.trim(), labels, value };
}

export async function fetchMetrics(): Promise<MediaServerMetrics> {
  const response = await fetch("http://localhost:9998/metrics");
  if (!response.ok) throw new Error("Failed to fetch metrics");

  const text = await response.text();
  const lines = text.split("\n");

  const metrics: MediaServerMetrics = {
    paths: [],
    hlsMuxers: [],
    rtspConnections: [],
    rtspSessions: [],
    rtmpConnections: [],
    srtConnections: [],
    webrtcSessions: [],
  };

  const pathsMap = new Map();
  const hlsMuxersMap = new Map();
  const rtspConnsMap = new Map();
  const rtspSessionsMap = new Map();
  const rtmpConnsMap = new Map();
  const srtConnsMap = new Map();
  const webrtcSessionsMap = new Map();

  for (const line of lines) {
    const parsed = parseMetricsLine(line);
    if (!parsed) continue;

    const { name, labels, value } = parsed;

    // Handle paths metrics
    if (name?.startsWith("paths")) {
      const pathName = labels.name;
      if (!pathsMap.has(pathName)) {
        pathsMap.set(pathName, {
          name: pathName,
          state: labels.state ?? "unknown",
          bytesReceived: 0,
          bytesSent: 0,
        });
      }
      const path = pathsMap.get(pathName);
      if (name === "paths_bytes_received") path.bytesReceived = value;
      if (name === "paths_bytes_sent") path.bytesSent = value;
    }

    // Handle HLS muxers
    if (name?.startsWith("hls_muxers")) {
      const muxerName = labels.name;
      if (!hlsMuxersMap.has(muxerName)) {
        hlsMuxersMap.set(muxerName, {
          name: muxerName,
          bytesSent: 0,
        });
      }
      const muxer = hlsMuxersMap.get(muxerName);
      if (name === "hls_muxers_bytes_sent") muxer.bytesSent = value;
    }

    // Handle RTSP connections
    if (name?.startsWith("rtsp_conns")) {
      const connId = labels.id;
      if (!rtspConnsMap.has(connId)) {
        rtspConnsMap.set(connId, {
          id: connId,
          bytesReceived: 0,
          bytesSent: 0,
        });
      }
      const conn = rtspConnsMap.get(connId);
      if (name === "rtsp_conns_bytes_received") conn.bytesReceived = value;
      if (name === "rtsp_conns_bytes_sent") conn.bytesSent = value;
    }

    // Handle SRT connections (example for a few metrics)
    if (name?.startsWith("srt_conns")) {
      const connId = labels.id;
      if (!srtConnsMap.has(connId)) {
        srtConnsMap.set(connId, {
          id: connId,
          state: labels.state ?? "unknown",
          bytesReceived: 0,
          bytesSent: 0,
          bytesSentUnique: 0,
          bytesReceivedUnique: 0,
          bytesReceivedLoss: 0,
          bytesRetrans: 0,
          bytesReceivedRetrans: 0,
          bytesSendDrop: 0,
          bytesReceivedDrop: 0,
          bytesReceivedUndecrypt: 0,
          bytesAvailSendBuf: 0,
          bytesAvailReceiveBuf: 0,
          bytesMss: 0,
          bytesSendBuf: 0,
          bytesReceiveBuf: 0,
          packetsSent: 0,
          packetsReceived: 0,
          packetsSentUnique: 0,
          packetsReceivedUnique: 0,
          packetsSendLoss: 0,
          packetsReceivedLoss: 0,
          packetsRetrans: 0,
          packetsReceivedRetrans: 0,
          packetsSentAck: 0,
          packetsReceivedAck: 0,
          packetsSentNak: 0,
          packetsReceivedNak: 0,
          packetsSentKm: 0,
          packetsReceivedKm: 0,
          packetsSendDrop: 0,
          packetsReceivedDrop: 0,
          packetsReceivedUndecrypt: 0,
          packetsFlowWindow: 0,
          packetsFlightSize: 0,
          packetsReorderTolerance: 0,
          packetsReceivedAvgBelatedTime: 0,
          packetsSendBuf: 0,
          packetsReceiveBuf: 0,
          usSndDuration: 0,
          usPacketsSendPeriod: 0,
          msRtt: 0,
          msSendBuf: 0,
          msSendTsbPdDelay: 0,
          msReceiveBuf: 0,
          msReceiveTsbPdDelay: 0,
          mbpsSendRate: 0,
          mbpsReceiveRate: 0,
          mbpsLinkCapacity: 0,
          mbpsMaxBw: 0,
          packetsSendLossRate: 0,
          packetsReceivedLossRate: 0,
        });
      }
      const conn = srtConnsMap.get(connId);

      // Map metric names to object properties
      const metricMapping: Record<string, keyof typeof conn> = {
        srt_conns_bytes_received: "bytesReceived",
        srt_conns_bytes_sent: "bytesSent",
        srt_conns_bytes_sent_unique: "bytesSentUnique",
        // ... add all other metrics mappings
      };

      const property = metricMapping[name];
      if (property) {
        conn[property] = value;
      }
    }

    // Handle RTSP sessions metrics
    if (name?.startsWith("rtsp_sessions")) {
      const sessionId = labels.id;
      if (!rtspSessionsMap.has(sessionId)) {
        rtspSessionsMap.set(sessionId, {
          id: sessionId,
          state: labels.state ?? "unknown",
          bytesReceived: 0,
          bytesSent: 0,
          rtpPacketsReceived: 0,
          rtpPacketsSent: 0,
          rtpPacketsLost: 0,
          rtpPacketsInError: 0,
          rtpPacketsJitter: 0,
          rtcpPacketsReceived: 0,
          rtcpPacketsSent: 0,
          rtcpPacketsInError: 0,
        });
      }
      const session = rtspSessionsMap.get(sessionId);

      // Update state from base metric
      if (name === "rtsp_sessions") {
        session.state = labels.state ?? "unknown";
      }

      // Map metric names to object properties
      const metricMapping: Record<string, keyof typeof session> = {
        rtsp_sessions_bytes_received: "bytesReceived",
        rtsp_sessions_bytes_sent: "bytesSent",
        rtsp_sessions_rtp_packets_received: "rtpPacketsReceived",
        rtsp_sessions_rtp_packets_sent: "rtpPacketsSent",
        rtsp_sessions_rtp_packets_lost: "rtpPacketsLost",
        rtsp_sessions_rtp_packets_in_error: "rtpPacketsInError",
        rtsp_sessions_rtp_packets_jitter: "rtpPacketsJitter",
        rtsp_sessions_rtcp_packets_received: "rtcpPacketsReceived",
        rtsp_sessions_rtcp_packets_sent: "rtcpPacketsSent",
        rtsp_sessions_rtcp_packets_in_error: "rtcpPacketsInError",
      };

      const property = metricMapping[name];
      if (property) {
        session[property] = value;
      }
    }
  }

  metrics.paths = Array.from(pathsMap.values());
  metrics.hlsMuxers = Array.from(hlsMuxersMap.values());
  metrics.rtspConnections = Array.from(rtspConnsMap.values());
  metrics.rtspSessions = Array.from(rtspSessionsMap.values());
  metrics.rtmpConnections = Array.from(rtmpConnsMap.values());
  metrics.srtConnections = Array.from(srtConnsMap.values());
  metrics.webrtcSessions = Array.from(webrtcSessionsMap.values());

  return metrics;
}
