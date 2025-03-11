import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Person } from "../services/apiTypes";
import { getPerson } from "../services/apiService";

const PersonPage = () => {
  const { id } = useParams();
  const [person, setPerson] = useState<Person | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPerson = useCallback(async (id: number) => {
    try {
      const person = await getPerson(id);

      setPerson(person);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    fetchPerson(Number(id))
  }, [id, fetchPerson]);

  return (
    <div className="custom-card flex w-[95%] md:w-full mx-auto min-h-[420px] relative">

      {!person ? (
        <div className="flex-1 flex font-bold text-pinkish-grey items-center justify-center w-full">
          {error ? <span>Error: {error}</span> : <span>Loading...</span>}
        </div>
      ) : (
        <div className="flex flex-1 flex-col w-full">
          <h2 className="font-bold mb-[30px] text-[18px]">{person.name}</h2>

          <div className="flex w-full justify-between flex-1 flex-col md:flex-row mb-[30px]">
            <div className="w-full md:w-[45%] mb-[30px]">
              <h3 className="font-bold text-[16px]">Details</h3>
              <div className="w-full h-[1px] mt-[10px] mb-[5px] bg-pinkish-grey"></div>
              <p>Birth Year: {person.birth_year}</p>
              <p>Gender: {person.gender}</p>
              <p>Eye Color: {person.eye_color}</p>
              <p>Hair Color: {person.hair_color}</p>
              <p>Height: {person.height}</p>
              <p>Mass: {person.mass}</p>
            </div>

            <div className="w-full md:w-[45%]">
              <h3 className="font-bold text-[16px]">Movies</h3>
              <div className="w-full h-[1px] mt-[10px] mb-[5px] bg-pinkish-grey"></div>
              {person.films.map((film, index) => (
                <span key={film.id}>
                  <Link to={`/films/${film.id}`} className="text-dodger-blue cursor-pointer">
                    {film.title}
                  </Link>
                  {index !== person.films.length - 1 && ', '}
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

export default PersonPage;