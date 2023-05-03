import {useState} from 'react';

export default () => {
  const [checked, setChecked] = useState(true);

  // TODO: Make this not look goofy

  const toggle = () => {
    setChecked((prevChecked) => !prevChecked);
  };

  return (
    <button
      className="rounded-full w-12 h-[22px] border-2 border-gray-neutral flex relative"
      onClick={toggle}
    >
      <div
        className={`aspect-square rounded-full h-full bg-brand-green absolute top-0 transition-all`}
        style={{
          left: checked ? 0 : 'calc(100% - 19px)',
        }}
      />
    </button>
  );
};
