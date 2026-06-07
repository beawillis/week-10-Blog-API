const express = require("express");
const router = express.Router();

const upload = require("../config/multer");
const auth = require("../middlewares/auth");

const {
  createArticle,
  getAllArticles,
  searchArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} = require("../controllers/article.controller");

router.post(
  "/",
  auth,
  upload.single("image"),
  createArticle
);
router.get("/", getAllArticles);
router.get("/search", searchArticles);
router.get("/:id", getArticleById);
router.patch("/:id", auth, upload.single("image"), updateArticle);
router.delete("/:id", auth, deleteArticle);

module.exports = router;