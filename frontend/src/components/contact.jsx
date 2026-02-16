import React, { useRef, useState } from "react";

// export default function Contact() {
//   const form = useRef(null);
//   const [status, setStatus] = useState({ success: false, error: false });
//   const [loading, setLoading] = useState(false);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setStatus({ success: false, error: false });

//     const formData = new FormData(form.current);
//     formData.append("access_key", "d17ac6a9-e2ac-41ca-872e-4a58e78bf77a");

//     const data = Object.fromEntries(formData.entries());

//     try {
//       const res = await fetch("https://api.web3forms.com/submit", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       const result = await res.json();
//       if (result.success) {
//         setStatus({ success: true, error: false });
//         form.current.reset();
//       } else {
//         setStatus({ success: false, error: true });
//       }
//     } catch (err) {
//       console.error(err);
//       setStatus({ success: false, error: true });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="min-h-screen bg-gradient-to-b from-[#020617] to-black text-white flex items-center justify-center px-6 py-20">
//       <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

//         {/* LEFT SECTION  */}
//         <div className="flex justify-center lg:justify-end">
//           <img
//             src="https://img.freepik.com/free-vector/online-doctor-concept-illustration_114360-1783.jpg"
//             alt="Decentralized Healthcare"
//             className="w-full max-w-sm md:max-w-md rounded-3xl shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:scale-[1.02] transition"
//           />
//         </div>

//         {/* RIGHT SECTION */}
//         <div className="flex justify-center p-4">
//           <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-gray-700 rounded-3xl p-10 shadow-2xl">

//             <h2 className="text-4xl font-bold mb-3 text-green-400 text-center lg:text-left">
//               Get in Touch
//             </h2>

//             <p className="text-slate-300 mb-6 text-sm leading-relaxed text-center lg:text-left">
//               Have questions about decentralized healthcare, blockchain integration,
//               or patient data privacy? We'd love to hear from you.
//             </p>

//             <form ref={form} onSubmit={onSubmit} className="space-y-4">

//               <div>
//                 <label className="text-sm text-gray-300">Full Name</label>
//                 <input
//                   type="text"
//                   name="from_name"
//                   placeholder="Your Name"
//                   required
//                   className="w-full mt-1 p-3 rounded-lg bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm text-gray-300">Email Address</label>
//                 <input
//                   type="email"
//                   name="from_email"
//                   placeholder="Your Email"
//                   required
//                   className="w-full mt-1 p-3 rounded-lg bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm text-gray-300">Subject</label>
//                 <input
//                   type="text"
//                   name="subject"
//                   placeholder="Subject"
//                   className="w-full mt-1 p-3 rounded-lg bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm text-gray-300">Message</label>
//                 <textarea
//                   name="message"
//                   rows="4"
//                   placeholder="Your Message"
//                   required
//                   className="w-full mt-1 p-3 rounded-lg bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-green-500 outline-none resize-none"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 text-white py-3 rounded-lg font-semibold shadow-lg disabled:opacity-70"
//               >
//                 {loading ? "Sending..." : "Send Message"}
//               </button>
//             </form>

//             {status.success && (
//               <p className="mt-4 text-green-400 text-sm text-center animate-pulse">
//                 ✅ Message sent successfully! We'll get back to you soon.
//               </p>
//             )}

//             {status.error && (
//               <p className="mt-4 text-red-400 text-sm text-center">
//                 ❌ Failed to send message. Please try again later.
//               </p>
//             )}
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// }
export default function Contact() {
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
            Do you have a question? A complaint? Or need any help to choose the right product?
            Feel free to contact us.
          </p>

          <form className="mt-6 space-y-5">

            {/* First + Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700">First Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your first name" 
                  className="w-full p-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Last Name</label>
                <input 
                  type="text" 
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
                  placeholder="Enter your email" 
                  className="w-full p-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Contact Details</label>
                
                <div className="flex gap-2">
                  <select className="p-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option>+91</option>
                    <option>+971</option>
                    <option>+1</option>
                  </select>

                  <input 
                    type="tel" 
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
                rows={4}
                placeholder="Enter your message"
                className="w-full p-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>

            {/* Button */}
            <button className="px-8 py-3 bg-[#0B1F44] hover:bg-[#0d2a66] transition text-white rounded-2xl shadow">
              Send a Message
            </button>

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

          {/* Social Icons */}
          <div className="mt-8">
            <p className="text-gray-300 mb-3">Connect with us</p>

            <div className="flex gap-4 text-white text-2xl">
              <i className="fab fa-facebook"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-snapchat"></i>
              <i className="fab fa-tiktok"></i>
              <i className="fab fa-twitter"></i>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
