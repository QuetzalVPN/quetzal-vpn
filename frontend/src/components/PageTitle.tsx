import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ShadowBox from './ShadowBox';

interface PageTitleProps {
  title: string;
}

export default ({ title }: PageTitleProps) => (
  <ShadowBox>
    <div className="flex items-center">
      <h2 className="text-2xl">{title}</h2>
      <div className="ml-auto w-80">
        <div className="relative bg-midground rounded-xl">
          <input
            type="search"
            placeholder="Search"
            className="bg-transparent p-3 shadow-inner w-full rounded-xl text-slate-600 outline-none focus:ring-2 ring-brand-green ring-opacity-50 ring-offset-1"
          />
          <button className="absolute aspect-square h-full rounded-xl bg-brand-green shadow-glow right-0 top-0 flex items-center justify-center">
            <MagnifyingGlassIcon className="h-5" />
          </button>
        </div>
      </div>
    </div>
  </ShadowBox>
);
