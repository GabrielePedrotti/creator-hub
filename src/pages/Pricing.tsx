import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "Unlimited links",
      "Basic customization",
      "Basic analytics (views, clicks)",
      "QR code generation",
      "Mobile-optimized page",
      "SEO basics",
      "Social media icons",
      "Video embeds (YouTube, TikTok)",
    ],
    notIncluded: [
      "Remove branding",
      "Custom themes",
      "Scheduled links",
      "Email capture",
      "Sell products",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Starter",
    description: "For growing creators",
    monthlyPrice: 9,
    yearlyPrice: 7,
    features: [
      "Everything in Free",
      "Advanced analytics & CTR",
      "Custom themes & colors",
      "Link thumbnails",
      "Scheduled links",
      "Email capture forms",
      "Remove branding",
      "Priority email support",
      "Custom short links",
      "UTM parameters",
    ],
    notIncluded: [
      "Custom CSS",
      "Social automation",
      "Sell products (reduced fees)",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Pro",
    description: "For serious creators",
    monthlyPrice: 29,
    yearlyPrice: 24,
    features: [
      "Everything in Starter",
      "Custom CSS",
      "Social post scheduling",
      "Instagram DM automation",
      "Sell digital products",
      "Reduced platform fees (5%)",
      "Google Analytics integration",
      "Meta Pixel integration",
      "Export analytics to CSV",
      "Highlighted links & badges",
      "Temporary campaign links",
    ],
    notIncluded: [
      "Multiple brands",
      "Team members",
      "0% platform fees",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Business",
    description: "For teams and agencies",
    monthlyPrice: 99,
    yearlyPrice: 79,
    features: [
      "Everything in Pro",
      "Multiple brands per account",
      "Unlimited team members",
      "Approval workflows",
      "0% platform fees",
      "White-label ready",
      "Dedicated account manager",
      "Concierge onboarding",
      "Custom integrations",
      "SSO & advanced security",
      "SLA guarantee",
      "API access",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqs = [
  {
    question: "Can I change plans anytime?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any payments.",
  },
  {
    question: "Is there a free trial?",
    answer: "All paid plans come with a 14-day free trial. No credit card required to start. Cancel anytime during the trial.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay. Enterprise customers can pay via invoice.",
  },
  {
    question: "What are platform fees for selling products?",
    answer: "Free and Starter plans have a 10% platform fee on sales. Pro has 5%, and Business has 0%. Stripe processing fees still apply.",
  },
  {
    question: "Can I use my own domain?",
    answer: "Yes! Custom domains are available on all paid plans. You can connect your own domain or use a subdomain on linkpulse.io.",
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact support for a full refund.",
  },
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div className="min-h-screen bg-background dark">
      <Navbar />
      
      <main className="pt-24 lg:pt-32">
        {/* Header */}
        <section className="py-12 lg:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block text-primary font-semibold mb-4"
              >
                Pricing
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              >
                Plans for Every <span className="text-gradient">Creator</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-muted-foreground"
              >
                Start free and scale as you grow. All plans include unlimited links and our core features.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Toggle */}
        <section className="pb-8">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-4"
            >
              <span className={cn("font-medium transition-colors", !isYearly ? "text-foreground" : "text-muted-foreground")}>
                Monthly
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={cn(
                  "relative w-16 h-8 rounded-full transition-colors duration-300",
                  isYearly ? "bg-primary" : "bg-muted"
                )}
              >
                <div
                  className={cn(
                    "absolute top-1 w-6 h-6 rounded-full bg-white transition-transform duration-300",
                    isYearly ? "translate-x-9" : "translate-x-1"
                  )}
                />
              </button>
              <span className={cn("font-medium transition-colors", isYearly ? "text-foreground" : "text-muted-foreground")}>
                Yearly
                <span className="ml-2 text-xs text-primary font-semibold">Save 20%</span>
              </span>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={cn(
                    "relative rounded-2xl p-6 lg:p-8 transition-all duration-300 h-full flex flex-col",
                    plan.popular
                      ? "bg-gradient-primary shadow-glow scale-[1.02]"
                      : "glass hover:glass-strong"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-primary text-xs font-semibold">
                        <Sparkles className="w-3 h-3" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className={cn(
                      "font-heading font-bold text-xl mb-2",
                      plan.popular ? "text-white" : ""
                    )}>
                      {plan.name}
                    </h3>
                    <p className={cn(
                      "text-sm",
                      plan.popular ? "text-white/80" : "text-muted-foreground"
                    )}>
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className={cn(
                        "font-heading text-4xl font-bold",
                        plan.popular ? "text-white" : ""
                      )}>
                        ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      {plan.monthlyPrice > 0 && (
                        <span className={cn(
                          "text-sm",
                          plan.popular ? "text-white/80" : "text-muted-foreground"
                        )}>
                          /month
                        </span>
                      )}
                    </div>
                    {isYearly && plan.monthlyPrice > 0 && (
                      <p className={cn(
                        "text-xs mt-1",
                        plan.popular ? "text-white/60" : "text-muted-foreground"
                      )}>
                        Billed annually (${plan.yearlyPrice * 12}/year)
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className={cn(
                          "w-5 h-5 flex-shrink-0 mt-0.5",
                          plan.popular ? "text-white" : "text-primary"
                        )} />
                        <span className={cn(
                          "text-sm",
                          plan.popular ? "text-white/90" : "text-muted-foreground"
                        )}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link to={plan.name === "Business" ? "/contact" : "/signup"} className="mt-auto">
                    <button
                      className={cn(
                        "w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group",
                        plan.popular
                          ? "bg-white text-primary hover:bg-white/90"
                          : "btn-secondary"
                      )}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison (simplified) */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Everything you need to know about our pricing and plans.
              </p>
            </div>

            <div className="max-w-3xl mx-auto grid gap-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="card-glass"
                >
                  <h3 className="font-heading font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Our team is here to help. Get in touch and we'll help you find the right plan for your needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <button className="btn-primary px-8 py-4">
                  Contact Sales
                </button>
              </Link>
              <Link to="/signup">
                <button className="btn-secondary px-8 py-4">
                  Start Free Trial
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
