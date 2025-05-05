import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backendGlobalRoute from "../../config/config";

export default function AddBlog() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState(""); // The ObjectId of the author
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [published, setPublished] = useState(false);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    try {
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user && user.id && user.id.length === 24) {
          setAuthor(user.id);
        } else {
          console.error("Invalid user ID: ", user);
          setAuthor(null);
        }
      } else {
        console.error("No user found in localStorage.");
        setAuthor(null);
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      setAuthor(null);
    }
  }, []);

  const handleImageChange = (e) => {
    setFeaturedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate author before submitting
    if (!author || author.length !== 24) {
      setMessage("Invalid author ID. Please log in again.");
      console.error("Invalid author ID:", author);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("author", author); // Ensure this is a valid ObjectId
    formData.append("summary", summary);
    formData.append("tags", tags);
    formData.append("category", category);
    formData.append("seoTitle", seoTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("published", published);
    if (featuredImage) {
      formData.append("featuredImage", featuredImage);
    }

    try {
      const response = await axios.post(
        `${backendGlobalRoute}/api/add-blog`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("Blog added successfully!");
      setTitle("");
      setBody("");
      setSummary("");
      setTags("");
      setCategory("");
      setSeoTitle("");
      setMetaDescription("");
      setPublished(false);
      setFeaturedImage(null);
      alert("New Blog added successfully.");
    } catch (error) {
      console.error("There was an error adding the blog!", error);
      setMessage("Error adding blog. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Blog</h2>
      {message && <p className="text-green-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="body"
          >
            Body
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
            rows="5"
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="summary"
          >
            Summary
          </label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            rows="2"
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="tags"
          >
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="category"
          >
            Category
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="seoTitle"
          >
            SEO Title
          </label>
          <input
            id="seoTitle"
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="metaDescription"
          >
            Meta Description
          </label>
          <textarea
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            rows="2"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="mr-2"
            />
            Publish
          </label>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="featuredImage"
          >
            Featured Image
          </label>
          <input
            id="featuredImage"
            type="file"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            Add Blog
          </button>
        </div>
      </form>
    </div>
  );
}
