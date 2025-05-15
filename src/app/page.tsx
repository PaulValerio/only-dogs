"use client";

import { SignedOut, SignUpButton, SignedIn, UserButton } from "@clerk/nextjs";
import styles1 from "./style1.module.css";
import styles2 from "./style2.module.css";
import { useUploadThing } from "~/utils/uploadthing";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export default function Home() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/dog")
      .then((res) => res.json())
      .then((data) => {
        router.refresh();
        if (data.hasDogProfile) {
          router.push("/date");
        }
      });
  }, []);

  const showToast = (message: string) => {
    const toast = document.createElement("div");
    toast.className = styles2.toast!;
    toast.textContent = message;

    const container = document.getElementById("toast-container");
    container?.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 4000);
  };

  const { startUpload } = useUploadThing("imageUploader", {
    onUploadBegin: () => {
      showToast("⏳ Upload Image Started");
    },
    onClientUploadComplete: () => {
      showToast("✅ Upload Image Completed");
      router.refresh();
    },
    onUploadError: (error: Error) => {
      showToast(`❌ ERROR! ${error.message}`);
      router.refresh();
    },
  });

  const checkString = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const gender = e.target.value;

    if (/^\d+$/.test(gender)) {
      showToast("❌ Input should not be a number");
      e.target.value = "";
    }
  };

  const checkDogAge = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const age = Number(e.target.value);

    if (isNaN(age)) {
      showToast("❌ Please enter a valid age");
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("dog-name");
    const age = formData.get("dog-age");
    const gender = formData.get("dog-gender");
    const breed = formData.get("dog-breed");
    const location = formData.get("location");
    const dog_picture = formData.get("dog-picture");

    await startUpload([dog_picture as File]);

    const res = await fetch("/api/dog", {
      method: "POST",
      body: JSON.stringify({ name, age, gender, breed, location }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      showToast("✅ Dog Info Submitted!");
      router.refresh();
      setTimeout(() => {
        router.push("/date");
      }, 1500);
    } else {
      showToast("❌ Failed To Submit Dog Info");
    }
  };

  return (
    <main>
      <SignedOut>
        <main className={styles1.main}>
          <section className={styles1.parent_grid}>
            <input
              type="checkbox"
              id="toggle"
              className={styles1.toggle}
              hidden
            />

            <nav className={styles1.navBar}>
              <div className={styles1.website_title}>
                <img src="/images/HomeLogo.png" alt="NoLogo" />

                <div className={styles1.title_wrap}>
                  <div className={styles1.onlydogs}>
                    <h1>
                      Only<span>Dogs</span>
                    </h1>
                  </div>
                  <h1 className={styles1.dogstyle}>
                    Dog<span>style</span>
                  </h1>
                </div>
              </div>

              <SignUpButton>
                <div className={styles1.login_button}>
                  <p>Login</p>
                </div>
              </SignUpButton>
            </nav>

            <input
              type="checkbox"
              id="toggle"
              className={styles1.toggle}
              hidden
            />

            <div className={styles1.body}>
              <div className={styles1.content1}>
                <h1>Find Your Dog's Perfect Match</h1>
                <p>
                  OnlyDogs is the dating app for your furry friends. Connect
                  with other dog owners in your area, arrange dates, and help
                  your dog find their soulmate!
                </p>
                <img src="/images/Doggies.png" alt="Noimg" />
              </div>

              <div className={styles1.content2}>
                <div className={styles1.h1}>
                  <h1>How It Works</h1>
                </div>

                <div className={styles1.cards1}>
                  <div className={styles1.card1}>
                    <div className={styles1.img_wrapper}>
                      <img
                        src="/images/SignIn.png"
                        alt="Noimg"
                        className={styles1.img1}
                      />

                      <img
                        src="/images/SignIn.gif"
                        alt="Noimg"
                        className={styles1.img2}
                      />
                    </div>
                    <h1>Create an Account</h1>
                    <p>
                      Sign up and create an account for your dog including their
                      name, age, breed, gender, and photo.
                    </p>
                  </div>

                  <div className={styles1.card1}>
                    <div className={styles1.img_wrapper}>
                      <img
                        src="/images/Love.png"
                        alt="Noimg"
                        className={styles1.img1}
                      />

                      <img
                        src="/images/Love.gif"
                        alt="Noimg"
                        className={styles1.img2}
                      />
                    </div>
                    <h1>Browse Matches</h1>
                    <p>
                      Swipe through potential matches in your area. Accept the
                      ones you like, reject those that aren't a fit.
                    </p>
                  </div>

                  <div className={styles1.card1}>
                    <div className={styles1.img_wrapper}>
                      <img
                        src="/images/Chat.png"
                        alt="Noimg"
                        className={styles1.img1}
                      />

                      <img
                        src="/images/Chat.gif"
                        alt="Noimg"
                        className={styles1.img2}
                      />
                    </div>
                    <h1>Start Chatting</h1>
                    <p>
                      When you match with another dog owner, you can start
                      chatting and arrange a meet-up for your dogs!
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles1.content3}>
                <div className={styles1.h1}>
                  <h1>Why Choose OnlyDogs?</h1>
                </div>

                <div className={styles1.cards1}>
                  <div className={styles1.card1}>
                    <div className={styles1.img_wrapper}>
                      <img
                        src="/images/Secure.png"
                        alt="Noimg"
                        className={styles1.img1}
                      />

                      <img
                        src="/images/Secure.gif"
                        alt="Noimg"
                        className={styles1.img2}
                      />
                    </div>
                    <h1>Safe & Secure</h1>
                    <p>
                      Your information is protected, and we verify all users to
                      ensure a safe community.
                    </p>
                  </div>

                  <div className={styles1.card1}>
                    <div className={styles1.img_wrapper}>
                      <img
                        src="/images/Location.png"
                        alt="Noimg"
                        className={styles1.img1}
                      />

                      <img
                        src="/images/Location.gif"
                        alt="Noimg"
                        className={styles1.img2}
                      />
                    </div>
                    <h1>Location Matching</h1>
                    <p>
                      Find dogs in your neighborhood or city to make meetups
                      convenient and stress-free.
                    </p>
                  </div>

                  <div className={styles1.card1}>
                    <div className={styles1.img_wrapper}>
                      <img
                        src="/images/Interface.png"
                        alt="Noimg"
                        className={styles1.img1}
                      />

                      <img
                        src="/images/Interface.gif"
                        alt="Noimg"
                        className={styles1.img2}
                      />
                    </div>
                    <h1>Easy Interface</h1>
                    <p>
                      Our simple check for accept and cross for reject interface
                      makes finding matches for your dog quick and easy.
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles1.toggle_container}>
                <label htmlFor="toggle" className={styles1.light_darkMode}>
                  <div className={styles1.sun_moon}></div>

                  <div className={styles1.cloud1}>
                    <i className="fa-solid fa-cloud"></i>
                  </div>
                  <div className={styles1.cloud2}>
                    <i className="fa-solid fa-cloud"></i>
                  </div>

                  <div className={styles1.moon_crater1}></div>
                  <div className={styles1.moon_crater2}></div>
                  <div className={styles1.moon_crater3}></div>

                  <div className={styles1.star1}>
                    <i className="fa-solid fa-star"></i>
                  </div>
                  <div className={styles1.star2}>
                    <i className="fa-solid fa-star"></i>
                  </div>
                  <div className={styles1.star3}>
                    <i className="fa-solid fa-star"></i>
                  </div>
                </label>
              </div>
            </div>

            <footer className={styles1.footer}>
              © 2025 OnlyDogs. All rights reserved.
            </footer>
          </section>
        </main>
      </SignedOut>

      <SignedIn>
        <main className={styles2.main}>
          <div className={styles2.userButtonFloat}>
            <UserButton />
          </div>

          <div className={styles2.container1}>
            <h1>
              Welcome to <span className={styles2.span}>Only</span>
              <span>Dogs</span>
            </h1>

            <form onSubmit={handleSubmit} className={styles2.center}>
              <div className={styles2.block1}>
                <h2 className={styles2.h2}>About Your Dog</h2>

                <div className={styles2.flex1}>
                  <input
                    type="text"
                    required
                    onChange={checkString}
                    className={styles2.user_input}
                    id="dog-name"
                    name="dog-name"
                    placeholder=" "
                  />

                  <div className={styles2.user_icon1}>
                    <i className="fa-solid fa-paw fa-sm"></i>
                  </div>

                  <div className={styles2.user_label}>
                    <label htmlFor="dog-name">Name</label>
                  </div>
                </div>

                <div className={styles2.flex1}>
                  <input
                    type="text"
                    required
                    onChange={checkDogAge}
                    className={styles2.user_input}
                    id="dog-age"
                    name="dog-age"
                    placeholder=" "
                  />

                  <div className={styles2.user_icon1}>
                    <i className="fa-solid fa-paw fa-sm"></i>
                  </div>

                  <div className={styles2.user_label}>
                    <label htmlFor="dog-age">Age</label>
                  </div>
                </div>

                <div className={styles2.flex1}>
                  <input
                    type="text"
                    required
                    onChange={checkString}
                    className={styles2.user_input}
                    id="dog-breed"
                    name="dog-breed"
                    placeholder=" "
                  />

                  <div className={styles2.user_icon1}>
                    <i className="fa-solid fa-dog fa-xs"></i>
                  </div>

                  <div className={styles2.user_label}>
                    <label htmlFor="dog-breed">Breed</label>
                  </div>
                </div>

                <div className={styles2.flex1}>
                  <div className={styles2.border_bottom1}>
                    <select
                      required
                      className={styles2.location_gender_input}
                      id="dog-gender"
                      name="dog-gender"
                      defaultValue=""
                    >
                      <option value="" disabled hidden>
                        Select Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div className={styles2.user_icon1}>
                    <i className="fa-solid fa-venus-mars fa-2xs"></i>
                  </div>
                </div>

                <div className={styles2.flex1}>
                  <div className={styles2.border_bottom1}>
                    <input
                      type="file"
                      required
                      accept="image/*"
                      className={styles2.picture_input}
                      id="dog-picture"
                      name="dog-picture"
                    />
                  </div>

                  <div className={styles2.user_icon1}>
                    <i className="fa-solid fa-image fa-sm"></i>
                  </div>
                </div>

                <div className={styles2.flex1}>
                  <div className={styles2.border_bottom1}>
                    <select
                      required
                      className={styles2.location_gender_input}
                      id="location"
                      name="location"
                      defaultValue=""
                    >
                      <option value="" disabled hidden>
                        Select Municipality/City
                      </option>
                      <option value="Angeles">Angeles City</option>
                      <option value="Apalit">Apalit</option>
                      <option value="Arayat">Arayat</option>
                      <option value="Bacolor">Bacolor</option>
                      <option value="Candaba">Candaba</option>
                      <option value="Floridablanca">Floridablanca</option>
                      <option value="Guagua">Guagua</option>
                      <option value="Lubao">Lubao</option>
                      <option value="Mabalacat">Mabalacat City</option>
                      <option value="Macabebe">Macabebe</option>
                      <option value="Magalang">Magalang</option>
                      <option value="Masantol">Masantol</option>
                      <option value="Mexico">Mexico</option>
                      <option value="Minalin">Minalin</option>
                      <option value="Porac">Porac</option>
                      <option value="San Fernando">San Fernando City</option>
                      <option value="San Luis">San Luis</option>
                      <option value="San Simon">San Simon</option>
                      <option value="Santa Ana">Santa Ana</option>
                      <option value="Santa Rita">Santa Rita</option>
                      <option value="Santo Tomas">Santo Tomas</option>
                      <option value="Sasmuan">Sasmuan</option>
                    </select>
                  </div>

                  <div className={styles2.user_icon1}>
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={styles2.button1}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Wait For A Moment" : "Enter"}
              </button>
            </form>
          </div>

          <div id="toast-container" className={styles2.toast_container}></div>
        </main>
      </SignedIn>
    </main>
  );
}
function async(arg0: (e: any) => void) {
  throw new Error("Function not implemented.");
}
