"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import styles3 from "./style3.module.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getMatches, getDogImage, getDogInfo } from "~/server/queries";
import { acceptDog, rejectDog } from "~/server/action";

export const dynamic = "force-dynamic";

export default function Date() {
  const [currentDogId, setCurrentDogId] = useState<number | null>(null);

  const [matchDog, setMatchDog] = useState<null | (typeof dogs)[0]>(null);

  const [dogs, setDogs] = useState<
    {
      id: number;
      name_dog: string;
      age: number;
      gender: string;
      breed: string;
      location: string;
      url: string;
    }[]
  >([]);

  const lastMatchIdRef = useRef<number | null>(null);

  const combinedRef = useRef<
    {
      id: number;
      name_dog: string;
      age: number;
      gender: string;
      breed: string;
      location: string;
      url: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const images = await getDogImage();
      const infos = await getDogInfo();

      const combined = infos.map((info) => {
        const image = images.find((img) => img.id === info.id);
        return {
          ...info,
          url: image ? image.url : "/images/defaultDog.png",
        };
      });

      setDogs(combined);
      combinedRef.current = combined;

      const storedMatch = localStorage.getItem("matchDog");

      if (storedMatch) {
        try {
          const parsed = JSON.parse(storedMatch);
          setMatchDog(parsed);
        } catch {
          localStorage.removeItem("matchDog");
        }
      }

      const res = await fetch("/api/currentDogID");
      const data = await res.json();

      const currentDogId = data.currentDogId;
      setCurrentDogId(currentDogId);

      if (currentDogId) {
        const interval = setInterval(async () => {
          const matchList = await getMatches(currentDogId);
          const latest = matchList[matchList.length - 1];

          if (latest && latest.id !== lastMatchIdRef.current) {
            const matchDogId =
              latest.dog1_id === currentDogId ? latest.dog2_id : latest.dog1_id;

            const matchedDog = combinedRef.current.find(
              (dog) => dog.id === matchDogId,
            );

            if (matchedDog) {
              setMatchDog(matchedDog);
              localStorage.setItem("matchDog", JSON.stringify(matchedDog));
              lastMatchIdRef.current = latest.id;
            }
          }
        }, 5000);

        return () => clearInterval(interval);
      }
    };

    fetchData();
  }, []);

  const handleAccept = async (e: React.MouseEvent, targetDogId: number) => {
    const button = e.currentTarget;
    const dogCard = button.closest(`.${styles3.card_container}`);
    dogCard!.classList.add(styles3.swipeRight!);

    if (!currentDogId) return;

    const result = await acceptDog(currentDogId, targetDogId);

    if (result.matched) {
      const matchedDog = dogs.find((dog) => dog.id === targetDogId);
      setMatchDog(matchedDog ?? null);
    }
  };

  const handleReject = async (e: React.MouseEvent, targetDogId: number) => {
    const button = e.currentTarget;
    const dogCard = button.closest(`.${styles3.card_container}`);
    dogCard!.classList.add(styles3.swipeLeft!);

    if (!currentDogId) return;
    await rejectDog(currentDogId, targetDogId);
  };

  return (
    <main className={styles3.main}>
      <SignedIn>
        <section className={styles3.parent_grid}>
          <input
            type="checkbox"
            id="toggle"
            className={styles3.toggle}
            hidden
          />

          <nav className={styles3.navBar}>
            <div className={styles3.website_title}>
              <img src="/images/HomeLogo.png" alt="NoLogo" />
              <div className={styles3.title_wrap}>
                <div className={styles3.onlydogs}>
                  <h1>
                    Only<span>Dogs</span>
                  </h1>
                </div>
                <h1 className={styles3.dogstyle}>
                  Dog<span>style</span>
                </h1>
              </div>
            </div>

            <div className={styles3.buttons_container}>
              <div className={styles3.button1_active}>Date</div>
              <div className={styles3.button1}>
                {matchDog ? (
                  <Link
                    href={{
                      pathname: "/message",
                      query: {
                        matchId: matchDog.id,
                        matchName: matchDog.name_dog,
                        matchUrl: matchDog.url,
                      },
                    }}
                  >
                    Message
                  </Link>
                ) : (
                  <Link href="/message">Message</Link>
                )}
              </div>
            </div>
          </nav>

          <div className={styles3.userButtonFloat}>
            <UserButton />
          </div>

          <input
            type="checkbox"
            id="toggle"
            className={styles3.toggle}
            hidden
          />

          <div className={styles3.body}>
            <div
              className={`${styles3.heart_container} ${matchDog ? styles3.animate : ""}`}
            >
              <div>❤️</div>
              <div>❤️</div>
              <div>❤️</div>
              <div>❤️</div>
              <div>❤️</div>
              <div>❤️</div>
              <div>❤️</div>
              <div>❤️</div>
              <div>❤️</div>
              <div>❤️</div>
            </div>

            <div
              className={`${styles3.pageContent} ${matchDog ? styles3.blurred : ""}`}
            >
              {dogs.map((dog) => (
                <div key={dog.id} className={styles3.card_container}>
                  <div className={styles3.dog_picture1}>
                    <img src={dog.url} />
                  </div>

                  <div className={styles3.dog_info}>
                    <div className={styles3.dog_info_content}>
                      <p>Name: {dog.name_dog}</p>
                      <p>Age: {dog.age}</p>
                    </div>

                    <div className={styles3.dog_info_content}>
                      <p>Gender: {dog.gender}</p>
                      <p>Breed: {dog.breed}</p>
                    </div>

                    <p>Municipality/City: {dog.location}</p>

                    <div className={styles3.dog_info_content}>
                      <div
                        className={styles3.reject_button}
                        onClick={(e) => handleReject(e, dog.id)}
                      >
                        <i className="fa-solid fa-heart-crack"></i>
                      </div>
                      <div
                        className={styles3.accept_button}
                        onClick={(e) => handleAccept(e, dog.id)}
                      >
                        <i className="fa-solid fa-heart"></i>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className={`${styles3.alert_container} ${matchDog ? styles3.show : ""}`}
            >
              {matchDog && (
                <div className={styles3.alert} key={matchDog.id}>
                  <h1>🎉 It's A Match!</h1>

                  <p>You Can Now Message {matchDog.name_dog}.</p>

                  <div className={styles3.dog_picture2}>
                    <img src={matchDog.url} />
                  </div>

                  <div className={styles3.alert_buttons}>
                    <div
                      className={styles3.cancel_button}
                      onClick={() => {
                        setMatchDog(null);
                        localStorage.removeItem("matchDog");
                      }}
                    >
                      Cancel
                    </div>
                    <div
                      className={styles3.message_button}
                      onClick={() => {
                        if (!matchDog) return;
                        localStorage.removeItem("matchDog");
                        const query = new URLSearchParams({
                          matchId: matchDog.id.toString(),
                          matchName: matchDog.name_dog,
                          matchUrl: matchDog.url,
                        }).toString();
                        window.location.href = `/message?${query}`;
                      }}
                    >
                      Message
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={styles3.toggle_container}>
              <label htmlFor="toggle" className={styles3.light_darkMode}>
                <div className={styles3.sun_moon}></div>

                <div className={styles3.cloud1}>
                  <i className="fa-solid fa-cloud"></i>
                </div>
                <div className={styles3.cloud2}>
                  <i className="fa-solid fa-cloud"></i>
                </div>

                <div className={styles3.moon_crater1}></div>
                <div className={styles3.moon_crater2}></div>
                <div className={styles3.moon_crater3}></div>

                <div className={styles3.star1}>
                  <i className="fa-solid fa-star"></i>
                </div>
                <div className={styles3.star2}>
                  <i className="fa-solid fa-star"></i>
                </div>
                <div className={styles3.star3}>
                  <i className="fa-solid fa-star"></i>
                </div>
              </label>
            </div>
          </div>

          <footer className={styles3.footer}>
            © 2025 OnlyDogs. All rights reserved.
          </footer>
        </section>
      </SignedIn>
    </main>
  );
}
