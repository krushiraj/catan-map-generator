import { CatanBoard } from "../components/Map";

const page = () => {
  return (
    <div>
      <h1>Test Page</h1>
      <CatanBoard
        numberOfPlayer={4}
        invertTiles={false}
        sameNumberShouldTouch={false}
        sameResourcesShouldTouch={false}
        scarceResource="desert"
        players={[]}
        reset={false}
      />
    </div>
  );
};

export default page;
