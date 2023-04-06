export default () => (
  // TODO: Create unified button component
  <div className="flex ">
    <div className="ml-auto flex gap-4">
      <button className="px-4 py-2 hover:bg-brand-green/80 bg-brand-green rounded-lg text-light-text">
        Apply
      </button>
      <button className="px-4 py-2 bg-light-midground dark:bg-dark-midground rounded-lg">
        Discard
      </button>
    </div>
  </div>
);
