"use client";

import { useEffect, useState } from "react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import styles4 from "./style4.module.css";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Message() {
  const searchParams = useSearchParams();
  const matchId = searchParams.get("matchId");
  const matchName = searchParams.get("matchName") ?? "No Matched Yet!";
  const matchUrl = searchParams.get("matchUrl") ?? "/images/defaultDog.png";

  const [messages, setMessages] = useState<
    { id: number; from: number; to: number; content: string }[]
  >([]);

  const [currentMessage, setCurrentMessage] = useState("");

  const [currentDogId, setCurrentDogId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/currentDogID");
      const data = await res.json();

      setCurrentDogId(data.currentDogId);
    };
    fetchData();
  }, []);

  const currentUserId = currentDogId;
  const chatPartnerId = matchId ? Number(matchId) : null;

  useEffect(() => {
    if (!currentDogId || !chatPartnerId) return;

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
          console.error("Failed to fetch messages: " + res.status);
          return;
        }

        const data = await res.json();
        console.log("CurrentUserId:", currentUserId);
        console.log("ChatPartnerId:", chatPartnerId);
        console.log("Fetched messages:", data);
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 1000);
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
    <main className={styles4.main}>
      <SignedIn>
        <section className={styles4.parent_grid}>
          <nav className={styles4.navBar}>
            <div className={styles4.website_title}>
              <img src="/images/HomeLogo.png" alt="NoLogo" />
              <div className={styles4.title_wrap}>
                <div className={styles4.onlydogs}>
                  <h1>
                    Only<span>Dogs</span>
                  </h1>
                </div>
                <h1 className={styles4.dogstyle}>
                  Dog<span>style</span>
                </h1>
              </div>
            </div>
            <div className={styles4.buttons_container}>
              <div className={styles4.button1}>
                <Link href={"./date"}>Date</Link>
              </div>
              <div className={styles4.button1_active}>Message</div>
            </div>
          </nav>

          <div className={styles4.userButtonFloat}>
            <UserButton />
          </div>

          <div className={styles4.body}>
            <div className={styles4.grid1}>
              <aside className={styles4.chats}>
                <h1 className={styles4.font_size1}>Chats</h1>

                <div className={styles4.chats_content}>
                  <div className={styles4.flex1}>
                    <img
                      src={matchUrl}
                      alt="Match Profile"
                      className={styles4.profile1}
                    />
                    <h1>{matchName}</h1>
                  </div>
                </div>
              </aside>

              <div className={styles4.messages}>
                <div className={styles4.head}>
                  <div className={styles4.flex1}>
                    <img
                      src={matchUrl}
                      alt="Match Profile"
                      className={styles4.profile2}
                    />
                    <h1 className={styles4.font_size1}>{matchName}</h1>
                  </div>
                </div>

                <div className={styles4.message_area}>
                  {currentUserId !== null &&
                    messages.map((msg) =>
                      msg.from === currentUserId ? (
                        <div
                          key={msg.id}
                          className={styles4.message_currentUser}
                        >
                          <div className={styles4.messageContainer_currentUser}>
                            <p>{msg.content}</p>
                          </div>
                        </div>
                      ) : (
                        <div key={msg.id} className={styles4.message_otherUser}>
                          <div className={styles4.messageContainer_otherUser}>
                            <p>{msg.content}</p>
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
                    <button
                      className={styles4.send_button}
                      onClick={sendMessage}
                    >
                      ➤
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className={styles4.footer}>
            © 2025 OnlyDogs. All rights reserved.
          </footer>
        </section>
      </SignedIn>
    </main>
  );
}
