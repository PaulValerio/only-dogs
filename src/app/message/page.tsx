"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import styles4 from "./style4.module.css";
import Link from "next/link";
import MatchChat from "./MatchChat";
import { Suspense } from "react";

export default function Message() {
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
                <Link href={"/date"}>Date</Link>
              </div>
              <div className={styles4.button1_active}>Message</div>
            </div>
          </nav>

          <div className={styles4.userButtonFloat}>
            <UserButton />
          </div>

          <div className={styles4.body}>
            <Suspense fallback={<div>Loading chat...</div>}>
              <MatchChat />
            </Suspense>
          </div>

          <footer className={styles4.footer}>
            © 2025 OnlyDogs. All rights reserved.
          </footer>
        </section>
      </SignedIn>
    </main>
  );
}