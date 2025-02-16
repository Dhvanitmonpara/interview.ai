import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

// Use environment variable for security
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const COURSES_PER_PLATFORM = 2;

const CourseSearch = () => {
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses from APIs
  const fetchCourses = async (query: string) => {
    setSearchTriggered(true);
    setError(null);

    try {
      const [youtubeCourses, cs50Courses, mitCourses, freeCodeCampCourses] = await Promise.all([
        fetchYouTubeCourses(query),
        fetchCS50Courses(query),
        fetchMITCourses(),
        fetchFreeCodeCampCourses(),
      ]);

      const allCourses = [...youtubeCourses, ...cs50Courses, ...mitCourses, ...freeCodeCampCourses];

      if (allCourses.length > 0) {
        setCourses(allCourses);
      } else {
        setSearchTriggered(false);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("Failed to fetch courses. Please try again.");
    }
  };

  // Fetch YouTube Courses
  const fetchYouTubeCourses = async (query: string) => {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}+free+course&type=playlist&maxResults=${COURSES_PER_PLATFORM}&key=${YOUTUBE_API_KEY}`;
    const response = await axios.get(url);
    return response.data.items.map((item: any) => ({
      title: item.snippet.title,
      platform: "YouTube",
      url: `https://www.youtube.com/playlist?list=${item.id.playlistId}`,
      thumbnail: item.snippet.thumbnails.medium.url,
      rating: "N/A",
      duration: "Varies",
    }));
  };

  // Fetch CS50 Courses (YouTube-based)
  const fetchCS50Courses = async (query: string) => {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}+CS50+course&type=playlist&maxResults=${COURSES_PER_PLATFORM}&key=${YOUTUBE_API_KEY}`;
    const response = await axios.get(url);
    return response.data.items.map((item: any) => ({
      title: item.snippet.title,
      platform: "CS50 (YouTube)",
      url: `https://www.youtube.com/playlist?list=${item.id.playlistId}`,
      thumbnail: item.snippet.thumbnails.medium.url,
      rating: "N/A",
      duration: "Varies",
    }));
  };

  // Fetch MIT OpenCourseWare (Now Dynamic via RSS)
  const fetchMITCourses = async () => {
    try {
      const rssToJsonUrl = "https://api.rss2json.com/v1/api.json?rss_url=https://ocw.mit.edu/courses/rss/";
      const response = await axios.get(rssToJsonUrl);
      
      return response.data.items.slice(0, COURSES_PER_PLATFORM).map((course: any) => ({
        title: course.title,
        platform: "MIT OpenCourseWare",
        url: course.link,
        thumbnail: "https://ocw.mit.edu/images/mit-ocw-logo.svg",
        rating: "N/A",
        duration: "Varies",
      }));
    } catch (error) {
      console.error("Error fetching MIT OCW courses:", error);
      return [];
    }
  };

  // Fetch FreeCodeCamp Courses
  const fetchFreeCodeCampCourses = async () => {
    try {
      const url = "https://www.freecodecamp.org/news/ghost/api/v3/content/posts/?key=API_KEY&include=tags";
      const response = await axios.get(url);
      return response.data.posts.slice(0, COURSES_PER_PLATFORM).map((post: any) => ({
        title: post.title,
        platform: "FreeCodeCamp",
        url: post.url,
        thumbnail: post.feature_image || "https://www.freecodecamp.org/icons/icon-512x512.png",
        rating: "N/A",
        duration: "Varies",
      }));
    } catch (error) {
      console.error("Error fetching FreeCodeCamp courses:", error);
      return [];
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 text-white min-h-screen px-4 transition-all duration-500">
      {!searchTriggered && (
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 transition-opacity duration-300">
          Find the Best Free Courses from YouTube, Harvard, MIT & FreeCodeCamp!
        </h1>
      )}

      {/* Search Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (searchQuery.trim()) fetchCourses(searchQuery);
        }}
        className="w-full max-w-md"
      >
        <div className="relative">
          <input
            type="text"
            placeholder="What do you want to learn?"
            className="w-full px-4 py-2 text-lg border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
            <FaSearch size={20} />
          </button>
        </div>
      </form>

      {/* Course Results */}
      {searchTriggered && courses.length > 0 && (
        <div className="mt-8 w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course, index) => (
            <div key={index} className="bg-white p-3 rounded-lg shadow-md flex items-center gap-3 text-black">
              <img src={course.thumbnail} alt={course.title} className="w-24 h-16 object-cover rounded-md" />
              <div className="flex-1">
                <h2 className="text-sm font-bold">{course.title}</h2>
                <a href={course.url} target="_blank" className="text-blue-500">Enroll Now</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseSearch;
