import { FaTwitter, FaLinkedin, FaBehance, FaInstagram } from "react-icons/fa";
import contact_bg from "../../assets/header_img.jpg"

const ContactUs = () => {
  return (
    <div className="min-h-screen mt-8 text-white flex flex-col items-center justify-center px-6 bg-cover bg-center">
      <div className="max-w-5xl w-full bg-black bg-opacity-70 shadow-lg rounded-lg p-10 relative text-white" style={{ backgroundImage: `url(${contact_bg})`}} >
        <h2 className="text-4xl font-bold text-white mb-6 text-center" >
          Contact Us
        </h2>
        <p className="text-gray-400 text-center mb-8">Ask for a quotation from us!</p>

        <div className="grid md:grid-cols-2 gap-10 text-white" >
          {/* Contact Form */}
          <form className="space-y-6">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white -700"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white -400"
            />
            <input
              type="tel"
              placeholder="Phone"
              className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white -400"
            />
            <textarea
              placeholder="Your message"
              rows="4"
              className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white -400"
            ></textarea>
            <button
              type="submit"
              className="w-full border-3 bg-gray-700 text-black font-bold py-3 rounded-full hover:bg-white transition duration-400 "
            >
              Send
            </button>
          </form>

          {/* Contact Details */}
          <div className=" text-gray-400">
            <h3 className="text-lg font-semibold  mb-4 text-gray-100">
              Contact Information:
            </h3>
            <p>Neptune Street 223</p>
            <p>Bangalore, India</p>
            <p className="mt-3">
              Call us: <span className="">+91 123 456 7890</span>
            </p>
            <p>We are open from Monday to Friday</p>
            <p>9:00 AM - 5:00 PM</p>

            {/* Social Icons */}
            <h3 className="text-lg font-semibold text-gray-100 mt-6">
              Follow Us:
            </h3>
            <div className="flex gap-4 mt-3">
              <FaTwitter className="text-xl hover:text-white -400 cursor-pointer" />
              <FaLinkedin className="text-xl hover:text-white -400 cursor-pointer" />
              <FaInstagram className="text-xl hover:text-white -400 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
