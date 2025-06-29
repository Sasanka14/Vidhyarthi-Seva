export default function Footer() {
  return (
    <footer className="text-white py-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-lg font-bold drop-shadow">Vidhyarthi <span className="text-orange-400">Seva</span></div>
        <div className="flex gap-6 text-sm">
          <a href="#about" className="hover:text-orange-300 transition drop-shadow">About</a>
          <a href="#services" className="hover:text-orange-300 transition drop-shadow">Services</a>
          <a href="#why" className="hover:text-orange-300 transition drop-shadow">Why Choose Us?</a>
          <a href="#contact" className="hover:text-orange-300 transition drop-shadow">Contact</a>
        </div>
        <div className="text-xs text-blue-100 drop-shadow">&copy; {new Date().getFullYear()} Vidhyarthi Seva. All rights reserved.</div>
      </div>
    </footer>
  );
} 