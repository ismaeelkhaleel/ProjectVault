import express from 'express';
import { 
    postComment,
    getComments,
    getUserComments,
    editComment,
    deleteComment,
    likeComment,
    dislikeComment
} from '../controllers/comment.controller.js';

const router = express.Router();
router.post('/post-comment/:id', postComment);
router.get("/get-project-comments/:id", getComments);
router.get("/get-user-comments/:id", getUserComments);
router.put("/edit-comment/:id", editComment);
router.delete("/delete-comment/:id", deleteComment);
router.post("/like-comment/:id", likeComment);
router.post("/dislike-comment/:id", dislikeComment);


export default router;