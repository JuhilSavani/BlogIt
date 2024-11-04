import useAuth from "../useAuth";
import useAxiosProtected from "../useAxiosProtected";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import useNotify from "../useNotify";

const usePublishBlog = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const axiosProtected = useAxiosProtected();
  const notify = useNotify();
  const queryClient = useQueryClient();

  const publishBlog = async (blogPost) => {
    return await axiosProtected.post("/protected/publish/blog", blogPost, {
      withCredentials: true,
    });
  };

  const publishBlogMutation = useMutation({
    mutationFn: publishBlog,
    onSuccess: () => {
      notify("success", "Blog published successfully! 🎉");
      queryClient.invalidateQueries(["blogs"]);
      navigate(`/dashboard/${auth?.username}`);
    },
    onError: (err) => {
      notify("error", err?.response?.data?.message || err.message);
      navigate(-1, { replace: true });
    },
  });
  
  return publishBlogMutation;
};

export default usePublishBlog;
