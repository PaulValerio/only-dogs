import { SignedIn, UserButton } from "@clerk/nextjs";
import styles3 from "./style3.module.css";
import Link from "next/link";

export default function Home() {
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
              <div className={styles3.dog_picture}>
                <img src="/images/Huskey.jpg" alt="No Dog" />
              </div>

              <div className={styles3.dog_info}>
                <div className={styles3.dog_info_content}>
                  <p>Name: Max</p>
                  <p>Age: 3</p>
                </div>

                <div className={styles3.dog_info_content}>
                  <p>Gender: Male</p>
                  <p>Breed: Husky</p>
                </div>

                <p>Municipality/City: Arayat</p>

                <div className={styles3.dog_info_content}>
                    <div className={styles3.reject_button}>✕</div>
                    <div className={styles3.accept_button}>♥</div>
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
