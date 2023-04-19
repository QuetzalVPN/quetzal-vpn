import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {
  Highlight,
  Hits,
  Index,
  InstantSearch,
  SearchBox,
  useSearchBox,
} from 'react-instantsearch-hooks-web';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import Modal from './Modal';
import { useEffect, useState } from 'react';
import Button from './Button';

// const meiliClient = instantMeiliSearch(
//   'http://localhost:7700',
//   '61apglhWDJNSmPt_R8S5jlm8Ej35mGHgl9REBKmRdY0'
// );

export default ({ className, ...props }: React.HTMLProps<HTMLInputElement>) => {
  const [open, setOpen] = useState(false);

  const closeModal = () => setOpen(false);

  return (
    <>
      <div
        className={`relative bg-light-midground dark:bg-dark-midground rounded-xl inline-block ${
          className ?? ''
        }`}
        onClick={(e) => {
          setOpen(true);
        }}
      >
        <input
          {...props}
          type="search"
          placeholder="Search"
          className="bg-transparent p-3 shadow-inner w-full rounded-xl text-gray-800 dar  k:text-gray-300 outline-none focus:ring-2 ring-brand-green ring-opacity-50 ring-offset-1"
        />
        <button className="absolute aspect-square h-full rounded-xl bg-brand-green shadow-glow right-0 top-0 flex items-center justify-center">
          <MagnifyingGlassIcon className="h-5 stroke-light-text" />
        </button>
      </div>
      <Modal open={open} close={closeModal}>
        <h2 className="text-2xl">Search anything</h2>
        {/*<InstantSearch searchClient={meiliClient} indexName="quetzal-pages">*/}
        {/*  <SearchBox className="bg-transparent border-2 border-gray-neutral" />*/}
        {/*  <div className="h-64 px-2 overflow-y-scroll">*/}
        {/*    <Index indexName="quetzal-pages">*/}
        {/*      <Hits*/}
        {/*        // hitComponent={({ hit }) => (*/}
        {/*          <div className="p-2 my-2 rounded-lg bg-light-midground dark:bg-dark-midground">*/}
        {/*        //     <h3>{(hit as any).title}</h3>*/}
        {/*        //     <p className="text-gray-neutral">*/}
        {/*        //       {(hit as any).description}*/}
        {/*        //     </p>*/}
        {/*        //   </div>*/}
        {/*        // )}*/}
        {/*        hitComponent={({ hit }) => (*/}
        {/*          // <Highlight hit={hit} attribute="title" />*/}
        {/*        )}*/}
        {/*      />*/}
        {/*    </Index>*/}

        {/*    <Index indexName="quetzal-users">*/}
        {/*      <Hits*/}
        {/*        hitComponent={({ hit }) => (*/}
        {/*          <Highlight hit={hit} attribute="name" />*/}
        {/*        )}*/}
        {/*      />*/}
        {/*    </Index>*/}
        {/*  </div>*/}
        {/*</InstantSearch>*/}

        <Button onClick={closeModal}>Close</Button>
      </Modal>
    </>
  );
};
