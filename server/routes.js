const { Pool, types } = require('pg');
const config = require('./config.json')

types.setTypeParser(20, val => parseInt(val, 10));

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
    ORDER BY bi.AverageRating DESC
    LIMIT 10;
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
      ORDER BY AverageRating DESC, NumberOfRatings DESC, AverageHelpfulness DESC
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

  } else {
    res.status(400).json({ error: 'Invalid type parameter. Use "authors", "books", or "publishers".' });
  }
};


// Route 3: GET /profile
// http://localhost:8080/profile/author?id=18456
// http://localhost:8080/profile/book?id=0613036107
const profile = async function (req, res) {
  const type = req.params.type;
  const id = req.query.id; // Extract ID (authorId or bookId)

  if (!id) {
    return res.status(400).json({ error: 'Missing required parameter: id' });
  }

  let query;
  let values = [id]; 

  if (type === 'author') {
    // SQL query for author profile
    query = `
      WITH AuthorBooks AS (
        SELECT
          b.BookId,
          b.Title,
          b.Price,
          b.Image,
          b.InfoLink,
          b.PreviewLink,
          b.RatingsCount,
          AVG(r.Score) AS BookRating,
          COUNT(r.ReviewId) AS ReviewCount,
          ba.AuthorId
        FROM Book b
        JOIN Book_Author ba ON b.BookId = ba.BookId
        LEFT JOIN Review r ON b.BookId = r.BookId
        WHERE ba.AuthorId = $1
        GROUP BY 
          b.BookId, 
          b.Title, 
          b.Price, 
          b.Image, 
          b.InfoLink, 
          b.PreviewLink, 
          b.RatingsCount, 
          ba.AuthorId
      )
      SELECT 
        a.AuthorId,
        a.Name AS AuthorName,
        ab.BookId,
        ab.Title,
        ab.Price,
        ab.Image,
        ab.InfoLink,
        ab.PreviewLink,
        ab.RatingsCount,
        ab.BookRating,
        ab.ReviewCount,
        (SELECT COUNT(DISTINCT BookId) FROM Book_Author WHERE AuthorId = a.AuthorId) AS TotalBooks,
        (SELECT AVG(Score)
         FROM Review r
         JOIN Book_Author ba ON r.BookId = ba.BookId
         WHERE ba.AuthorId = a.AuthorId) AS AuthorAverageRating
      FROM Author a
      JOIN AuthorBooks ab ON a.AuthorId = ab.AuthorId
      WHERE a.AuthorId = $1
      ORDER BY ab.BookRating DESC;
    `;
  } else if (type === 'book') {
    // SQL query for book profile
    query = `
      WITH BookDetails AS (
        SELECT
          b.BookId,
          b.Title,
          b.Price,
          b.Image,
          b.InfoLink,
          b.PreviewLink,
          b.RatingsCount,
          b.PublishedDate,
          p.PublisherName,
          (SELECT AVG(Score) FROM Review r WHERE r.BookId = $1) AS AverageRating,
          (SELECT COUNT(ReviewId) FROM Review r WHERE r.BookId = $1) AS ReviewCount
        FROM Book b
        LEFT JOIN Publisher p ON b.PublisherId = p.PublisherId
        WHERE b.BookId = $1
      ),
      BookAuthors AS (
        SELECT 
          ba.BookId, 
          a.Name AS AuthorName
        FROM Book_Author ba
        JOIN Author a ON ba.AuthorId = a.AuthorId
        WHERE ba.BookId = $1
      ),
      BookCategories AS (
        SELECT 
          bc.BookId, 
          c.Genre
        FROM Book_Category bc
        JOIN Category c ON bc.CategoryId = c.CategoryId
        WHERE bc.BookId = $1
      ),
      SimilarBooks AS (
        SELECT 
          b.BookId, 
          b.Title, 
          b.Image, 
          b.RatingsCount, 
          (SELECT AVG(Score) FROM Review r WHERE r.BookId = b.BookId) AS BookRating
        FROM Book b
        JOIN Book_Category bc1 ON b.BookId = bc1.BookId
        JOIN Book_Category bc2 ON bc1.CategoryId = bc2.CategoryId
        WHERE bc2.BookId = $1 AND b.BookId != $1
        ORDER BY RANDOM()
        FETCH FIRST 5 ROWS ONLY
      )
      SELECT 
        bd.BookId, 
        bd.Title, 
        bd.Price, 
        bd.Image, 
        bd.InfoLink, 
        bd.PreviewLink, 
        bd.RatingsCount, 
        bd.PublishedDate, 
        bd.PublisherName, 
        bd.AverageRating, 
        bd.ReviewCount, 
        (SELECT STRING_AGG(AuthorName, ', ') FROM BookAuthors) AS Authors, 
        (SELECT STRING_AGG(Genre, ', ') FROM BookCategories) AS Genres, 
        (SELECT COUNT(*) FROM SimilarBooks) AS RecommendationCount, 
         CASE WHEN (SELECT COUNT(*) FROM SimilarBooks) > 0 THEN (
           SELECT ARRAY_TO_STRING(
             ARRAY_AGG(sb.Title || ' (Rating: ' || COALESCE(sb.BookRating, 0) || ')'), ', '
           )
           FROM SimilarBooks sb)
         ELSE 'No recommendations available' END AS Recommendations
       FROM BookDetails bd;
    `;
  } else {
    // Handle invalid type parameter case.
    return res.status(400).json({ error: 'Invalid type parameter. Use "author" or "book".' });
  }

  // Execute the SQL query and return results.
  connection.query(query, values, (err, data) => {
    if (err) {
      console.error(err); 
      res.status(500).json({ error: 'Failed to fetch profile.' });
    } else if (data.rows.length === 0) {
      res.status(404).json({ error: `No profile found for the given ${type} ID.` });
    } else {
      res.json(data.rows); 
    }
  });
};


// Route 4: GET /recommendation
// http://localhost:8080/daily/book
const recommendation = async function (req, res) {
  const type = req.params.type;

  if (type === 'book') {
    // SQL query for book recommendation
    query = `
      WITH BookMetrics AS (
        SELECT 
          b.BookId,
          b.Title,
          b.Price,
          b.RatingsCount,
          AVG(r.Score) AS AverageRating,
          COUNT(DISTINCT r.UserId) AS NumberOfReviews
        FROM 
          Book b
        LEFT JOIN 
          Review r ON b.BookId = r.BookId
        GROUP BY 
          b.BookId, b.Title, b.Price, b.RatingsCount
      )
      SELECT 
        bm.BookId,
        bm.Title,
        bm.AverageRating,
        bm.NumberOfReviews
      FROM 
        BookMetrics bm
      WHERE 
        bm.RatingsCount > 50
        AND bm.AverageRating > (SELECT AVG(AverageRating) FROM BookMetrics)
      ORDER BY 
        RANDOM() 
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
// http://localhost:8080/popular_genre
const popular_genre = async function (req, res) {
  // SQL query to fetch popular genres
  const query = `
    WITH GenrePopularity AS (
      SELECT 
        c.CategoryId,
        c.Genre,
        COUNT(DISTINCT bc.BookId) AS BookCount,
        AVG(r.Score) AS AverageRating,
        COUNT(DISTINCT r.UserId) AS UserEngagement
      FROM Category c
      JOIN Book_Category bc ON c.CategoryId = bc.CategoryId
      JOIN Book b ON bc.BookId = b.BookId
      LEFT JOIN Review r ON b.BookId = r.BookId
      WHERE r.Score IS NOT NULL
      GROUP BY c.CategoryId, c.Genre
    )
    SELECT 
      Genre,
      BookCount,
      AverageRating,
      UserEngagement
    FROM GenrePopularity
    WHERE 
      UserEngagement > (SELECT AVG(UserEngagement) FROM GenrePopularity)
      AND BookCount > (SELECT AVG(BookCount) FROM GenrePopularity)
    ORDER BY 
      AverageRating DESC,
      UserEngagement DESC,
      BookCount DESC
    LIMIT 5;
  `;

  // Execute the SQL query
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err); 
      res.json({}); 
    } else {
      res.json(data.rows); 
    }
  });
};


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
  profile,
  recommendation,
  popular_genre,
  review,
}