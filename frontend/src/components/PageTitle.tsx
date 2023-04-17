import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ShadowBox from './ShadowBox';
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
} from 'react-instantsearch-hooks-web';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import GlobalSearch from './GlobalSearch';

interface PageTitleProps {
  title: string;
}

const searchClient = instantMeiliSearch(
  'http://localhost:7700',
  'XD6DtZnHnb32qPEZX1gCKQIl4fkluHgW1XqMIvc0vlo'
);

export default ({ title }: PageTitleProps) => (
  <ShadowBox>
    <div className="flex items-center">
      <h2 className="text-2xl w-fit">{title}</h2>
      <GlobalSearch className="ml-auto w-[320px]" />
      {/* <InstantSearch
          searchClient={searchClient}
          indexName="quetzal-pages"
          routing={true}
        >
          <SearchBox />
          <Hits
            hitComponent={({ hit }) => (
              <Highlight attribute="title" hit={hit} />
            )}
          />
        </InstantSearch> */}
    </div>
  </ShadowBox>
);
