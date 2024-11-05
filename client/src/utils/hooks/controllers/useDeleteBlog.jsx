import useAuth from "../useAuth";
import useAxiosProtected from "../useAxiosProtected";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import useNotify from "../useNotify";

const useDeleteBlog = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const axiosProtected = useAxiosProtected();
  const notify = useNotify();
  const queryClient = useQueryClient();

  const deleteBlogById = async (blogId) => {
    return await axiosProtected.delete(`/protected/delete/blog/${blogId}`, {
      withCredentials: true,
    });
  };

  const deleteBlogByIdMutation = useMutation({
    mutationFn: deleteBlogById,
    onSuccess: () => {
      notify("success", "Blog removed successfully!");
      queryClient.invalidateQueries(["blogs"]);
      navigate(`/dashboard/${auth?.username}`, { replace: true });
    },
    onError: (err) =>{
      notify("error", err?.response?.data?.message || err.message);
      navigate(-1, { replace: true });
    }
  });

  return  deleteBlogByIdMutation;
};

export default useDeleteBlog;
