import React from "react";
import createDataContext from "./createDataContext";
import jsonServer from "../api/jsonServer";

const blogReducer = (state, action) => {
  switch (action.type) {
    case "get_blogposts":
      return action.payload;
    case "delete_blogpost":
      return state.filter((post) => post.id !== action.payload);
    case "edit_BlogPost":
      return state.map((post) => {
        return post.id === action.payload.id ? action.payload : post;
      });
    default:
      return state;
  }
};

const getBlogPosts = (dispatch) => {
  return async () => {
    try {
      const response = await jsonServer.get("/blogposts");
      dispatch({ type: "get_blogposts", payload: response.data });
    } catch (err) {
      console.log("get posts fail:", err);
    }
  };
};

const addBlogPost = (dispatch) => {
  return async (title, content, callback) => {
    try {
      await jsonServer.post("/blogposts", { title, content });
      callback && callback();
    } catch (err) {
      console.log("get posts fail:", err);
    }
  };
};

const editBlogPost = (dispatch) => {
  return async (id, title, content, callback) => {
    await jsonServer.put(`/blogposts/${id}`, { title, content });
    dispatch({ type: "edit_BlogPost", payload: { id, title, content } });
    callback && callback();
  };
};

const deleteBlogPost = (dispatch) => {
  return async (id) => {
    await jsonServer.delete(`/blogposts/${id}`);
    dispatch({ type: "delete_blogpost", payload: id });
  };
};

export const { Context, Provider } = createDataContext(
  blogReducer,
  { addBlogPost, deleteBlogPost, editBlogPost, getBlogPosts },
  []
);
