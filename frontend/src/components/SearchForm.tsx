import { FormEvent } from 'react';

interface SearchFormProps {
  selectedType: 'people' | 'films';
  searchQuery: string;
  isLoading: boolean;
  onTypeChange: (type: 'people' | 'films') => void;
  onQueryChange: (query: string) => void;
  onSubmit: (e: FormEvent) => void;
}

const SearchForm = ({
  selectedType,
  searchQuery,
  isLoading,
  onTypeChange,
  onQueryChange,
  onSubmit
}: SearchFormProps) => {
  return (
    <form className="full-height-flex justify-between" onSubmit={onSubmit}>
      <div>
        <span className="font-semibold text-strong-grey">What are you searching for?</span>

        <div className="my-[20px] font-bold flex gap-x-[30px]">
          <label className="flex gap-x-[10px]">
            <input
              type="radio"
              name="type"
              value="people"
              checked={selectedType === "people"}
              onChange={() => onTypeChange("people")}
            />
            <span>People</span>
          </label>

          <label className="flex gap-x-[10px]">
            <input
              type="radio"
              name="type"
              value="films"
              checked={selectedType === "films"}
              onChange={() => onTypeChange("films")}
            />
            <span>Movies</span>
          </label>
        </div>

        <input
          type="text"
          className="border border-pinkish-grey shadow rounded p-[11px] font-bold text-strong-grey w-full"
          value={searchQuery}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="e.g. Chewbacca, Yoda, Boba Fett"
        />
      </div>
      <button
        type="submit"
        className={`text-white font-bold py-[8px] rounded-[20px] mt-[20px] mb-[40px] md:mb-0 ${searchQuery ? 'bg-green-teal' : 'bg-pinkish-grey'
          }`}
        disabled={!searchQuery || isLoading}
      >
        {isLoading ? 'SEARCHING...' : 'SEARCH'}
      </button>
    </form>
  );
};

export default SearchForm;