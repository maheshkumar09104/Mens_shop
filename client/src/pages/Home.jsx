import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function Home() {
  return (
    <section className="bg-white">
      <div className="page-shell grid min-h-[calc(100vh-64px)] items-center gap-10 py-12 md:grid-cols-[1fr_0.9fr]">
        <div className="max-w-xl">
          <p className="text-sm font-bold uppercase text-copper">Modern essentials for men</p>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">Mens Shop</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Build a sharper wardrobe with everyday shirts, denim, shoes, jackets, and accessories.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-ink px-5 py-3 font-bold text-white transition hover:bg-slate-700"
          >
            Shop Collection <FaArrowRight />
          </Link>
        </div>
        <div className="grid gap-4">
          <div className="aspect-[4/3] rounded-lg bg-[url('https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center" />
          <div className="grid grid-cols-3 gap-4 text-center">
            {["Shirts", "Denim", "Shoes"].map((item) => (
              <div key={item} className="rounded-lg border border-stone-200 bg-stone-50 p-4 font-bold">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
