"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles4 from "./style4.module.css";
import Link from "next/link";
import { useUploadThing } from "~/utils/uploadthing";

export default function MatchChat() {
  const searchParams = useSearchParams();
  const matchId = searchParams.get("matchId");
  const matchName = searchParams.get("matchName") ?? "No Matched Yet!";
  const matchUrl = searchParams.get("matchUrl") ?? "/images/defaultDog.png";

  const [messages, setMessages] = useState<
    {
      id: number;
      sender_id: number;
      receiver_id: number;
      message: string;
      imageUrl?: string;
      videoUrl?: string;
    }[]
  >([]);

  const [isSending, setIsSending] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const { startUpload } = useUploadThing("imageUploader");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };

  const handleCloseFile = async () => {
    setPreviewUrl(null);
  };

  const uploadFile = async () => {
    if (!selectedFile) return null;

    const uploaded = await startUpload([selectedFile]);

    if (!uploaded || uploaded.length === 0) return null;

    return {
      url: uploaded[0]!.ufsUrl,
      type: uploaded[0]!.type,
    };
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() && !selectedFile) return;

    setIsSending(true);

    try {
      let uploaded: { url: string; type: string } | null = null;

      if (selectedFile) {
        uploaded = await uploadFile();
      }

      await fetch("/api/message/send", {
        method: "POST",
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId: chatPartnerId,
          message: currentMessage,
          imageUrl: uploaded?.type?.startsWith("image") ? uploaded.url : null,
          videoUrl: uploaded?.type?.startsWith("video") ? uploaded.url : null,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      setCurrentMessage("");
      setSelectedFile(null);
      setPreviewUrl(null);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles4.body}>
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
                  className={styles4.link}
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
                  ? "Select a match to start chatting!"
                  : matchName}
              </h1>
            </div>
          </div>

          <div className={styles4.message_area}>
            {currentUserId !== null &&
              messages.map((msg) => {
                const isSender = msg.sender_id === currentUserId;

                return (
                  <div
                    key={msg.id}
                    className={
                      isSender
                        ? styles4.message_currentUser
                        : styles4.message_otherUser
                    }
                  >
                    <div
                      className={
                        isSender
                          ? styles4.messageContainer_currentUser
                          : styles4.messageContainer_otherUser
                      }
                    >
                      {msg.message && <p>{msg.message}</p>}

                      {msg.imageUrl && (
                        <img
                          src={msg.imageUrl}
                          alt="sent image"
                          className={styles4.chatMedia}
                        />
                      )}

                      {msg.videoUrl && (
                        <video
                          src={msg.videoUrl}
                          controls
                          className={styles4.chatMedia}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          <div className={styles4.text_container}>
            {previewUrl && (
              <div className={styles4.preview}>
                {selectedFile?.type.startsWith("image") ? (
                  <div className={styles4.previewMedia}>
                    <img src={previewUrl} alt="Preview" />

                    <div
                      className={styles4.close_file}
                      onClick={handleCloseFile}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                  </div>
                ) : (
                  <div className={styles4.previewMedia}>
                    <video
                      src={previewUrl}
                      controls
                      className={styles4.previewMedia}
                    />

                    <div
                      className={styles4.close_file}
                      onClick={handleCloseFile}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className={styles4.text_area}>
              <label htmlFor="file-upload" className={styles4.file_upload}>
                <i className="fa-solid fa-paperclip"></i>

                <input
                  type="file"
                  accept="image/*, video/*"
                  id="file-upload"
                  name="file-upload"
                  hidden
                  onChange={handleFileChange}
                />
              </label>

              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                className={styles4.text_input}
                placeholder="Type a message..."
              />
              <button
                className={styles4.send_button}
                onClick={sendMessage}
                disabled={isSending}
              >
                {isSending ? "..." : "➤"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles4.toggle_container}>
        <label htmlFor="toggle" className={styles4.light_darkMode}>
          <div className={styles4.sun_moon}></div>

          <div className={styles4.cloud1}>
            <i className="fa-solid fa-cloud"></i>
          </div>
          <div className={styles4.cloud2}>
            <i className="fa-solid fa-cloud"></i>
          </div>

          <div className={styles4.moon_crater1}></div>
          <div className={styles4.moon_crater2}></div>
          <div className={styles4.moon_crater3}></div>

          <div className={styles4.star1}>
            <i className="fa-solid fa-star"></i>
          </div>
          <div className={styles4.star2}>
            <i className="fa-solid fa-star"></i>
          </div>
          <div className={styles4.star3}>
            <i className="fa-solid fa-star"></i>
          </div>
        </label>
      </div>
    </div>
  );
}
