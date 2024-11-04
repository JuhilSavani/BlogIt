import useAxiosProtected from "../useAxiosProtected";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useNotify from "../useNotify";

const useFetchBlogById = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosProtected = useAxiosProtected();
  const notify = useNotify();

  const fetchBlogById = async (blogId) => {
    console.log("[Blog] Fetching Blog by ID...");
    const { data } = await axiosProtected.get(
      `/protected/retrieve/blog/${blogId}`,
      { withCredentials: true }
    );
    return data;
  };

  const fetchBlogByIdQuery = useQuery({
    queryFn: () => fetchBlogById(id),
    queryKey: ["blog", id],
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 60,
    onError: (err) => {
      notify("error", err?.response?.data?.message || err.message);
      navigate(-1, { replace: true });
    },
  });

  return fetchBlogByIdQuery;
};

export default useFetchBlogById;

