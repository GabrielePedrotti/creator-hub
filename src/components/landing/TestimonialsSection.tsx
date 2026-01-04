import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Content Creator",
    avatar: "SC",
    content: "LinkPulse transformed how I connect with my audience. My click-through rate increased by 300% in just two months!",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Digital Artist",
    avatar: "MJ",
    content: "The customization options are incredible. My bio page finally matches my brand perfectly. Plus, selling my digital art directly has been a game-changer.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Fitness Influencer",
    avatar: "ER",
    content: "The analytics alone are worth it. I finally understand what my followers actually want. The scheduled links feature is perfect for my launch campaigns.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Music Producer",
    avatar: "DK",
    content: "Switched from Linktree and never looked back. The video embeds and Spotify integration are seamless. My fans love the new experience.",
    rating: 5,
  },
  {
    name: "Lisa Thompson",
    role: "E-commerce Brand",
    avatar: "LT",
    content: "Managing multiple brands from one dashboard is brilliant. The team features make collaboration so much easier for our agency.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Podcaster",
    avatar: "JW",
    content: "The QR codes have been amazing for promoting at live events. Simple to set up, and the analytics show real results.",
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-primary font-semibold mb-4"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
          >
            Loved by <span className="text-gradient">Creators</span> Worldwide
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Join millions of creators who trust LinkPulse to grow their online presence.
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-glass"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-semibold text-white">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
