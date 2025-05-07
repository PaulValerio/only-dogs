"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles4 from "./style4.module.css";
import Link from "next/link";

export default function MatchChat() {
  const searchParams = useSearchParams();
  const matchId = searchParams.get("matchId");
  const matchName = searchParams.get("matchName") ?? "No Matched Yet!";
  const matchUrl = searchParams.get("matchUrl") ?? "/images/defaultDog.png";

  const [messages, setMessages] = useState<
    { id: number; sender_id: number; receiver_id: number; message: string }[]
  >([]);

  const [currentMessage, setCurrentMessage] = useState("");
  const [currentDogId, setCurrentDogId] = useState<number | null>(null);

  const [matches, setMatches] = useState<
    { id: number; name: string; imageUrl: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/currentDogID");
      const data = await res.json();
      setCurrentDogId(data.currentDogId);
    };

    const fetchMatches = async () => {
      const res = await fetch("/api/matches");
      const data = await res.json();
      setMatches(data);
    };

    fetchData();
    fetchMatches();
  }, []);

  const currentUserId = currentDogId;
  const chatPartnerId = matchId ? Number(matchId) : null;

  useEffect(() => {
    if (currentDogId === null || chatPartnerId === null) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/message/fetch", {
          method: "POST",
          body: JSON.stringify({
            dog1Id: currentDogId,
            dog2Id: chatPartnerId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.error("Fetch failed with status:", res.status);
          return;
        }

        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [currentDogId, chatPartnerId]);

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    await fetch("/api/message/send", {
      method: "POST",
      body: JSON.stringify({
        senderId: currentUserId,
        receiverId: chatPartnerId,
        message: currentMessage,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setCurrentMessage("");
  };

  return (
    <div className={styles4.grid1}>
      <aside className={styles4.chats}>
        <h1 className={styles4.font_size1}>Chats</h1>

        <div className={styles4.chats_content}>
          {matches.map((match) => {
            const isActive = match.id === Number(matchId);

            return (
              <Link
                href={`/message?matchId=${match.id}&matchName=${encodeURIComponent(
                  match.name,
                )}&matchUrl=${encodeURIComponent(match.imageUrl)}`}
                key={match.id}
              >
                <div
                  className={
                    isActive ? styles4.highlight : styles4.no_highlight
                  }
                >
                  <div className={styles4.flex1}>
                    <img
                      src={match.imageUrl}
                      alt={match.name}
                      className={styles4.profile1}
                    />
                    <h1>{match.name}</h1>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </aside>

      <div className={styles4.messages}>
        <div className={styles4.head}>
          <div className={styles4.flex2}>
            <img
              src={matchUrl}
              alt="Match Profile"
              className={styles4.profile2}
            />
            <h1 className={styles4.font_size1}>
              {matchName === "No Matched Yet!"
                ? "Select Who To Chat"
                : matchName}
            </h1>
          </div>
        </div>

        <div className={styles4.message_area}>
          {currentUserId !== null &&
            messages.map((msg) =>
              msg.sender_id === currentUserId ? (
                <div key={msg.id} className={styles4.message_currentUser}>
                  <div className={styles4.messageContainer_currentUser}>
                    <p>{msg.message}</p>
                  </div>
                </div>
              ) : (
                <div key={msg.id} className={styles4.message_otherUser}>
                  <div className={styles4.messageContainer_otherUser}>
                    <p>{msg.message}</p>
                  </div>
                </div>
              ),
            )}
        </div>

        <div className={styles4.text_container}>
          <div className={styles4.text_area}>
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              className={styles4.text_input}
              placeholder="Type a message..."
            />
            <button className={styles4.send_button} onClick={sendMessage}>
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
