import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import EventItem from "./EventItem";

export default function FindEventSection() {
  const [searchTerm, setSearchTerm] = useState();
  const searchElement = useRef();

  //for the dynamic queryKey, we are using the useState and not ref since ref didnot rerender the component again.

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["events", { search: searchTerm }],
    //signal is by default provided by queryfn in the form of key to object
    queryFn: ({signal}) => fetchEvents({signal, searchTerm}),
    enabled: searchTerm !== undefined,
  });

  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
  }

  let content = <p>Please enter a search term and to find events.</p>;
  if (isLoading) {
    content = <LoadingIndicator />;
  }
  if (isError) {
    content = (
      <ErrorBlock
        title="an error occurred"
        message={error.info?.message || "failed to fetch events."}
      />
    );
  }
  if (data) {
    content= <ul className="events-list">
      {data.map((event) => (
        <li key={event.id}>
          <EventItem event={event}></EventItem>
        </li>
      ))}
    </ul>;
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button onClick={handleSubmit}>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
