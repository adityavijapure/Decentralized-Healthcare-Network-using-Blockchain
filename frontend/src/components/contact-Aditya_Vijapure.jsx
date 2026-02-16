import React, { useRef, useState } from "react";

export default function Contact() {
  const form = useRef(null);
  const [status, setStatus] = useState({ success: false, error: false });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ success: false, error: false });

    const formData = new FormData(form.current);
    // Using the access key from your commented code
    formData.append("access_key", "d17ac6a9-e2ac-41ca-872e-4a58e78bf77a");

    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.success) {
        setStatus({ success: true, error: false });
        form.current.reset();
      } else {
        setStatus({ success: false, error: true });
      }
    } catch (err) {
      console.error(err);
      setStatus({ success: false, error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-gray-50 py-16 px-6">
      {/* PAGE TITLE */}
      <h1 className="text-4xl font-bold text-center text-[#0B1F44] mb-10">
        Contact Us
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT FORM CARD */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow p-8">
          <h2 className="text-2xl font-semibold text-[#0B1F44]">
            Send us a message
          </h2>

          <p className="text-gray-600 text-sm mt-2">
            Do you have a question? A complaint? Or need any help to choose the
            right product? Feel free to contact us.
          </p>

          <form ref={form} onSubmit={onSubmit} className="mt-6 space-y-5">
            {/* First + Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  required
                  placeholder="Enter your first name"
                  className="w-full p-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Enter your last name"
                  className="w-full p-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Email + Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  className="w-full p-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Contact Details</label>

                <div className="flex gap-2">
                  <select 
                    name="country_code"
                    className="p-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="+91">+91</option>
                    <option value="+971">+971</option>
                    <option value="+1">+1</option>
                  </select>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your number"
                    className="w-full p-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-sm text-gray-700">Message</label>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Enter your message"
                className="w-full p-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#0B1F44] hover:bg-[#0d2a66] disabled:opacity-70 transition text-white rounded-2xl shadow flex items-center justify-center gap-2"
            >
              {loading ? "Sending..." : "Send a Message"}
            </button>

            {/* Status Messages */}
            {status.success && (
              <p className="text-green-600 text-sm font-semibold animate-pulse">
                ✅ Message sent successfully!
              </p>
            )}
            {status.error && (
              <p className="text-red-500 text-sm font-semibold">
                ❌ Failed to send message. Please try again.
              </p>
            )}
          </form>
        </div>

        {/* RIGHT SUPPORT CARD */}
        <div className="bg-[#0B1F44] text-white rounded-[32px] p-8 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-6">
              Hi! We are always here to help you.
            </h3>

            {/* Hotline */}
            <div className="bg-[#1F3A73] rounded-2xl p-4 mb-4">
              <p className="text-gray-300 text-sm">Hotline:</p>
              <p className="font-semibold text-lg">+971 56 498 3456</p>
            </div>

            {/* WhatsApp */}
            <div className="bg-[#1F3A73] rounded-2xl p-4 mb-4">
              <p className="text-gray-300 text-sm">SMS / Whatsapp</p>
              <p className="font-semibold text-lg">+971 55 343 6433</p>
            </div>

            {/* Email */}
            <div className="bg-[#1F3A73] rounded-2xl p-4">
              <p className="text-gray-300 text-sm">Email</p>
              <p className="font-semibold text-lg">support@zalomi.com</p>
            </div>
          </div>

          {/* Social Icons - NOTE: Make sure FontAwesome is linked in your index.html */}
          <div className="mt-8">
            <p className="text-gray-300 mb-3">Connect with us</p>

            <div className="flex gap-4 text-white text-2xl">
              <i className="fab fa-facebook cursor-pointer hover:text-blue-400 transition"></i>
              <i className="fab fa-instagram cursor-pointer hover:text-pink-400 transition"></i>
              <i className="fab fa-snapchat cursor-pointer hover:text-yellow-400 transition"></i>
              <i className="fab fa-tiktok cursor-pointer hover:text-pink-600 transition"></i>
              <i className="fab fa-twitter cursor-pointer hover:text-blue-400 transition"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}