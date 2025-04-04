const { Pool, types } = require('pg');
const config = require('./config.json')

// Override the default parsing for BIGINT (PostgreSQL type ID 20)
types.setTypeParser(20, val => parseInt(val, 10)); //DO NOT DELETE THIS

// Create PostgreSQL connection using database credentials provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = new Pool({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
  ssl: {
    rejectUnauthorized: false,
  },
});
connection.connect((err) => err && console.log(err));

/******************
 * ROUTES *
 ******************/

// Route 1: GET /search_books
// http://localhost:8080/search_books?author=John&title=Ocean
const search_books = async function (req, res) {
  const title = req.query.title ?? '';
  const author = req.query.author ?? '';
  const genre = req.query.genre ?? '';
  const priceLow = req.query.price_low ?? 0;
  const priceHigh = req.query.price_high ?? 1000;
  const ratingLow = req.query.rating_low ?? 0;
  const ratingHigh = req.query.rating_high ?? 5;

  let query = `
    WITH Book_Info AS (
      SELECT 
        b.title,
        b.price,
        b.image,
        b.infoLink,
        b.previewLink,
        bc.categoryId,
        ba.authorId,
        AVG(r.score) AS AverageRating
      FROM Book b
      JOIN Book_Category bc ON b.bookId = bc.bookId
      JOIN Book_Author ba ON b.bookID = ba.bookId
      JOIN Review r ON b.bookID = r.bookId
      GROUP BY 
        b.title, 
        b.price, 
        b.image, 
        b.infoLink, 
        b.previewLink, 
        bc.categoryId, 
        ba.authorId
    )
    SELECT 
      bi.title,
      bi.price,
      bi.image,
      bi.infoLink,
      bi.previewLink,
      bi.AverageRating,
      c.genre,
      a.name AS authorName
    FROM Book_Info bi
    JOIN Category c ON bi.categoryId = c.categoryId
    JOIN Author a ON bi.authorId = a.authorId
    WHERE bi.title LIKE '%${title}%'
      AND a.name LIKE '%${author}%'
      AND c.genre LIKE '%${genre}%'
      AND bi.price BETWEEN ${priceLow} AND ${priceHigh}
      AND bi.AverageRating BETWEEN ${ratingLow} AND ${ratingHigh}
    ORDER BY bi.AverageRating DESC;
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
};

// Route 2: GET /top
// http://localhost:8080/top/authors
const top = async function (req, res) {
  const type = req.params.type;
  if (type === 'authors') {
    const query = `
      WITH AuthorRating AS (
        SELECT
          a.AuthorId,
          a.Name AS AuthorName,
          AVG(r.Score) AS AverageRating,
          AVG(r.helpfulness) AS AverageHelpfulness,
          COUNT(DISTINCT r.UserId) AS NumberOfRatings
        FROM Book_Author ba
        JOIN Review r ON ba.BookId = r.BookId
        JOIN Author a ON ba.AuthorId = a.AuthorId
        WHERE r.Score IS NOT NULL
        GROUP BY a.AuthorId, a.Name
      ),
      TopBooks AS (
        SELECT
          AuthorID,
          title AS TopBook
        FROM (
          SELECT
            AuthorID,
            title,
            score,
            ROW_NUMBER() OVER (PARTITION BY AuthorId ORDER BY score DESC) AS rank
          FROM (
            SELECT
              ba.AuthorId,
              b.title,
              AVG(r.Score) AS Score
            FROM Book_Author ba
            JOIN Review r ON ba.BookId = r.BookId
            JOIN Book b ON ba.BookId = b.BookId
            WHERE r.Score IS NOT NULL
            GROUP BY ba.AuthorId, b.title
          ) AS author_title_mapping
        ) AS ranked_books
        WHERE rank = 1
      )
      SELECT
        ar.AuthorName,
        tb.TopBook,
        ar.AverageRating,
        ar.NumberOfRatings,
        ar.AverageHelpfulness
      FROM AuthorRating ar 
      JOIN TopBooks tb ON ar.AuthorId = tb.AuthorId
      WHERE ar.AverageHelpfulness > (SELECT AVG(AverageHelpfulness) FROM AuthorRating)
        AND ar.NumberOfRatings > (SELECT AVG(NumberOfRatings) FROM AuthorRating)
        AND ar.AverageRating > (SELECT AVG(AverageRating) FROM AuthorRating)
      ORDER BY ar.AverageRating DESC, ar.NumberOfRatings DESC, ar.AverageHelpfulness DESC
      LIMIT 10;
    `;

    connection.query(query, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({});
      } else {
        res.json(data.rows);
      }
    });

  } else if (type === 'books') {
    const query = `
      SELECT 
        b.BookId,
        b.Title,
        AVG(r.Score) AS AverageRating,
        COUNT(r.UserId) AS NumberOfRatings
      FROM Book b
      JOIN Review r ON b.BookId = r.BookId
      GROUP BY b.BookId, b.Title
      ORDER BY AverageRating DESC, NumberOfRatings DESC
      LIMIT 10;
    `;

    connection.query(query, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({});
      } else {
        res.json(data.rows);
      }
    });

  } else if (type === 'publishers') {
    const query = `
      WITH PublisherRating AS (
        SELECT 
          p.publisherid,
          p.publishername AS PublisherName,
          AVG(r.score) AS AverageRating,
          AVG(r.helpfulness) AS AverageHelpfulness,
          COUNT(DISTINCT r.userid) AS NumberOfRatings
        FROM Book b
        JOIN Review r ON b.bookid = r.bookid
        JOIN Publisher p ON b.publisherid = p.publisherid
        WHERE r.score IS NOT NULL
        GROUP BY p.publisherid, p.publishername
      )
      SELECT 
        PublisherName,
        AverageRating,
        NumberOfRatings,
        AverageHelpfulness
      FROM PublisherRating
      WHERE AverageHelpfulness > (SELECT AVG(AverageHelpfulness) FROM PublisherRating)
        AND NumberOfRatings > (SELECT AVG(NumberOfRatings) FROM PublisherRating)
        AND AverageRating > (SELECT AVG(AverageRating) FROM PublisherRating)
      ORDER BY AverageRating DESC, NumberOfRatings DESC, AverageHelpfulness DESC;
    `;

    connection.query(query, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({});
      } else {
        res.json(data.rows);
      }
    });

  } else {
    res.status(400).json({ error: 'Invalid type parameter. Use "authors", "books", or "publishers".' });
  }
};


// Route 3: GET /profile


// Route 4: GET /recommendation
// http://localhost:8080/daily/book
const recommendation = async function (req, res) {
  const type = req.params.type;

  if (type === 'book') {
    // SQL query for book recommendation
    query = `
      SELECT
        BookId,
        Title
      FROM
        Book
      WHERE
        Price > 10 AND RatingsCount > 50
      ORDER BY RANDOM()
      LIMIT 1;
    `;
  } else if (type === 'author') {
    // SQL query for author recommendation
    query = `
      WITH AuthorRating AS (
        SELECT 
          a.AuthorId,
          a.Name AS AuthorName,
          AVG(r.Score) AS AverageRating,
          COUNT(DISTINCT r.UserId) AS NumberOfRatings
        FROM Book_Author ba
        JOIN Review r ON ba.BookId = r.BookId
        JOIN Author a ON ba.AuthorId = a.AuthorId
        WHERE r.Score IS NOT NULL
        GROUP BY a.AuthorId, a.Name
      )
      SELECT 
        AuthorID,
        AuthorName
      FROM AuthorRating
      WHERE 
        NumberOfRatings > (SELECT AVG(NumberOfRatings) FROM AuthorRating)
        AND AverageRating > (SELECT AVG(AverageRating) FROM AuthorRating)
      ORDER BY RANDOM()
      LIMIT 1;
    `;
  } else {
    return res.status(400).json({ error: 'Invalid type parameter. Use "book" or "author".' });
  }

  // Execute the selected SQL query
  connection.query(query, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch recommendation.' });
    } else if (data.rows.length === 0) {
      res.status(404).json({ error: 'No recommendations found.' });
    } else {
      if (type === 'book') {
        res.json({
          book_id: data.rows[0].bookid, 
          title: data.rows[0].title,
        });
      } else if (type === 'author') {
        res.json({
          author_id: data.rows[0].authorid, 
          name: data.rows[0].authorname,
        });
      }
    }
  });
};

// Route 5: GET /popular_genre

// Route 6: GET /review
// http://localhost:8080/review/0975438212
const review = async function (req, res) {
  const bookId = req.params.bookId;
  let query = `
    SELECT 
      b.BookId,
      b.Title,
      AVG(r.Score) AS AverageRating,
      COUNT(DISTINCT r.UserId) AS NumberOfRatings,
      (SELECT summary
       FROM Review
       WHERE BookId = '${bookId}'
       ORDER BY RANDOM()
       LIMIT 1) AS RandomReview1,
      (SELECT summary
       FROM Review
       WHERE BookId = '${bookId}'
       ORDER BY RANDOM()
       LIMIT 1) AS RandomReview2
    FROM Book b
    JOIN Review r ON b.BookId = r.BookId
    WHERE r.Score IS NOT NULL
      AND r.BookID = '${bookId}'
    GROUP BY b.BookId, b.Title, RandomReview1, RandomReview2;
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else if (data.rows.length === 0) {
      res.status(404).json({ error: 'No reviews found for the specified book.' });
    } else {
      const result = data.rows[0];
      res.json({
        book_id: result.bookid,
        title: result.title,
        average_rating: result.averagerating,
        number_of_ratings: result.numberofratings,
        random_review_1: result.randomreview1,
        random_review_2: result.randomreview2,
      });
    }
  });
};


module.exports = {
  search_books,
  top,
  // profile,
  recommendation,
  // popular_genre,
  review,
}