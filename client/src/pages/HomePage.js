import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

import ModifiedLazyTable from '../components/ModifiedLazyTable';
import AuthorCard from '../components/AuthorCard';
import BookCard from '../components/BookCard';
const config = require('../config.json');

export default function HomePage() {
  // We use the setState hook to persist information across renders (such as the result of our API calls)
  const [bookOfTheDay, setBookOfTheDay] = useState({});
  const [authorOfTheDay, setAuthorOfTheDay] = useState({});
  //const [loading, setLoading] = useState(true);

  const [selectedBookId, setSelectedBookId] = useState(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState(null);


  // The useEffect hook by default runs the provided callback after every render
  // The second (optional) argument, [], is the dependency array which signals
  // to the hook to only run the provided callback if the value of the dependency array
  // changes from the previous render. In this case, an empty array means the callback
  // will only run on the very first render.
  useEffect(() => {
    // Fetch request to get the song of the day. Fetch runs asynchronously.
    // The .then() method is called when the fetch request is complete
    // and proceeds to convert the result to a JSON which is finally placed in state.
    fetch(`http://${config.server_host}:${config.server_port}/daily/book`)
      .then(res => res.json())
      .then(resJson => setBookOfTheDay(resJson));

    // TODO (TASK 14): add a fetch call to get the app author (name not pennkey) and store the name field in the state variable
  }, []);
  useEffect(() => {
    // Fetch request to get the song of the day. Fetch runs asynchronously.
    // The .then() method is called when the fetch request is complete
    // and proceeds to convert the result to a JSON which is finally placed in state.
    fetch(`http://${config.server_host}:${config.server_port}/daily/author`)
      .then(res => res.json())
      .then(resJson => setAuthorOfTheDay(resJson));

    // TODO (TASK 14): add a fetch call to get the app author (name not pennkey) and store the name field in the state variable
  }, []);


  
  const bookColumns = [
    {
      field: 'title',
      headerName: 'Book Title',
      renderCell: (row) => <Link onClick={() => setSelectedBookId(row.bookid)}>{row.title}</Link> // A Link component is used just for formatting purposes
    },
    {
      field: 'averagerating',
      headerName: 'Average Rating',

    },
    {
      field: 'numberofratings',
      headerName: 'Total Ratings'
    },
  ];


  const authorColumns = [
    {
      field: 'name',
      headerName: 'Author Name',
      renderCell: (row) => <Link onClick={() => setSelectedAuthorId(row.authorid)}>{row.authorname}</Link>
    },
    {
      field: 'topbook',
      headerName: 'Top Book',
      //renderCell: (row) => <Link onClick={() => setSelectedBookId(row.authorname)}>{row.topbook}</Link>
    },
    {
      field: 'averagerating',
      headerName: 'Average Rating',
      
    }
  ]

  const publisherColumns = [
    {
      field: 'publishername',
      headerName: 'Publisher Name',
    },
    {
      field: 'averagerating',
      headerName: 'Average rating'
    }
  ]

  return (
    <Container>
      {/* SongCard is a custom component that we made. selectedSongId && <SongCard .../> makes use of short-circuit logic to only render the SongCard if a non-null song is selected */}
      {selectedBookId && <BookCard bookId={selectedBookId} handleClose={() => setSelectedBookId(null)} />}
      {selectedAuthorId && <AuthorCard authorId={selectedAuthorId} handleClose={() => setSelectedAuthorId(null)} />}
      <h2>Check out your book of the day:&nbsp;
        <Link onClick={() => setSelectedBookId(bookOfTheDay.book_id)}>{bookOfTheDay.title}</Link>
      </h2>
      <h2>Check out your author of the day:&nbsp;
        <Link onClick={() => setSelectedAuthorId(authorOfTheDay.author_id)}>{authorOfTheDay.name}</Link>
      </h2>
      <Divider />
      <h2>Top Books</h2>
      <ModifiedLazyTable route={`http://${config.server_host}:${config.server_port}/top/books`} columns={bookColumns} />
      <Divider />
      {/* TODO (TASK 16): add a h2 heading, LazyTable, and divider for top albums. Set the LazyTable's props for defaultPageSize to 5 and rowsPerPageOptions to [5, 10] */}
      <h2>Top Authors</h2>
      <ModifiedLazyTable 
        route={`http://${config.server_host}:${config.server_port}/top/authors`} 
        columns={authorColumns} 
        defaultPageSize={5}
        rowsPerPageOptions={[5, 10]}
      />
      <h2>Top Publishers</h2>
      <ModifiedLazyTable 
        route={`http://${config.server_host}:${config.server_port}/top/publishers`} 
        columns={publisherColumns} 
        defaultPageSize={5}
        rowsPerPageOptions={[5, 10]}
      />
    </Container>
  );
};