import React from "react";
import { Link } from "react-router-dom";
import {
  Gift,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Heart,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">
                LylyGifts
              </span>
            </Link>
            <p className="text-gray-300 leading-relaxed">
              Төгс бэлгээ олж, хайртай хүмүүстээ инээмсэглэл бэлэглэе.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Түргэн хандалт</h3>
            <ul className="space-y-4">
              {["Нүүр", "Бүтээгдэхүүн", "Холбоо барих"].map((item) => (
                <li key={item}>
                  <Link
                    to={
                      item === "Home"
                        ? "/"
                        : `/${item.toLowerCase().replace(" ", "")}`
                    }
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6">
              Бүтээгдэхүүний ангилал
            </h3>
            <ul className="space-y-4">
              {[
                "Төрсөн өдөрийн бэлэг",
                "Валетины өдөр",
                "Эмэгтэйчүүдийн баяр",
                "Ойн баяр",
                "Хурим",
                "Хүүхдийн баяр",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/shop"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Холбоо барих</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-purple-400" />
                <span className="text-gray-300">+(976) 94262044</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-purple-400" />
                <span className="text-gray-300">LylyGifts@gmail.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-purple-400" />
                <span className="text-gray-300">СБД 10-р хороо 31-74</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 LylyGifts. Бүх эрх хуулиар хамгаалагдсан.
          </p>
          <p className="text-gray-400 text-sm flex items-center mt-4 md:mt-0">
            Хайр, сэтгэлээр бүтээгдсэн бэлэг{" "}
            <Heart className="h-4 w-4 text-red-400 mx-1" /> хайр түгээнэ
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
