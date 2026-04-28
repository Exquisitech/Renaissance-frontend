"use client";

import { useEffect, useState } from "react";

export function useDisputeUpdates(onUpdate: () => void) {
  const [transport, setTransport] = useState<"websocket" | "broadcast" | "polling">(
    "polling",
  );

  useEffect(() => {
    let socket: WebSocket | null = null;
    let channel: BroadcastChannel | null = null;

    const handleUpdate = () => onUpdate();
    window.addEventListener("dispute-updated", handleUpdate);

    if ("BroadcastChannel" in window) {
      channel = new BroadcastChannel("dispute-updates");
      channel.onmessage = () => {
        setTransport("broadcast");
        onUpdate();
      };
    }

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      socket = new WebSocket(`${protocol}//${window.location.host}/ws/disputes`);

      socket.onopen = () => {
        setTransport("websocket");
      };

      socket.onmessage = () => {
        onUpdate();
      };

      socket.onerror = () => {
        socket?.close();
        setTransport((current) => (current === "websocket" ? "broadcast" : current));
      };
    } catch {
      setTransport("broadcast");
    }

    const pollId = window.setInterval(() => {
      setTransport((current) => (current === "websocket" ? current : "polling"));
      onUpdate();
    }, 15000);

    return () => {
      window.removeEventListener("dispute-updated", handleUpdate);
      channel?.close();
      socket?.close();
      window.clearInterval(pollId);
    };
  }, [onUpdate]);

  return transport;
}
