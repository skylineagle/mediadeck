import { api } from "@/trpc/server";
import { TimeAgo } from "@/components/time-ago";

export async function Sessions() {
  const rtspSessions = await api.session.listRtspSessions();
  const rtmpSessions = await api.session.listRtmpSessions();
  const webRtcSessions = await api.session.listWebRtcSessions();
  const hlsSessions = await api.session.listHlsSessions();
  const srtSessions = await api.session.listSrtSessions();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-semibold">RTSP Sessions</h3>
        <div className="space-y-2">
          {rtspSessions?.map((session) => (
            <div key={session.id} className="rounded border p-2 text-sm">
              <div>Path: {session.path}</div>
              <div>State: {session.state}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-semibold">RTMP Sessions</h3>
        <div className="space-y-2">
          {rtmpSessions?.map((session) => (
            <div key={session.id} className="rounded border p-2 text-sm">
              <div>Path: {session.path}</div>
              <div>State: {session.state}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-semibold">WebRTC Sessions</h3>
        <div className="space-y-2">
          {webRtcSessions?.map((session) => (
            <div key={session.id} className="rounded border p-2 text-sm">
              <div>Path: {session.path}</div>
              <div>State: {session.state}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-semibold">HLS Sessions</h3>
        <div className="space-y-2">
          {hlsSessions?.map((session) => (
            <div key={session.path} className="rounded border p-2 text-sm">
              <div>Path: {session.path}</div>
              {session.lastRequest && (
                <div>
                  Last Request: <TimeAgo date={new Date(session.lastRequest)} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-semibold">SRT Sessions</h3>
        <div className="space-y-2">
          {srtSessions?.map((session) => (
            <div key={session.id} className="rounded border p-2 text-sm">
              <div>Path: {session.path}</div>
              <div>State: {session.state}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
