'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/Ankit-Das-afk',
    status: 'Active',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/ankitdas919',
    status: 'Active',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'Medium',
    url: 'https://medium.com/@ankit.das9',
    status: 'Writing',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    ),
  },
  {
    name: 'Kaggle',
    url: 'https://kaggle.com/ankitdas09',
    status: 'Competitions',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.28.18.022.098.001.186-.059.264l-6.778 6.659 7.112 8.388c.072.089.085.178.046.268z" />
      </svg>
    ),
  },
  {
    name: 'Email',
    url: 'mailto:ankitdasamd@gmail.com',
    status: 'Always Open',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ name: '', email: '', message: '' });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSuccess(false), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section id="contact" className="relative py-12 md:py-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-void/95 to-void" />

      <div className="relative z-10 section-container px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12 w-full"
        >
          <span className="font-mono text-cyan text-xs sm:text-sm tracking-wider">
            {'// HANDSHAKE PROTOCOL'}
          </span>
          <h2 className="mt-3 md:mt-4 gradient-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Get in Touch</h2>
          <p className="mt-3 md:mt-4 text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Ready to collaborate on AI/ML projects or discuss opportunities?
            Initialize a connection below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 w-full max-w-5xl mx-auto">
          {/* Contact Form */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full"
          >
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 text-left">
              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block font-mono text-sm text-muted mb-2"
                >
                  Name <span className="text-cyan">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-black/50 border ${errors.name ? 'border-red-500' : 'border-cyan/30'
                    } rounded-lg px-4 py-3 font-mono text-white focus:outline-none focus:border-cyan transition-colors`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <span className="text-red-500 text-xs mt-1">{errors.name}</span>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block font-mono text-sm text-muted mb-2"
                >
                  Email <span className="text-cyan">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-black/50 border ${errors.email ? 'border-red-500' : 'border-cyan/30'
                    } rounded-lg px-4 py-3 font-mono text-white focus:outline-none focus:border-cyan transition-colors`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <span className="text-red-500 text-xs mt-1">{errors.email}</span>
                )}
              </div>

              {/* Message Input */}
              <div>
                <label
                  htmlFor="message"
                  className="block font-mono text-sm text-muted mb-2"
                >
                  Message <span className="text-cyan">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full bg-black/50 border ${errors.message ? 'border-red-500' : 'border-cyan/30'
                    } rounded-lg px-4 py-3 font-mono text-white focus:outline-none focus:border-cyan transition-colors resize-none`}
                  placeholder="Let's build something amazing together..."
                />
                {errors.message && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.message}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 font-mono text-sm border-2 rounded-lg transition-all ${isSubmitting
                  ? 'border-muted text-muted cursor-not-allowed'
                  : 'border-cyan text-cyan hover:bg-cyan hover:text-void'
                  }`}
                whileHover={!isSubmitting ? { scale: 1.02, boxShadow: '0 0 25px rgba(0, 243, 255, 0.5)' } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-muted border-t-cyan rounded-full"
                    />
                    Sending...
                  </span>
                ) : (
                  'Initialize Connection →'
                )}
              </motion.button>

              {/* Success Message */}
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-matrix/10 border border-matrix rounded-lg text-matrix text-sm font-mono text-center"
                >
                  ✓ Connection established! I&apos;ll respond within 24 hours.
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Social Links & Info */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8 w-full text-left"
          >
            {/* Terminal-style info */}
            <div className="p-4 sm:p-6 bg-black/50 border border-cyan/20 rounded-lg font-mono text-xs sm:text-sm overflow-x-auto">
              <div className="text-muted mb-4">
                $ fetch contact_info --format=json
              </div>
              <div className="text-cyan whitespace-nowrap sm:whitespace-normal">
                <span className="text-purple">{'{'}</span>
                <br />
                <span className="ml-2 sm:ml-4">&quot;location&quot;: <span className="text-matrix">&quot;Mumbai, India&quot;</span>,</span>
                <br />
                <span className="ml-2 sm:ml-4">&quot;timezone&quot;: <span className="text-matrix">&quot;IST (UTC+5:30)&quot;</span>,</span>
                <br />
                <span className="ml-2 sm:ml-4">&quot;availability&quot;: <span className="text-matrix">&quot;Open to opportunities&quot;</span>,</span>
                <br />
                <span className="ml-2 sm:ml-4">&quot;response_time&quot;: <span className="text-matrix">&quot;&lt;24 hours&quot;</span></span>
                <br />
                <span className="text-purple">{'}'}</span>
              </div>
              
              {/* Pac-Man Animation */}
              <div className="pacman-game">
                <div className="pacman-dots"></div>
                <div className="pacman-eater"></div>
                <div className="pacman-eater-rtl"></div>
                <div className="pacman-character"></div>
              </div>
            </div>

            {/* Quick Response */}
            <motion.div
              variants={staggerItem}
              className="p-4 border border-purple/30 rounded-lg bg-purple/5"
            >
              <p className="text-sm text-gray-400">
                <span className="text-purple font-mono">{'>'}</span> Prefer a quick
                chat? I&apos;m most active on{' '}
                <a href="https://linkedin.com/in/ankitdas919" target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">
                  LinkedIn
                </a>{' '}
                for professional discussions.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* CONNECT Section - Separate Slim Section */}
      <div className="relative z-10 w-full py-10 mt-12 bg-black/30 border-y border-cyan/20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h3 className="font-[family-name:var(--font-gaming)] text-white mb-8 text-2xl tracking-[0.3em] uppercase">
            <span className="text-cyan">{'{'}</span> Connect <span className="text-cyan">{'}'}</span>
          </h3>
          <div className="flex justify-center items-center gap-6 sm:gap-10 md:gap-14">
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -8, scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="w-14 h-14 rounded-xl bg-void/80 border border-cyan/30 flex items-center justify-center group-hover:border-cyan group-hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all duration-300">
                  <span className="text-cyan group-hover:text-white transition-colors text-2xl">
                    {link.icon}
                  </span>
                </div>
                <span className="font-mono text-muted text-xs group-hover:text-cyan transition-colors">
                  {link.name}
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 mt-4 pt-3 pb-4 border-t border-cyan/10"
      >
        <div className="w-full max-w-7xl mx-auto px-4 text-center">
          <p className="font-mono text-sm text-muted">
            <span className="text-cyan">{'<'}/</span>
            Designed & Built by Ankit Das
            <span className="text-cyan">{'>'}</span>
          </p>
          <p className="text-[10px] text-muted mt-1">
            © {new Date().getFullYear()} • Made with Next.js, Framer Motion & Tailwind CSS
          </p>
        </div>
      </motion.footer>
    </section>
  );
}
