import { Link, useParams } from "react-router-dom";
import { Film } from "../services/apiTypes";
import { useEffect, useState } from "react";
import { getFilm } from "../services/apiService";

const FilmPage = () => {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<Film | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchFilm = async (id: number) => {
    try {
      const film = await getFilm(id);

      setFilm(film);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    fetchFilm(Number(id))
  }, [id]);

  return (
    <div className="custom-card flex w-full min-h-[420px] relative">

      {!film ? (
        <div className="flex-1 flex font-bold text-pinkish-grey items-center justify-center w-full">
          {error ? <span>Error: {error}</span> : <span>Loading...</span>}
        </div>
      ) : (
        <div className="flex flex-1 flex-col w-full">
          <h2 className="font-bold mb-[30px] text-[18px]">{film.title}</h2>

          <div className="flex w-full justify-between flex-1">
            <div className="w-[45%]">
              <h3 className="font-bold text-[16px]">Opening Crawl</h3>
              <div className="w-full h-[1px] mt-[10px] mb-[5px] bg-pinkish-grey"></div>
              <p>{film.openingCrawl}</p>
            </div>

            <div className="w-[45%]">
              <h3 className="font-bold text-[16px]">Characters</h3>
              <div className="w-full h-[1px] mt-[10px] mb-[5px] bg-pinkish-grey"></div>
              {film.characters.map((character, index) => (
                <span key={character.id}>
                  <Link to={`/people/${character.id}`} className="text-dodger-blue cursor-pointer">
                    {character.name}
                  </Link>
                  {index !== film.characters.length - 1 && ', '}
                </span>
              ))}

            </div>
          </div>
          <div className="mt-auto">
            <Link to="/">
              <button className="bg-green-teal text-white font-bold py-[8px] px-[27px] rounded-[17px]">BACK TO SEARCH</button>
            </Link>
          </div>
        </div>
      )
      }
    </div>
  );
}

export default FilmPage;