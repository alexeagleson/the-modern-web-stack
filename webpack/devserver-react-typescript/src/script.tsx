import ReactDOM from 'react-dom';

const x: number = 5;

const Welcome = () => {
  return <h1>Welcome</h1>;
};

const mountingNode = document.querySelector("#root");

ReactDOM.render(<Welcome />, mountingNode);
