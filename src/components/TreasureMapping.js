import React, { useState, useRef } from "react";
import { Button, Container, Table } from 'semantic-ui-react'
import axios from 'axios';

let reader = new FileReader();

const TreasureMapping = () => {
  const [imageFile, setImageFile] = useState();
  const [treasurePosition, setTrasurePotision] = useState();

  const imageFileinputRef = useRef();
  const handleClickImageSelect = () => {
    imageFileinputRef.current.click();
  }

  const handleChangeImageFileInput = (e) => {
    setTrasurePotision(null);
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setImageFile(reader.result);
    };
  }

  const getBase64Image = () => {
    return imageFile.split(/data:.*\/.*;base64,/)[1];
  }

  const identifyTreasurePosition = () => {
    setTrasurePotision();
    axios.post('https://8i7ttdp7w5.execute-api.ap-northeast-1.amazonaws.com/stage/g15',
    {mapImage: getBase64Image()}
    )
    .then((response) => {
        setTrasurePotision(response.data);
      })
  }

  const AfterLoadingContent = () => (
    <>
      {treasurePosition.position}
    </>
  );

  return (
    <>
      <Container>
        <Button onClick={handleClickImageSelect}>画像を選択</Button>
        <input
          type="file"
          id="inputfile"
          accept=".png,.jpeg"
          ref={imageFileinputRef}
          onChange={(e) => handleChangeImageFileInput(e)}
          hidden
        />
      </Container>

      <Container>
        {imageFile ?
          <img id="image-preview" src={imageFile} />
          : null
        }
      </Container>

      <Container>
        <Button onClick={identifyTreasurePosition}>座標を特定!</Button>
      </Container>

      <Container>
      {treasurePosition != null ? <AfterLoadingContent /> : null}
      </Container>
    </>
  )
}

export default TreasureMapping