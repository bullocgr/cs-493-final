const router = require('express').Router();

const mysqlPool = require('../lib/mysqlPool');


const artistSchema = {
id: { required: true },
name: { required: true },
popularity: { required: false },
duration: { required: true },
date: { required: true }
};

router.get('/', async (req, res) => {

try {
    const businessesPage = await getBusinessesPage(
    parseInt(req.query.page) || 1
    );
    res.status(200).send(businessesPage);
} catch (err) {
    console.error("  -- error:", err);
    res.status(500).send({
    err: "Error fetching business page from DB.  Try again later."
    });
}  
});


async function getBusinessesPage(page) {
const count = await getBusinessesCount();
const numPerPage = 10;
const lastPage = Math.ceil(count/numPerPage);
page = page > lastPage ? lastPage : page;
page = page < 1 ? 1 : page;
const offset = (page - 1) * numPerPage;

/*
    * Calculate starting and ending indices of businesses on requested page and
    * slice out the corresponsing sub-array of busibesses.
    */
// const start = (page - 1) * numPerPage;
// const end = start + numPerPage;
// const pageBusinesses = businesses.slice(start, end);

const [ results ] = await mysqlPool.query(
    "SELECT * FROM businesses ORDER BY id LIMIT ?,?",
    [ offset, numPerPage ]
);

/*
    * Generate HATEOAS links for surrounding pages.
    */
const links = {};
if (page < lastPage) {
    links.nextPage = `/businesses?page=${page + 1}`;
    links.lastPage = `/businesses?page=${lastPage}`;
}
if (page > 1) {
    links.prevPage = `/businesses?page=${page - 1}`;
    links.firstPage = '/businesses?page=1';
}

/*
    * Construct and send response.
    */
return{
    businesses: results
};
}

async function getBusinessesCount() {
    const [ results ] = await mysqlPool.query(
      "SELECT COUNT(*) AS count FROM businesses"
    );
    console.log("  -- results:", results);
    return results[0].count;
  }

module.exports = router;