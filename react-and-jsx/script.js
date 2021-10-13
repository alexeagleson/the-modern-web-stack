"use strict";

const LikeButton = () => {
  let [liked, setLiked] = React.useState(false);

  if (liked) {
    // return React.createElement("span", null, "Liked! 👍");
    return /*#__PURE__*/React.createElement("span", {
      style: {
        width: "150px",
        height: "25px"
      }
    }, "Liked! \uD83D\uDC4D");
  }

  return /*#__PURE__*/React.createElement("button", {
    style: {
      width: "150px",
      height: "25px"
    },
    className: "like-button",
    onClick: () => {
      setLiked(true);
    }
  }, "Click to like!");
};

const domContainer = document.querySelector("#app");

const ManyButtons = () => {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap"
    }
  }, [...new Array(500)].map((_, index) => /*#__PURE__*/React.createElement(LikeButton, {
    key: index
  })));
};

ReactDOM.render( /*#__PURE__*/React.createElement(ManyButtons, null), domContainer);
