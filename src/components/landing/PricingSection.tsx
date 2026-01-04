import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
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
      "Basic analytics",
      "QR code generation",
      "Mobile-optimized page",
      "SEO basics",
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
      "Advanced analytics",
      "Custom themes",
      "Link thumbnails",
      "Scheduled links",
      "Email capture forms",
      "Remove branding",
      "Priority support",
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
      "Social automation",
      "Instagram DM automation",
      "Sell digital products",
      "Reduced platform fees",
      "Google Analytics",
      "Meta Pixel integration",
      "Export analytics data",
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
      "Multiple brands",
      "Team members",
      "Approval workflows",
      "0% platform fees",
      "White-label ready",
      "Dedicated support",
      "Concierge onboarding",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section id="pricing" className="py-24 lg:py-32 relative overflow-hidden bg-gradient-hero">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-primary font-semibold mb-4"
          >
            Pricing
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
          >
            Simple, Transparent{" "}
            <span className="text-gradient">Pricing</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Start free, upgrade when you're ready. All plans include a 14-day free trial.
          </motion.p>
        </div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-4 mb-12"
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

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
  );
};
