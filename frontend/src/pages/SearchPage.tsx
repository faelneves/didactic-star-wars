import { useState, FormEvent } from 'react';
import { searchSWAPI } from '../services/apiService';
import { SearchResult } from '../services/apiTypes';
import SearchForm from '../components/SearchForm';
import ResultsContent from '../components/ResultsContent';

const SearchPage = () => {
  const [selectedType, setSelectedType] = useState<'people' | 'films'>('people');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetSearch = () => {
    setSearchQuery('');
    setResults([]);
    setError(null);
    setShowResult(false);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults([]);
    setShowResult(true);

    try {
      const data = await searchSWAPI(selectedType, searchQuery);
      setResults(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
      setShowResult(true);
    }
  };

  return (
    <div className="flex gap-x-[30px] justify-center items-start flex-col md:flex-row flex-1">
      <div className="w-[95%] mx-auto align-center px-[10px] full-height-flex
        md:flex md:gap-x-[30px] md:w-full md:items-start md:justify-center md:flex-row">

        <div className={`${(!isLoading && !results.length && !error && !showResult) ? '' : 'hidden md:flex'}
          full-height-flex md:custom-card md:w-[410px] md:max-w-[40%] md:mb-[30px]`}>
          <SearchForm
            selectedType={selectedType}
            searchQuery={searchQuery}
            isLoading={isLoading}
            onTypeChange={setSelectedType}
            onQueryChange={setSearchQuery}
            onSubmit={handleSubmit}
          />
        </div>

        <div className={`${(isLoading || results.length > 0 || error || showResult) ? '' : 'hidden md:flex'}
        full-height-flex md:custom-card md:w-[582px] md:max-w-[58%] md:p-[30px] md:min-h-[582px]`}>
          <ResultsContent
            isLoading={isLoading}
            error={error}
            results={results}
            selectedType={selectedType}
            resetSearch={resetSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;