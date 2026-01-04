import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Link2, Palette, BarChart3, ShoppingBag, 
  Users, Zap, Lock, Globe, QrCode, 
  Calendar, Mail, Share2, Video, 
  Smartphone, Target, Layers, Workflow
} from "lucide-react";

const featureCategories = [
  {
    title: "Link Management",
    description: "Organize and optimize all your important links in one place.",
    icon: Link2,
    features: [
      {
        icon: Link2,
        title: "Unlimited Links",
        description: "Add as many links as you need. No limits, ever.",
      },
      {
        icon: Video,
        title: "Rich Media Embeds",
        description: "Embed YouTube, TikTok, Twitch, Spotify, and more directly on your page.",
      },
      {
        icon: Layers,
        title: "Drag & Drop Ordering",
        description: "Easily reorder your links with intuitive drag and drop.",
      },
      {
        icon: Calendar,
        title: "Scheduled Links",
        description: "Set links to go live or expire at specific times.",
      },
    ],
  },
  {
    title: "Customization",
    description: "Make your bio page truly yours with powerful customization tools.",
    icon: Palette,
    features: [
      {
        icon: Palette,
        title: "Theme Editor",
        description: "Choose colors, gradients, backgrounds, and fonts that match your brand.",
      },
      {
        icon: Smartphone,
        title: "Mobile Optimized",
        description: "Your page looks perfect on every device, automatically.",
      },
      {
        icon: Layers,
        title: "Custom CSS",
        description: "Full CSS access for complete design control (Pro+).",
      },
      {
        icon: QrCode,
        title: "QR Codes",
        description: "Generate unique QR codes for offline promotion.",
      },
    ],
  },
  {
    title: "Analytics",
    description: "Understand your audience and optimize your performance.",
    icon: BarChart3,
    features: [
      {
        icon: BarChart3,
        title: "Detailed Analytics",
        description: "Track views, clicks, CTR, and device breakdown.",
      },
      {
        icon: Target,
        title: "Link Performance",
        description: "See which links perform best and optimize accordingly.",
      },
      {
        icon: Globe,
        title: "Integration Ready",
        description: "Connect Google Analytics and Meta Pixel for deeper insights.",
      },
      {
        icon: Workflow,
        title: "Export Data",
        description: "Download your analytics data as CSV anytime.",
      },
    ],
  },
  {
    title: "Growth Tools",
    description: "Grow your audience faster with automation and integrations.",
    icon: Share2,
    features: [
      {
        icon: Share2,
        title: "Social Scheduling",
        description: "Schedule posts to Instagram, X, and TikTok.",
      },
      {
        icon: Mail,
        title: "Email Capture",
        description: "Build your email list with built-in forms.",
      },
      {
        icon: Zap,
        title: "Automation",
        description: "Auto-reply to Instagram DMs and comments (Pro+).",
      },
      {
        icon: Workflow,
        title: "Integrations",
        description: "Connect Mailchimp, Klaviyo, and Google Sheets.",
      },
    ],
  },
  {
    title: "Monetization",
    description: "Turn your audience into revenue with built-in commerce.",
    icon: ShoppingBag,
    features: [
      {
        icon: ShoppingBag,
        title: "Digital Products",
        description: "Sell eBooks, courses, templates, and downloads.",
      },
      {
        icon: Zap,
        title: "Instant Payouts",
        description: "Get paid directly to your Stripe account.",
      },
      {
        icon: Target,
        title: "Affiliate Links",
        description: "Track and manage affiliate and sponsored links.",
      },
      {
        icon: Lock,
        title: "Low Fees",
        description: "Only 5% on Pro, 0% on Business plan.",
      },
    ],
  },
  {
    title: "Team & Business",
    description: "Collaborate and scale with enterprise-grade features.",
    icon: Users,
    features: [
      {
        icon: Users,
        title: "Team Members",
        description: "Add team members with granular permissions.",
      },
      {
        icon: Layers,
        title: "Multiple Brands",
        description: "Manage multiple brands from one account.",
      },
      {
        icon: Workflow,
        title: "Approval Workflows",
        description: "Review and approve changes before publishing.",
      },
      {
        icon: Lock,
        title: "Enterprise Security",
        description: "SSO, audit logs, and advanced security controls.",
      },
    ],
  },
];

const Features = () => {
  return (
    <div className="min-h-screen bg-background dark">
      <Navbar />
      
      <main className="pt-24 lg:pt-32">
        {/* Header */}
        <section className="py-12 lg:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block text-primary font-semibold mb-4"
              >
                Features
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              >
                Everything You Need to{" "}
                <span className="text-gradient">Succeed</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-muted-foreground"
              >
                Powerful tools for creators, artists, and businesses. 
                From simple link sharing to advanced analytics and monetization.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Feature Categories */}
        {featureCategories.map((category, categoryIndex) => (
          <section 
            key={category.title} 
            className={`py-16 lg:py-24 ${categoryIndex % 2 === 0 ? "" : "bg-card/50"}`}
          >
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto text-center mb-12"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <category.icon className="w-7 h-7 text-white" />
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                  {category.title}
                </h2>
                <p className="text-muted-foreground">{category.description}</p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.features.map((feature, featureIndex) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: featureIndex * 0.1 }}
                    className="card-glass"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="py-24 lg:py-32 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-6">
                Ready to get started?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join millions of creators using LinkPulse. Create your free page in under 5 minutes.
              </p>
              <a href="/signup">
                <button className="btn-primary px-8 py-4 text-base">
                  Create Your Free Page
                </button>
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Features;
