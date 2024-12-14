import { useParams } from "react-router-dom";
import useAxiosProtected from "../useAxiosProtected";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useNotify from "../useNotify";

const useFetchBlogs = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const axiosProtected = useAxiosProtected();
  const notify = useNotify();
  
  const fetchBlogs = async (blogAuthor) => {
    console.log("[Dashboard] Fetching Blogs...");
    const { data } = await axiosProtected.get(
      `/protected/retrieve/blogs/${blogAuthor}`,
    );
    return data;
  };

  const fetchBlogsQuery = useQuery({
    queryKey: ["blogs", username],
    queryFn: () => fetchBlogs(username),
    enabled: Boolean(username), // nullish coalescing
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 60,
    onError: (err) => {
      notify("error", err?.response?.data?.message || err.message);
      navigate(-1, { replace: true });
    },
  });
  
  return fetchBlogsQuery;
};

export default useFetchBlogs;

