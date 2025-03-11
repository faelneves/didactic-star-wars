import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { searchSWAPI } from '../services/apiService';
import { SearchResult } from '../services/apiTypes';

const SearchPage = () => {
  const [selectedType, setSelectedType] = useState<'people' | 'films'>('people');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);
    setResults([]);
    try {
      const data = await searchSWAPI(selectedType, searchQuery);
      setResults(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-x-[30px] justify-center items-start flex-col md:flex-row ">
      <div className="custom-card w-[95%] mx-auto md:mx-0 md:w-[410px] md:max-w-[40%] mb-[30px]">
        <span className="font-semibold text-strong-grey" >What are you searching for?</span>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="my-[20px] font-bold flex gap-x-[30px]">
            <label className="flex gap-x-[10px]">
              <input
                type="radio"
                name="type"
                value="people"
                id="people"
                checked={selectedType === "people"}
                onChange={() => setSelectedType("people")}
              />
              <span>People</span>
            </label>

            <label className="flex gap-x-[10px]">
              <input
                type="radio"
                name="type"
                value="films"
                id="films"
                checked={selectedType === "films"}
                onChange={() => setSelectedType("films")}
              />
              <span>Movies</span>
            </label>
          </div>

          <input
            type="text"
            className="border border-pinkish-grey shadow rounded-[4px] p-[11px] font-bold text-strong-grey"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. Chewbacca, Yoda, Boba Fett"
          />
          <button
            type="submit"
            className={`text-white font-bold py-[8px] rounded-[20px] mt-[20px] ${searchQuery ? 'bg-green-teal' : 'bg-pinkish-grey'}`}
            disabled={!searchQuery || isLoading}>
            {isLoading ? 'SEARCHING...' : 'SEARCH'}
          </button>
        </form>
      </div>

      <div className="custom-card w-[95%] mx-auto md:mx-0 md:w-[582px] md:max-w-[58%] p-[30px] min-h-[582px] flex flex-col">
        <span className="text-[18px] font-bold" >Results</span>
        <div className="w-full h-[1px] my-[10px] bg-pinkish-grey"></div>
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <div className="text-center font-bold text-pinkish-grey">
            {
              isLoading ? <span>Searching...</span> :
                error ? <span>Error: {error}</span> :
                  results.length === 0 ? <span>There are zero matches.<br />Use the form to search for People or Movies.</span> : null
            }
          </div>
          {results.length > 0 &&
            <div className="flex flex-col w-full mb-auto">
              {
                results.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-center">
                      <span className="text-[16px] font-bold">{item.name || item.title}</span>
                      <Link to={`/${selectedType}/${item.id}`}>
                        <button className="bg-green-teal text-white font-bold py-[8px] px-[20px] rounded-[17px]">SEE DETAILS</button>
                      </Link>
                    </div>
                    <div className="w-full h-[1px] my-[10px] bg-pinkish-grey"></div>
                  </div>
                ))
              }
            </div>
          }
        </div>

      </div>
    </div>
  );
};

export default SearchPage;