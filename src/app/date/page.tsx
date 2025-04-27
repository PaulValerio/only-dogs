"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import styles3 from "./style3.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDogImage, getDogInfo } from "~/server/queries";

export default function Home() {
  const [dogImage, setDogImage] = useState<
    {
      id: number;
      name_image: string;
      url: string;
    }[]
  >([]);

  const [dogInfos, setDogInfos] = useState<
    {
      id: number;
      name_dog: string;
      age: number;
      gender: string;
      breed: string;
      location: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const images = await getDogImage();
      const infos = await getDogInfo();
      setDogImage(images);
      setDogInfos(infos);
    };
    fetchData();
  }, []);

  const handleAccept = (e: React.MouseEvent) => {
    const button = e.currentTarget;
    const dogCard = button.closest(`.${styles3.card_container}`);
    dogCard!.classList.add(styles3.swipeRight!);
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
            <div className={styles3.card_container}>
              {dogImage.map((image) => (
                <div key={image.id} className={styles3.dog_picture}>
                  <img src={image.url} alt="No Dog" />
                </div>
              ))}

              <div className={styles3.dog_info}>
                {dogInfos.map((infos) => (
                  <div key={infos.id} className={styles3.dog_info_content}>
                    <p>Name: {infos.name_dog}</p>
                    <p>Age: {infos.age}</p>
                  </div>
                ))}

                {dogInfos.map((infos) => (
                  <div key={infos.id} className={styles3.dog_info_content}>
                    <p>Gender: {infos.gender}</p>
                    <p>Breed: {infos.breed}</p>
                  </div>
                ))}

                {dogInfos.map((infos) => (
                  <div key={infos.id}>
                    <p>Municipality/City: {infos.location}</p>
                  </div>
                ))}

                <div className={styles3.dog_info_content}>
                  <div
                    className={styles3.reject_button}
                    onClick={(e) => handleReject(e)}
                  >
                    ✕
                  </div>
                  <div
                    className={styles3.accept_button}
                    onClick={(e) => handleAccept(e)}
                  >
                    ♥
                  </div>
                </div>
              </div>
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
