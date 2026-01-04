import { motion } from "framer-motion";
import { 
  Link2, Palette, BarChart3, ShoppingBag, 
  Users, Zap, Lock, Globe, QrCode, 
  Calendar, Mail, Share2 
} from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Unlimited Links",
    description: "Add as many links as you need. Social profiles, websites, videos, and more.",
  },
  {
    icon: Palette,
    title: "Full Customization",
    description: "Choose themes, colors, fonts, and backgrounds. Make your page truly yours.",
  },
  {
    icon: BarChart3,
    title: "Powerful Analytics",
    description: "Track views, clicks, and engagement. Understand what resonates with your audience.",
  },
  {
    icon: ShoppingBag,
    title: "Sell Products",
    description: "Sell digital products, courses, and downloads directly from your bio page.",
  },
  {
    icon: QrCode,
    title: "QR Codes",
    description: "Generate unique QR codes for your profile. Perfect for print and offline promotion.",
  },
  {
    icon: Calendar,
    title: "Scheduled Links",
    description: "Set links to go live or expire at specific times. Perfect for limited offers.",
  },
  {
    icon: Mail,
    title: "Email Capture",
    description: "Grow your email list with built-in forms. Integrate with Mailchimp, Klaviyo, and more.",
  },
  {
    icon: Share2,
    title: "Social Automation",
    description: "Schedule posts and automate DM responses. Grow your audience on autopilot.",
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Collaborate with your team. Manage multiple brands from one account.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed. Your page loads instantly, everywhere in the world.",
  },
  {
    icon: Lock,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime. Your data is always protected.",
  },
  {
    icon: Globe,
    title: "SEO Optimized",
    description: "Built-in SEO tools to help your page rank higher in search results.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
};

export const FeaturesSection = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-primary font-semibold mb-4"
          >
            Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
          >
            Everything You Need to{" "}
            <span className="text-gradient">Grow Your Presence</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            From simple link sharing to powerful analytics and monetization tools. 
            We've got everything covered so you can focus on creating.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="card-glass group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
