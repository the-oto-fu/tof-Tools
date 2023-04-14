import { useState, useRef, useEffect } from "react";
import { Button, Container, Dimmer, Loader } from 'semantic-ui-react'
import { motion } from 'framer-motion'
import axios from 'axios';
import Camera from './utilities/Camera';

let reader = new FileReader();

const TreasureMapping = () => {
  const [imageFile, setImageFile] = useState();
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [treasurePosition, setTrasurePotision] = useState();
  const [isCameraOn, setIsCameraOn] = useState(false);

  //引数のblob画像をデータURL形式にしてStateにセットする
  const ReadImageAsURL = async (blobImage) => {
    reader.readAsDataURL(blobImage);
    reader.onload = () => {
      setImageFile(reader.result);
    };
  }

  useEffect(() => {
    //画面に対するペーストのイベント
    window.addEventListener("paste", function (e) {
      var item = Array.from(e.clipboardData.items).find(x => /^image\//.test(x.type));
      var blob = item.getAsFile();
      setTrasurePotision(null);
      ReadImageAsURL(blob);
    });
  }, []);

  const imageFileinputRef = useRef();
  const handleClickImageSelect = () => {
    imageFileinputRef.current.click();
  }

  const cameraOn = () => {
    setIsCameraOn(true);
  }

  const cameraOff = () => {
    setIsCameraOn(false);

  }

  const handleChangeImageFileInput = (e) => {
    setTrasurePotision(null);
    ReadImageAsURL(e.target.files[0]);
  }

  const getBase64Image = () => {
    //正規表現を()でくくるとキャプチャグループとなり、その部分が戻り値配列の[1]移行の要素として設定される
    //matches[0]がマッチした文字列全体、[1]が一つ目のキャプチャグループ(拡張子)、[2]が2つめのキャプチャグループ(base64内容)
    const matches = imageFile.match(/^data:\w+\/(\w+);base64,(.*)$/);
    return [matches[1], matches[2]];
  }

  const identifyTreasurePosition = () => {
    setIsAnalysing(true);
    setTrasurePotision();
    let imageExtention, image64Content;
    [imageExtention, image64Content] = getBase64Image();
    axios.post('https://8i7ttdp7w5.execute-api.ap-northeast-1.amazonaws.com/stage/g15',
      { mapImage: image64Content}
    )
      .then((response) => {
        setTrasurePotision(response.data);
        setIsAnalysing(false);
      })
      .catch(function (error) {
        console.log(error.response);
      });
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {isCameraOn ? <Camera setImageFile={(imagefile) => setImageFile(imagefile)} cameraOff={() => cameraOff()} /> : null}

      <Container>
        <Button onClick={handleClickImageSelect}>画像ファイルから</Button>
        <Button onClick={cameraOn}>カメラから(スマホ向け)</Button>
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
    </motion.div>
  )
}

export default TreasureMapping