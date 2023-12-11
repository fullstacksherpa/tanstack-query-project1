//useQuery by default pass object with signal properties in it and we r destructuring that
export async function fetchEvents({signal}) {
  let url = 'http://localhost:3000/events';
  if (signal.searchTerm){
    url += '?search=' + signal.searchTerm
  }

  //we r assigning the signal value received from useQuery to our signal key so that browser can abort fetching data if necessery.
    const response = await fetch(url, {signal:signal});


    if (!response.ok) {
      const error = new Error('An error occurred while fetching the events');
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const { events } = await response.json();

    return events;
  }