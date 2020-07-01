import React from "react";
import useWindowScroll from "@react-hook/window-scroll";
import catNames from "cat-names";
import cats from "./cats";
import { styles } from "./theme";
import { Masonry } from "masonic";

const App = (props) => {
  const mainId = props.id
  // Constructs the data for our grid items
  const [items] = React.useState(() =>
    Array.from(Array(5000), () => ({
      id: i++,
      name: catNames.random(),
      src: randomChoice(cats)
    }))
  );

  const type = props.type?props.type:'youtube'

  
    const FakeCard = ({ data: { id, name, src } }) => (
        <div className={style("card")}>
        <img className={style("img")} alt="kitty" src={src} />
        <span style={{marginTop:"5px"}} children={'Description'} />
        <span children={<a href={`#/project/${type}/${mainId}/${id}`}>{name}</a>} />

        </div>
    );

  return (
    <div className="animated fadeIn">
        <main className={style("container")}>
            <div className={style("masonic")}>
                <Masonry
                // Provides the data for our grid items
                items={items}
                // Adds 8px of space between the grid cells
                columnGutter={8}
                // Sets the minimum column width to 172px
                columnWidth={250}
                // Pre-renders 5 windows worth of content
                overscanBy={5}
                // This is the grid item component
                render={FakeCard}
                />
            </div>
            </main>
    </div>
    
  );
};

const Header = () => {
  const scrollY = useWindowScroll(5);
  return (
    <h1 className={style("header", scrollY > 64 && "minify")}>
      <span role="img" aria-label="bricks">
        🧱
      </span>{" "}
      MASONIC
    </h1>
  );
};

const style = styles({
  masonic: `
    padding: 8px;
    width: 100%;
    max-width: 960px;
    margin: 0px auto 0;
    box-sizing: border-box;
    color:white;
  `,
  container: `
    min-height: 100vh;
    width: 100%;
  `,
  minify: ({ pad, color }) => `
    padding: ${pad.md};
    background-color: ${color.dark};
    color: ${color.light};
  `,
  header: ({ pad, color }) => `
    font-family: Quantico, sans-serif;
    font-size: 1.5rem;
    font-weight: 900;
    letter-spacing: -0.075em;
    color: ${color.body};
    top: 0;
    position: fixed;
    padding: ${pad.xl};
    z-index: 1000;
    width: 100%;
    text-align: center;
    transition: padding 200ms ease-in-out, background-color 200ms 200ms linear;
  `,
  card: ({ shadow, color, pad, radius }) => `
    display: flex;
    flex-direction: column;
    background: ${color.dark};
    border-radius: ${radius.lg};
    justify-content: center;
    align-items: center;
    transition: transform 100ms ease-in-out;
    width: 100%;
    min-height: 100px;

    span:last-of-type {
      color: #fff;
      padding: ${pad.md};
    }

    &:hover {
      position: relative;
      background: ${color.light};
      transform: scale(1.125);
      z-index: 1000;
      box-shadow: ${shadow.lg};
      color:black;
      cursor:pointer;
      span:last-of-type {
        color: ${color.dark};
        padding: ${pad.md};
      }
    }
  `,
  img: ({ radius }) => `
    width: 100%;
    display: block;
    border-top-left-radius: ${radius.md};
    border-top-right-radius: ${radius.md};
    display: block;
  `
});

const randomChoice = items => items[Math.floor(Math.random() * items.length)];
let i = 0;

export default App