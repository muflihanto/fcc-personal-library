/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const { ObjectId } = require("mongodb");

/**
 * @param {import('express').Express} app - Express app instance
 * @param {import('mongodb').Db} database - Database instance
 */
module.exports = function (app, database) {
  const collection = database.collection("books");

  app
    .route("/api/books")
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      collection
        .find({})
        .toArray()
        .then((docs) => {
          const newDocs = docs.map((doc) => {
            const commentcount = doc.comments.length;
            delete doc.comments;
            return {
              ...doc,
              commentcount,
            };
          });
          res.json(newDocs);
        })
        .catch((_) => {
          res.status(404).json({ result: "not found" });
        });
    })

    .post(function (req, res) {
      //response will contain new book object including atleast _id and title
      const title = req.body.title;

      if (title === undefined) return res.status(200).send("missing required field title");

      collection
        .insertOne({
          title,
          comments: [],
        })
        .then((doc) => {
          res.json({
            title,
            _id: doc.insertedId,
          });
        })
        .catch(() => {
          res.status(500).send("cannot insert a book");
        });
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      collection
        .deleteMany({})
        .then(() => {
          res.send("complete delete successful");
        })
        .catch(() => {
          res.status(500).send("cannot delete all books");
        });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      const bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let bookObjectId;
      try {
        bookObjectId = new ObjectId(bookid);
      } catch (_) {
        return res.send("no book exists");
      }

      collection
        .findOne({
          _id: bookObjectId,
        })
        .then((doc) => {
          if (doc === null) return res.send("no book exists");
          return res.json(doc);
        })
        .catch(() => {
          res.status(500).send("failed retrieving book information");
        });
    })

    .post(function (req, res) {
      const bookid = req.params.id;
      const comment = req.body.comment;
      //json res format same as .get
      let bookObjectId;
      try {
        bookObjectId = new ObjectId(bookid);
      } catch (_) {
        return res.send("no book exists");
      }

      if (comment === undefined) return res.send("missing required field comment");

      collection
        .findOneAndUpdate(
          {
            _id: bookObjectId,
          },
          {
            $push: {
              comments: comment,
            },
          },
          {
            returnDocument: "after",
          }
        )
        .then((doc) => {
          if (doc === null) return res.send("no book exists");
          return res.json(doc);
        });
    })

    .delete(function (req, res) {
      const bookid = req.params.id;
      //if successful response will be 'delete successful'
      let bookObjectId;
      try {
        bookObjectId = new ObjectId(bookid);
      } catch (_) {
        return res.send("no book exists");
      }

      collection
        .deleteOne({
          _id: bookObjectId,
        })
        .then((result) => {
          if (result.deletedCount === 1) {
            return res.send("delete successful");
          } else {
            return res.send("no book exists");
          }
        })
        .catch(() => {
          res.status(500).send("cannot delete a book");
        });
    });
};
