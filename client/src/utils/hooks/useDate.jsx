const useDate = () => {
  return (x) => {
    const date = new Date(x);
    const formattedDate = date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .split(" ");
    return `${formattedDate[0]} ${formattedDate[1]}, ${formattedDate[2]}`;
  };
};

export default useDate;
