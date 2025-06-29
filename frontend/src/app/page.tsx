"use client";
import { motion } from "framer-motion";
import { GraduationCap, Twitter, Instagram, Linkedin, BedDouble, BookOpen, Users, Library, Dumbbell, Utensils, FileBarChart2, ShieldCheck, Zap, Heart, TrendingUp, Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import React, { useState, useRef } from 'react';

export default function Home() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section id="hero" className="w-full py-24 px-4 flex flex-col items-center text-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-2"
          >
            <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 shadow-lg backdrop-blur border-2 border-white/30">
              <GraduationCap size={48} className="text-white" />
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow mb-2"
          >
            Vidhyarthi Seva
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-2xl sm:text-3xl font-bold text-orange-400 mb-2"
          >
            Your Complete Educational Ecosystem
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-lg sm:text-xl text-white/90 mb-2 max-w-2xl"
          >
            Find verified PG accommodations, premium coaching classes, expert mentorship, and career guidance – all in one trusted platform designed for Indian students.
          </motion.p>
          {/* Price Match Guarantee Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="inline-block bg-orange-500/90 text-white font-semibold px-4 py-1 rounded-full shadow mb-2 text-base"
          >
            Price Match Guarantee
          </motion.div>
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-4"
          >
            <a href="/login" className="px-8 py-3 rounded-full bg-orange-500 text-white font-bold shadow-lg hover:bg-orange-600 transition text-lg">Start Your Journey</a>
            <a href="/brochure.pdf" download className="px-8 py-3 rounded-full bg-white/80 text-blue-700 font-bold shadow-lg hover:bg-blue-600 hover:text-white transition text-lg border border-blue-600">Download Brochure</a>
            <a href=" https://whatsapp.com/channel/0029VbAjDF3C6Zva3DFokd1a " target="_blank" rel="noopener noreferrer" className="px-8 py-3 rounded-full bg-green-500 text-white font-bold shadow-lg hover:bg-green-600 transition text-lg">Join Our WhatsApp Channel</a>
          </motion.div>
          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="flex gap-4 justify-center mt-2"
          >
            <a href="https://x.com/Vidhyarthiseva?t=rTYjq6F4QtKJJox9AL1RVA&s=09" target="_blank" rel="noopener noreferrer" className="bg-white/20 hover:bg-white/40 p-2 rounded-full transition shadow text-white"><Twitter size={24} /></a>
            <a href="https://www.instagram.com/vidhyarthi_seva?igsh=MW94OXRycHNzcWJ6dA==" target="_blank" rel="noopener noreferrer" className="bg-white/20 hover:bg-white/40 p-2 rounded-full transition shadow text-white"><Instagram size={24} /></a>
            <a href="https://www.linkedin.com/in/vidhyarthi-seva-873647371?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="bg-white/20 hover:bg-white/40 p-2 rounded-full transition shadow text-white"><Linkedin size={24} /></a>
          </motion.div>
        </motion.div>
      </section>

      {/* Our Services */}
      <section id="services" className="w-full max-w-6xl mx-auto py-20 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-extrabold mb-6 text-center bg-gradient-to-br from-black bg-clip-text text-transparent drop-shadow-2xl"
        >
          Everything You Need in One Platform
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-xl sm:text-2xl font-medium text-white/90 mb-12 text-center max-w-3xl mx-auto drop-shadow"
        >
          Streamline your educational journey with our comprehensive suite of student services
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {[
            {
              icon: <BedDouble size={40} className="text-blue-600" />,
              title: "Accommodation Finder",
              desc: "Find verified, affordable PG and hostel accommodations near your college or coaching center.",
              features: [
                "Verified listings with photos",
                "Location-based search",
                "Real reviews from students",
                "Direct booking system",
              ],
              color: "blue-600",
              link: "/dashboard/accommodations",
            },
            {
              icon: <BookOpen size={40} className="text-orange-500" />,
              title: "Courses Directory",
              desc: "Explore top coaching classes and courses for IIT, NEET, UPSC, and more.",
              features: [
                "Comprehensive institute database",
                "Success rate tracking",
                "Course comparisons",
                "Direct enrollment",
              ],
              color: "orange-500",
              link: "/dashboard/courses",
            },
            {
              icon: <Users size={40} className="text-purple-500" />,
              title: "Mentorship Hub",
              desc: "Connect with experienced mentors for personalized guidance and career advice.",
              features: [
                "Verified mentor profiles",
                "1-on-1 sessions",
                "Group webinars",
                "Industry experts",
              ],
              color: "purple-500",
              link: "/dashboard/mentors",
            },
            {
              icon: <Library size={40} className="text-green-500" />,
              title: "Library Access",
              desc: "Access digital and physical libraries for all your study needs.",
              features: [
                "Extensive book collection",
                "Digital resources",
                "Study spaces",
                "Easy borrowing system",
              ],
              color: "green-500",
              link: "/dashboard/library",
            },
            {
              icon: <Dumbbell size={40} className="text-pink-500" />,
              title: "Gym & Fitness",
              desc: "Stay fit and healthy with access to modern gym and fitness facilities.",
              features: [
                "Modern equipment",
                "Personal trainers",
                "Group classes",
                "Flexible timings",
              ],
              color: "pink-500",
              link: "/dashboard/gym",
            },
            {
              icon: <Utensils size={40} className="text-yellow-500" />,
              title: "Meals & Mess",
              desc: "Nutritious and affordable meal plans for students.",
              features: [
                "Healthy meal options",
                "Customizable plans",
                "Mess reviews",
                "Easy subscription",
              ],
              color: "yellow-500",
              link: "/dashboard/meals",
            },
            {
              icon: <FileBarChart2 size={40} className="text-red-500" />,
              title: "Test Series",
              desc: "Practice with curated test series for all major exams.",
              features: [
                "Latest exam patterns",
                "Performance analytics",
                "Instant results",
                "All-India ranking",
              ],
              color: "red-500",
              link: "/dashboard/test-series",
            },
          ].slice(0, 3).map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 + idx * 0.1 }}
              className="bg-white/90 rounded-2xl shadow-lg p-8 flex flex-col gap-4 border-t-4 border-blue-600 hover:scale-105 hover:shadow-2xl transition-transform duration-300"
            >
              <div className="mb-2">{service.icon}</div>
              <h3 className="text-xl font-bold mb-1 text-gray-900">{service.title}</h3>
              <p className="text-gray-700 mb-2">{service.desc}</p>
              <ul className="text-gray-600 text-sm mb-4 list-disc list-inside space-y-1">
                {service.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <a href={service.link} className={`mt-auto px-4 py-2 rounded-lg bg-gradient-to-br from-blue-600 to-orange-500 text-white font-semibold shadow hover:from-orange-500 hover:to-blue-600 transition`}>Explore Now</a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why" className="w-full py-16 px-4 bg-transparent">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-900 mb-4">Why Students Choose Vidhyarthi Seva</h2>
        <p className="text-lg sm:text-xl text-center text-gray-700 mb-12 max-w-2xl mx-auto">We&apos;re committed to empowering every student&apos;s educational journey with trust, innovation, and care</p>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
            className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
          >
            <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-300 shadow mb-4">
              <ShieldCheck size={40} className="text-blue-600" />
            </span>
            <h4 className="font-bold text-xl text-gray-900 mb-2">Verified & Trusted</h4>
            <p className="text-gray-600">All our listings and mentors are thoroughly verified for your safety and peace of mind</p>
          </motion.div>
          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
            className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
          >
            <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-fuchsia-400 shadow mb-4">
              <Zap size={40} className="text-blue-600" />
            </span>
            <h4 className="font-bold text-xl text-gray-900 mb-2">Instant Connections</h4>
            <p className="text-gray-600">Connect with PG owners, coaching centers, and mentors instantly through our platform</p>
          </motion.div>
          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
            className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
          >
            <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 shadow mb-4">
              <Heart size={40} className="text-blue-600" />
            </span>
            <h4 className="font-bold text-xl text-gray-900 mb-2">Student-Centric</h4>
            <p className="text-gray-600">Built by students, for students. We understand your unique needs and challenges</p>
          </motion.div>
          {/* Card 4 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
            className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
          >
            <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-orange-300 shadow mb-4">
              <TrendingUp size={40} className="text-blue-600" />
            </span>
            <h4 className="font-bold text-xl text-gray-900 mb-2">Career Growth</h4>
            <p className="text-gray-600">Access resources and guidance that accelerate your academic and professional journey</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Us */}
      <section id="contact" className="w-full max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-2"><span className="text-gray-900">Get In</span> <span className="text-blue-600">Touch</span></h2>
        <p className="text-lg sm:text-xl text-center text-gray-700 mb-10 max-w-2xl mx-auto">Ready to start your educational journey? Contact us today and let&apos;s discuss how we can help you achieve your goals.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Contact Info */}
          <div className="flex flex-col gap-6">
            <div className="bg-white/90 rounded-xl shadow p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Contact Information</h3>
              <div className="flex items-start gap-3 mb-3">
                <MapPin className="text-blue-600 mt-1" />
                <div>
                  <span className="font-semibold text-gray-800">Address</span>
                  <div className="text-gray-700 text-sm">Pune, Maharashtra, India</div>
                </div>
              </div>
              <div className="flex items-start gap-3 mb-3">
                <Phone className="text-blue-600 mt-1" />
                <div>
                  <span className="font-semibold text-gray-800">Phone</span>
                  <div className="text-gray-700 text-sm">+91 98877 97943<br />+91 91403 27484</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="text-blue-600 mt-1" />
                <div>
                  <span className="font-semibold text-gray-800">Email</span>
                  <div className="text-gray-700 text-sm">vidhyarthiseva7@gmail.com</div>
                </div>
              </div>
            </div>
            <div className="bg-green-100 rounded-xl shadow p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-green-700 font-semibold mb-1">
                <MessageCircle className="text-green-600" size={20} /> Quick WhatsApp Contact
              </div>
              <div className="text-gray-700 text-sm mb-2">Get instant responses to your queries</div>
              <a href="https://wa.me/919887797943" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-2 rounded-md bg-green-600 text-white font-bold shadow hover:bg-green-700 transition text-center">Chat on WhatsApp</a>
            </div>
          </div>
          {/* Right: Contact Form */}
          <form
            ref={formRef}
            className="bg-white/90 rounded-xl shadow p-8 flex flex-col gap-6"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = formRef.current;
              if (!form) return;
              const formData = new FormData(form);
              const data = {
                firstName: formData.get('firstName') as string,
                lastName: formData.get('lastName') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                subject: formData.get('subject') as string,
                message: formData.get('message') as string,
              };
              setStatus('');
              setLoading(true);
              try {
                const res = await fetch('/api/contact', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data),
                });
                const result = await res.json();
                if (res.ok) {
                  setStatus('success');
                  form.reset();
                } else {
                  setStatus(result.message || 'error');
                }
              } catch {
                setStatus('error');
              } finally {
                setLoading(false);
              }
            }}
          >
            <h3 className="font-bold text-lg text-gray-900 mb-2">Send us a Message</h3>
            <p className="text-gray-600 text-sm mb-2">Fill out the form below and we&apos;ll get back to you shortly</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input name="firstName" type="text" placeholder="First Name *" className="flex-1 px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" required />
              <input name="lastName" type="text" placeholder="Last Name *" className="flex-1 px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" required />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input name="email" type="email" placeholder="Email *" className="flex-1 px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" required />
              <input name="phone" type="text" placeholder="Phone Number *" className="flex-1 px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" required />
            </div>
            <input name="subject" type="text" placeholder="Subject *" className="px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" required />
            <textarea name="message" placeholder="Message *" className="px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none min-h-[100px]" required />
            <button type="submit" className="mt-2 px-8 py-3 rounded-lg bg-blue-600 text-white font-bold shadow hover:bg-orange-500 transition" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</button>
            {status === 'success' && <div className="text-green-600 font-semibold mt-2">Message sent successfully!</div>}
            {status && status !== 'success' && <div className="text-red-600 font-semibold mt-2">{status === 'error' ? 'Failed to send message.' : status}</div>}
          </form>
        </div>
      </section>
    </div>
  );
}
