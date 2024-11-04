import useAxiosProtected from "../useAxiosProtected";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import useNotify from "../useNotify";

const useEditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosProtected = useAxiosProtected();
  const notify = useNotify();
  const queryClient = useQueryClient();

  const editBlogById = async ({ blogId, editedBlog }) => {
    return await axiosProtected.put(`/protected/edit/blog/${blogId}`, editedBlog, {
      withCredentials: true,
    });
  };

  const editBlogByIdMutation = useMutation({
    mutationFn: editBlogById,
    onSuccess: () => {
      notify("success", "Blog updated successfully! 🎉");
      queryClient.invalidateQueries(["blogs"]);
      navigate(`/blog/${id}`, { replace: true });
    },
    onError: (err) => {
      notify("error", err?.response?.data?.message || err.message);
      navigate(-1, { replace: true });
    },
  });

  return editBlogByIdMutation;
};

export default useEditBlog;

// const editBlogByID = async ({ blogId, editedBlog }) => {
//   return await axiosProtected.put(`/protected/edit/blog/${blogId}`, editedBlog, {
//     withCredentials: true,
//   });
// };

// useMutation({
//   mutationFn: editBlogByID,
//   onSuccess: () => {
//     notify("success", "Blog updated successfully! 🎉");
//     queryClient.invalidateQueries(["blogs"]);
//     navigate(`/blog/${id}`, { replace: true });
//   },
//   onError: (err) => {
//     notify("error", err?.response?.data?.message || err.message);
//     navigate(-1, { replace: true });
//   },
// });
