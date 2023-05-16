export default (props: React.HtmlHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className="px-4 py-2 bg-brand-green hover:bg-brand-green-light focus:bg-brand-green-light active:brightness-110 rounded-lg text-light-text flex gap-2 justify-center items-center transition-transform active:scale-90"
  />
);
