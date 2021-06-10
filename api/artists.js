const router = require('express').Router();


const {
  ArtistSchema,
  getArtistsPage,
  insertNewArtist,
  getArtistDetailsById,
  replaceArtistById,
  deleteArtistById,
  getArtistsByOwnerdId,
} = require('../models/artists');

const { validateAgainstSchema } = require('../lib/validation');

router.get('/', async (req, res) => {
  try {
    /*
     * Fetch page info, generate HATEOAS links for surrounding pages and then
     * send response.
     */
    const artistsPage = await getArtistsPage(parseInt(req.query.page) || 1);
    if (artistsPage.page < artistsPage.totalPages) {
      artistsPage.links.nextPage = `/artists?page=${artistsPage.page + 1}`;
      artistsPage.links.lastPage = `/artists?page=${artistsPage.totalPages}`;
    }
    if (artistsPage.page > 1) {
      artistsPage.links.prevPage = `/artists?page=${artistsPage.page - 1}`;
      artistsPage.links.firstPage = '/artists?page=1';
    }
    res.status(200).send(artistsPage);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching artists list.  Please try again later."
    });
  }
});

/*
 * Route to create a new artists.
 */
router.post('/', async (req, res) => {
  if (validateAgainstSchema(req.body, ArtistSchema)) {
    try {
      const id = await insertNewArtist(req.body);
      res.status(201).send({
        id: id,
        links: {
          artist: `/artists/${id}`
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error inserting artist into DB.  Please try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid artist object."
    });
  }
});

/*
 * Route to fetch info about a specific business.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const business = await getArtistDetailsById(parseInt(req.params.id));
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
  if (validateAgainstSchema(req.body, ArtistSchema)) {
    try {
      const id = parseInt(req.params.id)
      const updateSuccessful = await replaceArtistById(id, req.body);
      if (updateSuccessful) {
        res.status(200).send({
          links: {
            artist: `/artists/${id}`
          }
        });
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to update specified artist.  Please try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid artist object"
    });
  }
});

/*
 * Route to delete a artist.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const deleteSuccessful = await deleteArtistById(parseInt(req.params.id));
    if (deleteSuccessful) {
      res.status(204).end();
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to delete artist.  Please try again later."
    });
  }
});

module.exports = router;