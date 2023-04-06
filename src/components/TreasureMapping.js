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

  const getBase64Image = () => {
    return imageFile.split(/data:.*\/.*;base64,/)[1];
  }

  const identifyTreasurePosition = () => {
    setIsAnalysing(true);
    //この時点でisAnalysingをログに出してもfalseであり、ロード表示が遅れる。stateが即時反映されていない模様。
    setTrasurePotision();
    axios.post('https://8i7ttdp7w5.execute-api.ap-northeast-1.amazonaws.com/stage/g15',
      { mapImage: getBase64Image() }
    )
      .then((response) => {
        setTrasurePotision(response.data);
        setIsAnalysing(false);
      })
  }

  return (
    <>
      {isAnalysing 
      ? <Dimmer active inverted><Loader>座標特定中…</Loader></Dimmer>
      : null}
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
        {treasurePosition != null ? <>{treasurePosition.position}</> : null }
      </Container>
    </>
  )
}

export default TreasureMapping