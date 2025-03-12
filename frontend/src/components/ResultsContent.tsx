import { Link } from 'react-router-dom';
import { SearchResult } from '../services/apiTypes';

interface ResultsContentProps {
  isLoading: boolean;
  error: string | null;
  results: SearchResult[];
  selectedType: 'people' | 'films';
  resetSearch?: () => void;
}

const ResultsContent = ({
  isLoading,
  error,
  results,
  selectedType,
  resetSearch
}: ResultsContentProps) => {
  return (
    <div className="w-full full-height-flex justify-between">
      <div className="w-full full-height-flex justify-between">
        <span className="text-[18px] font-bold">Results</span>
        <div className="w-full h-[1px] my-[10px] bg-pinkish-grey"></div>
        <div className="full-height-flex items-center justify-center w-full">
          <div className="text-center font-bold text-pinkish-grey">
            {isLoading ? (
              <span>Searching...</span>
            ) : error ? (
              <span>Error: {error}</span>
            ) : results.length === 0 ? (
              <span>
                There are zero matches.
                <br />
                Use the form to search for People or Movies.
              </span>
            ) : null}
          </div>
          {results.length > 0 && (
            <div className="flex flex-col w-full mb-auto">
              {results.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between items-center flex-col md:flex-row">
                    <span className="text-[16px] font-bold mr-auto mb-[5px] md:mb-0">
                      {item.name || item.title}
                    </span>
                    <Link className='w-full md:w-auto' to={`/${selectedType}/${item.id}`}>
                      <button className="bg-green-teal text-white font-bold py-[8px] px-[20px] rounded-[17px] w-[100%] md:w-auto">
                        SEE DETAILS
                      </button>
                    </Link>
                  </div>
                  <div className="w-full h-[1px] my-[10px] bg-pinkish-grey"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {!isLoading &&
        <div className='flex mb-[40px] mt-[30px] md:hidden'>
          <button className="mt-auto mx-auto bg-green-teal text-white font-bold py-[8px] rounded-[17px] w-[100%]" onClick={resetSearch}>
            BACK TO SEARCH
          </button>
        </div>
      }
    </div>
  );
};

export default ResultsContent;