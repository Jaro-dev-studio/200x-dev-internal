"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileCode, Tv } from "lucide-react";

interface ProductsClientProps {
  isSignedIn: boolean;
}

const products = [
  {
    id: "cursor-mastery",
    title: "The Replacer",
    subtitle: "Advanced Cursor Mastery Course",
    description:
      "The complete system to become an elite AI-native engineer. 8 modules, production workflows, and the exact techniques used at OpenAI.",
    price: "$999",
    priceNote: "One-time payment",
    icon: Tv,
    href: "/products/cursor-mastery",
    featured: true,
    highlights: [
      "8 comprehensive modules",
      "Full production SaaS source code",
      "Lifetime updates",
    ],
  },
  {
    id: "cursorrules",
    title: "The Ultimate .cursorrules File",
    subtitle: "By an OpenAI Engineering Manager",
    description:
      "The exact .cursorrules file used to build dozens of production applications. One-shot Next.js apps with zero drift.",
    price: "$49",
    priceNote: "One-time payment",
    icon: FileCode,
    href: "/products/cursorrules",
    featured: false,
    highlights: [
      "Complete production-ready file",
      "Full documentation",
      "Lifetime updates",
    ],
  },
];

export function ProductsClient({ isSignedIn }: ProductsClientProps) {
  return (
    <main className="min-h-screen bg-background text-foreground noise-overlay">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-5 bg-background/80 backdrop-blur-sm border-b border-border"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1">
            <Image src="/logo.png" alt="200x" width={24} height={24} />
            <span className="text-sm font-medium tracking-wide">200x</span>
          </Link>
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-6"
          >
            200x Products
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl md:text-6xl font-medium tracking-tight leading-[1.1] mb-6"
          >
            <span className="font-sans">Tools for </span>
            <span className="font-serif italic text-accent">
              Elite Engineers
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Everything you need to become a 200x developer. Built by engineers,
            for engineers.
          </motion.p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.15, duration: 0.6 }}
              >
                <Link href={product.href} className="block group h-full">
                  <div
                    className={`relative h-full p-8 md:p-10 border transition-all duration-300 ${
                      product.featured
                        ? "border-accent bg-accent/5 hover:bg-accent/10"
                        : "border-border bg-background hover:border-accent/50 hover:bg-muted/30"
                    }`}
                  >
                    {/* Featured badge */}
                    {product.featured && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-accent text-accent-foreground text-xs font-medium uppercase tracking-wider">
                        Most Popular
                      </div>
                    )}

                    {/* Icon */}
                    <div
                      className={`w-14 h-14 flex items-center justify-center border mb-6 ${
                        product.featured
                          ? "border-accent/30 bg-accent/10"
                          : "border-border bg-muted/30"
                      }`}
                    >
                      <product.icon
                        className={`w-7 h-7 ${
                          product.featured
                            ? "text-accent"
                            : "text-muted-foreground group-hover:text-accent transition-colors"
                        }`}
                      />
                    </div>

                    {/* Content */}
                    <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">
                      {product.subtitle}
                    </p>

                    <h2 className="text-2xl md:text-3xl font-medium font-sans mb-4 group-hover:text-accent transition-colors">
                      {product.title}
                    </h2>

                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {product.description}
                    </p>

                    {/* Highlights */}
                    <ul className="space-y-2 mb-8">
                      {product.highlights.map((highlight, j) => (
                        <li
                          key={j}
                          className="flex items-center gap-2 text-sm text-foreground/80"
                        >
                          <span className="w-1.5 h-1.5 bg-accent shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>

                    {/* Price and CTA */}
                    <div className="flex items-end justify-between mt-auto pt-6 border-t border-border">
                      <div>
                        <p className="text-3xl font-medium font-sans">
                          {product.price}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {product.priceNote}
                        </p>
                      </div>

                      <div
                        className={`flex items-center gap-2 text-sm font-medium ${
                          product.featured ? "text-accent" : "text-foreground"
                        } group-hover:text-accent transition-colors`}
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-xl md:text-2xl font-medium font-sans mb-4">
            Not sure where to start?
          </p>
          <p className="text-muted-foreground mb-8">
            The Cursor Mastery course includes everything in the .cursorrules
            file, plus 8 comprehensive modules on becoming an elite AI-native
            engineer.
          </p>
          <Link
            href="/products/cursor-mastery"
            className="group inline-flex items-center justify-center gap-3 px-12 py-4 bg-foreground text-background text-sm font-medium tracking-wide hover:bg-foreground/90 transition-all"
          >
            <span>Start with Cursor Mastery</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 px-6 border-t border-border"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-1">
            <Image src="/logo.png" alt="200x" width={24} height={24} />
            <span className="text-sm font-medium tracking-wide">200x</span>
          </div>

          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} 200x. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </main>
  );
}

