const LikeButton = () => {
  let [liked, setLiked] = React.useState(false);

  if (liked) {
    // return React.createElement("span", null, "Liked! 👍");
    return <span style={{ width: "150px", height: "25px" }}>Liked! 👍</span>;
  }

  return (
    <button
      style={{ width: "150px", height: "25px" }}
      className="like-button"
      onClick={() => {
        setLiked(true);
      }}
    >
      Click to like!
    </button>
  );
};

const domContainer = document.querySelector("#app");

const ManyButtons = () => {
  return (
    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
      {[...new Array(500)].map((_, index) => (
        <LikeButton key={index} />
      ))}
    </div>
  );
};

ReactDOM.render(<ManyButtons />, domContainer);
