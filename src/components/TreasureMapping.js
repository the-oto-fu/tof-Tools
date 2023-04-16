import { useState, useRef, useEffect } from "react";
import { Button, Container, Dimmer, Loader, Message, Dropdown, Label } from 'semantic-ui-react'
import { motion } from 'framer-motion'
import axios from 'axios';
import Camera from './utilities/Camera';

let reader = new FileReader();

const mapNumberOptions = [
  { key: '1', text: '1', value: '1' },
  { key: '2', text: '2', value: '2' },
  { key: '3', text: '3', value: '3' },
  { key: '4', text: '4', value: '4' },
  { key: '5', text: '5', value: '5' },
  { key: '6', text: '6', value: '6' },
  { key: '7', text: '7', value: '7' },
  { key: '8', text: '8', value: '8' }
]

const TreasureMapping = () => {
  const [imageFile, setImageFile] = useState();
  const [treasurePosition, setTrasurePotision] = useState();
  const [screenError, setScreenError] = useState();
  const [isAnalysing, setIsAnalysing] = useState(false);
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
      {
        mapImage: image64Content,
        imageExtention: imageExtention
      }
    )
      .then((response) => {
        setTrasurePotision(response.data);
        setIsAnalysing(false);
      })
      .catch((error) => {
        setIsAnalysing(false);
        setScreenError(error);
      });
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {screenError ?
        <Message negative>
          <Message.Header>エラーが発生しました。再操作をお願いします…🫨</Message.Header>
          <p>{screenError.message}</p>
        </Message>
        : null}

      {isCameraOn ?
        <Camera setImageFile={(imagefile) => setImageFile(imagefile)}
          cameraOff={() => cameraOff()}
          setScreenError={(error) => setScreenError(error)}
        />
        : null}

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

      {imageFile ?
        <>
          <img className="image-preview" src={imageFile} />
          <Container>
            <Button onClick={identifyTreasurePosition}>座標を特定!</Button>
          </Container>
        </>
        : null
      }

      {isAnalysing
        ? <Dimmer active inverted><Loader>座標特定中…</Loader></Dimmer>
        : null}
      {treasurePosition != null ?
        <motion.div
          initial={{ y: "100vh" }}
          animate={{ y: "0", 
          transitionEnd: {
            transform: "none"
          }}}
          transition={{ type: "spring", stiffness: 80 }}
        >
          <Container>
          <Label color="pink" size="big">
            {treasurePosition.position}
          </Label>
          <Dropdown
            placeholder='データ収集のため、特定にかけたの地図の番号を選択してくれると助かります🤗'
            selection
            options={mapNumberOptions}
            className="map-number-dropdown"
          />
          <img className="map-overview" src="/treasuremapping/overview_g15.png" />
          </Container>
        </motion.div>
        : null}
    </motion.div>
  )
}

export default TreasureMapping