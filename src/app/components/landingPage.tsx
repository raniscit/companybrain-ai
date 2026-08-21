"use client";

import {
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0B0F14] text-white">

      {/* ================= NAVBAR ================= */}

      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{
              rotate: 8,
              scale: 1.05,
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-bold text-black"
          >
            C
          </motion.div>

          <span className="text-xl font-semibold tracking-tight">
            CompanyBrain
          </span>
        </div>

        <div className="flex items-center gap-3">

          <SignInButton forceRedirectUrl="/dashboard">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
            >
              Login
            </motion.button>
          </SignInButton>

          <SignUpButton forceRedirectUrl="/dashboard">
            <motion.button
              whileHover={{
                scale: 1.05,
                y: -2,
              }}
              whileTap={{ scale: 0.96 }}
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black"
            >
              Get Started
            </motion.button>
          </SignUpButton>

        </div>
      </motion.nav>


      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden">

        {/* Animated Glow */}

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute left-1/2 top-20 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]"
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-7xl px-6 pb-24 pt-20 text-center lg:px-8 lg:pb-32 lg:pt-28"
        >

          {/* Badge */}

          <motion.div
            variants={fadeUp}
            className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-300 backdrop-blur"
          >
            <motion.span
              animate={{
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="h-2 w-2 rounded-full bg-green-400"
            />

            Your company's knowledge, intelligently connected
          </motion.div>


          {/* Heading */}

          <motion.h1
            variants={fadeUp}
            className="mx-auto max-w-5xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            Turn your company documents into

            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5,
                duration: 0.8,
              }}
              className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent"
            >
              instant answers.
            </motion.span>
            <p className="text-lg tracking-wide">“Your company knowledge stays here. We don’t do leaks, we do answers.”</p>
          </motion.h1>


          {/* Description */}

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-gray-400"
          >
            Upload your company documents, policies, guides, and knowledge.
            Search everything in one place and get intelligent answers based
            on your organization's information.
          </motion.p>


          {/* Buttons */}

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >

            <SignUpButton forceRedirectUrl="/dashboard">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  y: -3,
                  boxShadow: "0px 15px 40px rgba(59,130,246,0.15)",
                }}
                whileTap={{
                  scale: 0.96,
                }}
                className="group flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-black"
              >
                Start Building Your Knowledge Base

                <motion.span
                  whileHover={{ x: 5 }}
                  className="transition"
                >
                  →
                </motion.span>
              </motion.button>
            </SignUpButton>


            <SignInButton forceRedirectUrl="/dashboard">
              <motion.button
                whileHover={{
                  scale: 1.04,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-7 py-3.5 font-medium text-gray-200"
              >
                Sign In
              </motion.button>
            </SignInButton>

          </motion.div>


          <motion.p
            variants={fadeUp}
            className="mt-5 text-sm text-gray-500"
          >
            Secure authentication · Centralized knowledge · Intelligent search
          </motion.p>

        </motion.div>
      </section>


      {/* ================= PRODUCT PREVIEW ================= */}

      <section className="mx-auto max-w-6xl px-6 pb-24 lg:px-8">

        <motion.div
          initial={{
            opacity: 0,
            y: 80,
            scale: 0.96,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
          }}
          whileHover={{
            y: -6,
          }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#11161D] shadow-2xl shadow-black/40"
        >

          {/* Browser Header */}

          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">

            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-3 w-3 rounded-full bg-red-400/70"
            />

            <div className="h-3 w-3 rounded-full bg-yellow-400/70" />

            <div className="h-3 w-3 rounded-full bg-green-400/70" />

            <div className="ml-4 h-8 flex-1 rounded-lg border border-white/5 bg-black/20 px-4 py-1.5 text-xs text-gray-500">
              companybrain.ai/dashboard
            </div>

          </div>


          {/* Dashboard */}

          <div className="grid min-h-[420px] grid-cols-1 lg:grid-cols-[220px_1fr]">

            {/* Sidebar */}

            <div className="hidden border-r border-white/10 p-5 lg:block">

              <div className="mb-8 text-sm font-semibold">
                CompanyBrain
              </div>

              <div className="space-y-2 text-sm">

                {[
                  "Dashboard",
                  "Documents",
                  "Search",
                  "Employees",
                ].map((item, index) => (

                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.1,
                    }}
                    className={
                      index === 0
                        ? "rounded-lg bg-white/10 px-3 py-2.5 text-white"
                        : "px-3 py-2.5 text-gray-500"
                    }
                  >
                    {item}
                  </motion.div>

                ))}

              </div>
            </div>


            {/* Main */}

            <div className="p-6 lg:p-10">

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <p className="text-sm text-gray-500">
                  Good morning
                </p>

                <h2 className="mt-1 text-2xl font-semibold">
                  What do you want to know?
                </h2>
              </motion.div>


              {/* Search */}

              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{
                  borderColor: "rgba(255,255,255,0.2)",
                }}
                className="rounded-xl border border-white/10 bg-black/20 p-4"
              >

                <div className="flex items-center gap-3 text-gray-500">

                  <span className="text-lg">
                    ⌕
                  </span>

                  <motion.span
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                    }}
                    className="text-sm"
                  >
                    Ask something about your company...
                  </motion.span>

                </div>

              </motion.div>


              {/* Cards */}

              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-6 grid gap-4 sm:grid-cols-3"
              >

                {[
                  ["📄", "128", "Documents"],
                  ["👥", "24", "Employees"],
                  ["✦", "1.2k", "Questions answered"],
                ].map(([icon, number, label]) => (

                  <motion.div
                    key={label}
                    variants={fadeUp}
                    whileHover={{
                      y: -5,
                      scale: 1.02,
                    }}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
                  >

                    <div className="mb-4 text-xl">
                      {icon}
                    </div>

                    <p className="text-2xl font-semibold">
                      {number}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {label}
                    </p>

                  </motion.div>

                ))}

              </motion.div>


              {/* AI Answer */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: 0.7,
                }}
                className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-5"
              >

                <div className="mb-3 flex items-center gap-2">

                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400"
                  >
                    ✦
                  </motion.div>

                  <span className="text-sm font-medium">
                    AI Answer
                  </span>

                </div>

                <p className="max-w-2xl text-sm leading-6 text-gray-400">
                  Based on the company's employee handbook and HR policy
                  documents, employees can request remote work by submitting
                  a request to their manager...
                </p>

              </motion.div>

            </div>

          </div>

        </motion.div>

      </section>


      {/* ================= FEATURES ================= */}

      <section className="border-t border-white/10">

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
            }}
            className="mx-auto max-w-2xl text-center"
          >

            <p className="text-sm font-medium uppercase tracking-widest text-blue-400">
              Built for teams
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything your team needs
            </h2>

            <p className="mt-4 text-gray-400">
              Keep your organization's knowledge accessible, searchable,
              and useful.
            </p>

          </motion.div>


          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="mt-16 grid gap-6 md:grid-cols-3"
          >

            {[
              {
                icon: "📚",
                title: "Centralized Knowledge",
                text: "Store company documents in one secure place instead of searching through scattered files and folders.",
              },
              {
                icon: "✦",
                title: "Intelligent Search",
                text: "Ask questions naturally and find relevant information from your organization's documents.",
              },
              {
                icon: "🔐",
                title: "Role-Based Access",
                text: "Control who can access documents and company information based on employee roles and permissions.",
              },
            ].map((feature) => (

              <motion.div
                key={feature.title}
                variants={fadeUp}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                }}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-7"
              >

                <motion.div
                  whileHover={{
                    scale: 1.15,
                    rotate: 5,
                  }}
                  className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl"
                >
                  {feature.icon}
                </motion.div>

                <h3 className="text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                  {feature.text}
                </p>

              </motion.div>

            ))}

          </motion.div>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="mx-auto max-w-5xl px-6 py-24 text-center lg:px-8">

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
          className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-6 py-16"
        >

          <h2 className="text-3xl font-bold sm:text-4xl">
            Your company's knowledge.

            <span className="block text-gray-400">
              One place.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-gray-400">
            Stop wasting time searching for information. Give your team a
            smarter way to work with company knowledge.
          </p>

          <div className="mt-8">

            <SignUpButton forceRedirectUrl="/dashboard">
              <motion.button
                whileHover={{
                  scale: 1.06,
                  y: -3,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                className="rounded-xl bg-white px-7 py-3.5 font-semibold text-black"
              >
                Get Started →
              </motion.button>
            </SignUpButton>

          </div>

        </motion.div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="border-t border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-500 sm:flex-row lg:px-8">

          <p>
            © 2026 CompanyBrain. All rights reserved.
          </p>

          <p>
            Built for modern teams.
          </p>

        </div>

      </footer>

    </main>
  );
}