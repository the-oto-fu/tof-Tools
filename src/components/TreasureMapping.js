import React, { useState, useRef } from "react";
import { Button, Container, Dimmer, Loader } from 'semantic-ui-react'
import axios from 'axios';

let reader = new FileReader();

const TreasureMapping = () => {
  const [imageFile, setImageFile] = useState();
  const [isAnalysing, setIsAnalysing] = useState(false);
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

  const resizeImage = (imageData) => {
    const canvas = document.createElement('canvas');
    //canvas
  }

  const getBase64Image = () => {
    const tmp64img = imageFile.split(/^data:\w+\/\w+;base64,/)[1];
    return tmp64img;
  }

  const identifyTreasurePosition = () => {
    setIsAnalysing(true);
    setTrasurePotision();
      axios.post('https://8i7ttdp7w5.execute-api.ap-northeast-1.amazonaws.com/stage/g15',
      { mapImage: getBase64Image() }
    )
      .then((response) => {
        setTrasurePotision(response.data);
        setIsAnalysing(false);
      });
  }

  return (
    <>
      <Container>
        <Button onClick={handleClickImageSelect}>画像を選択</Button>
        <input
          type="file"
          id="inputfile"
          accept=".png,.jpg,.jpeg"
          ref={imageFileinputRef}
          onChange={(e) => handleChangeImageFileInput(e)}
          hidden
        />
      </Container>

      <Container>
        {imageFile ?
          <>
            <img className="image-preview" src={imageFile} />
            <Container>
              <Button onClick={identifyTreasurePosition}>座標を特定!</Button>
            </Container>
          </>
          : null
        }
      </Container>

      <Container>
        {isAnalysing
          ? <Dimmer active inverted><Loader>座標特定中…</Loader></Dimmer>
          : null}
        {treasurePosition != null ? <>{treasurePosition.position}</> : null}
      </Container>
    </>
  )
}

export default TreasureMapping