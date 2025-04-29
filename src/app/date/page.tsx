"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import styles3 from "./style3.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDogImage, getDogInfo } from "~/server/queries";
import { acceptDog } from "~/server/action";

export const dynamic = "force-dynamic";

export default function Date() {
  const [currentDogId, setCurrentDogId] = useState<number | null>(null);

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

      const res = await fetch("/api/currentDogID");
      const data = await res.json();

      setCurrentDogId(data.currentDogId);
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
      alert("🎉 It's a match!");
    }
  };

  const handleReject = (e: React.MouseEvent) => {
    const button = e.currentTarget;
    const dogCard = button.closest(`.${styles3.card_container}`);
    dogCard!.classList.add(styles3.swipeLeft!);
  };

  return (
    <main className={styles3.main}>
      <SignedIn>
        <section className={styles3.parent_grid}>
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
              <div className={styles3.button1}>Message</div>
            </div>
          </nav>

          <div className={styles3.userButtonFloat}>
            <UserButton />
          </div>

          <div className={styles3.body}>
            {dogs
              .filter((dog) => dog.id !== currentDogId)
              .map((dog) => (
                <div key={dog.id} className={styles3.card_container}>
                  <div className={styles3.dog_picture}>
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
                        onClick={(e) => handleReject(e)}
                      >
                        ✕
                      </div>
                      <div
                        className={styles3.accept_button}
                        onClick={(e) => handleAccept(e, dog.id)}
                      >
                        ♥
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <footer className={styles3.footer}>
            © 2025 OnlyDogs. All rights reserved.
          </footer>
        </section>
      </SignedIn>
    </main>
  );
}
