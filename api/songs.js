const router = require('express').Router();


const {
  SongSchema,
  getSongesPage,
  insertNewSong,
  getSongDetailsById,
  replaceSongById,
  deleteSongById,
  getSongesByOwnerdId,
  getSongsPage
} = require('../models/song');

const { validateAgainstSchema } = require('../lib/validation');

router.get('/', async (req, res) => {
  try {
    /*
     * Fetch page info, generate HATEOAS links for surrounding pages and then
     * send response.
     */
    const songsPage = await getSongsPage(parseInt(req.query.page) || 1);
    if (songsPage.page < songsPage.totalPages) {
      songsPage.links.nextPage = `/songses?page=${songsPage.page + 1}`;
      songsPage.links.lastPage = `/songses?page=${songsPage.totalPages}`;
    }
    if (songsPage.page > 1) {
      songsPage.links.prevPage = `/songses?page=${songsPage.page - 1}`;
      songsPage.links.firstPage = '/songses?page=1';
    }
    res.status(200).send(songsPage);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching songses list.  Please try again later."
    });
  }
});

/*
 * Route to create a new songs.
 */
router.post('/', async (req, res) => {
  if (validateAgainstSchema(req.body, SongSchema)) {
    try {
      const id = await insertNewSong(req.body);
      res.status(201).send({
        id: id,
        links: {
          song: `/songs/${id}`
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error inserting song into DB.  Please try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid song object."
    });
  }
});

/*
 * Route to fetch info about a specific business.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const business = await getSongDetailsById(parseInt(req.params.id));
    if (business) {
      res.status(200).send(business);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch business.  Please try again later."
    });
  }
});

/*
 * Route to replace data for a business.
 */
router.put('/:id', async (req, res, next) => {
  if (validateAgainstSchema(req.body, SongSchema)) {
    try {
      const id = parseInt(req.params.id)
      const updateSuccessful = await replaceSongById(id, req.body);
      if (updateSuccessful) {
        res.status(200).send({
          links: {
            song: `/songs/${id}`
          }
        });
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to update specified song.  Please try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid song object"
    });
  }
});

/*
 * Route to delete a song.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const deleteSuccessful = await deleteSongById(parseInt(req.params.id));
    if (deleteSuccessful) {
      res.status(204).end();
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to delete song.  Please try again later."
    });
  }
});

module.exports = router;