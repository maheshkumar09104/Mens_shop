function PagePlaceholder({ eyebrow, title, children }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-amber-600">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-black text-[#0B1F3A]">{title}</h1>
      <p className="mt-4 max-w-2xl text-slate-600">{children}</p>
    </section>
  );
}

export default PagePlaceholder;
