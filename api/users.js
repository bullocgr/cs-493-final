const router = require('express').Router();
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const { validateAgainstSchema } = require('../lib/validation');

const {
  UserSchema,
  insertNewuser,
  getuserById,
  getusersAll,
  replaceuserById,
  deleteuserById,
  getusersPage,
  validateUser
} = require('../models/users');

router.get('/:id', requireAuthentication, async (req, res) => {
  if(req.user == req.params.id){
  try {
    /*
     * Fetch page info, generate HATEOAS links for surrounding pages and then
     * send response.
     */
    const usersPage = await getuserById(req.params.id)
    res.status(200).send(usersPage);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching useres list.  Please try again later."
    });
  }
}
else{
  res.status(401).send({
    error: "Unauthorized action."
  });
}
});

router.get('/', async (req, res) => {
  try {
    /*
     * Fetch page info, generate HATEOAS links for surrounding pages and then
     * send response.
     */
    const userPage = await getusersPage(parseInt(req.query.page) || 1);
    if (userPage.page < userPage.totalPages) {
      userPage.links.nextPage = `/users?page=${userPage.page + 1}`;
      userPage.links.lastPage = `/users?page=${userPage.totalPages}`;
    }
    if (userPage.page > 1) {
      userPage.links.prevPage = `/users?page=${userPage.page - 1}`;
      userPage.links.firstPage = '/users?page=1';
    }
    res.status(200).send(userPage);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching users list.  Please try again later."
    });
  }
});

/*
 * Route to create a new user.
 */
router.post('/', async (req, res) => {
if(validateAgainstSchema(req.body, UserSchema)){
  try {
    const deleteSuccessful = await insertNewuser(req.body);
    if (deleteSuccessful) {
      res.status(201).send({
        success: "Changed new user into database!",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to delete review.  Please try again later."
    });
  }
}
else{
  res.status(500).send({
    error: "Unable to make new user.  Please try again later."
  });
}
});

/*
 * Route to replace data for a user.
 */
router.put('/:id',  requireAuthentication, async (req, res) => {
  if(req.user == req.params.id){
  if(validateAgainstSchema(req.body, UserSchema)){
    try {
      const deleteSuccessful = await replaceuserById(req.params.id,req.body);
      if (deleteSuccessful) {
        res.status(201).send({
          success: "Changed new user into database!",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to delete review.  Please try again later."
      });
    }
  }
}
else{
  res.status(401).send({
    error: "Unauthorized action."
  });
}
  });

  router.post('/login', async (req, res) => {
    if (req.body && req.body.id && req.body.password) {
      try {
        const authenticated = await validateUser(req.body.id, req.body.password);
        if (authenticated) {
          res.status(200).send({
            token: generateAuthToken(req.body.id)
          });
        } else {
          res.status(401).send({
            error: "Invalid authentication credentials."
          });
        }
      } catch (err) {
        console.error("  -- error:", err);
        res.status(500).send({
          error: "Error logging in.  Try again later."
        });
      }
    } else {
      res.status(400).send({
        error: "Request body needs `id` and `password`."
      });
    }
  });
  
module.exports = router;