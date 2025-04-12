import express from "express";
import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import Comment from "../models/comment.model.js";

export const postComment = async (req, res) => {
  const { content, parentId, userId } = req.body;
  const projectId = req.params.id;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const project = await Project.findById(projectId);
    const user = await User.findById(userId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newComment = new Comment({
      content,
      projectId,
      userId,
      parentId: parentId || null,
    });

    await newComment.save();

    project.totalComments += 1;
    await project.save();

    res
      .status(201)
      .json({ message: "Comment posted successfully", comment: newComment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating comment" });
  }
};

export const getComments = async (req, res) => {
  const projectId = req.params.id;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const comments = await Comment.find({ projectId })
      .populate("userId", "name username email profilePicture")
      .populate("parentId")
      .sort({ likes: -1, createdAt: -1 });

    return res.status(200).json({ message: "Comments retrieved successfully" , comments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching comments" });
  }
};

export const getUserComments = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const comments = await Comment.find({ userId })
      .populate("projectId")
      .populate("parentId")
      .sort({createdAt: -1 });

    return res.status(200).json({ message: "Comments retrieved successfully" , comments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching user comments" });
  }
};

export const editComment = async (req, res) => {
  const commentId = req.params.id;
  const { content } = req.body;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    comment.content = content;
    await comment.save();
    return res.status(200).json({ message: "Comment updated successfully", comment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating comment" });
  }
};

export const deleteComment = async (req, res) => {
  const commentId = req.params.id;
  const { projectId } = req.body;
  try {
    const comment = await Comment.findByIdAndDelete(commentId);
    const project = await Project.findById(projectId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.totalComments -= 1;
    await project.save();

    return res.status(200).json({ message: "Comment deleted successfully" , project });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting comment" });
  }
};

export const likeComment = async (req, res) => {
  const commentId = req.params.id;
  const {userId} = req.body;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (comment.likeBy.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You already liked this comment" });
    }

    comment.likeBy.push(userId);
    comment.likes += 1;
    await comment.save();
     
    return res.status(200).json({ message: "Comment liked successfully", comment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error liking comment" });
  }
};

export const dislikeComment = async (req, res) => {
  const commentId = req.params.id;
  const {userId} = req.body;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!comment.likeBy.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You haven't liked this comment" });
    }
    comment.likeBy.pull(userId);
    comment.likes -= 1;
    await comment.save();
    
    return res.status(200).json({ message: "Comment disliked successfully", comment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error disliking comment" });
  }
};
